// Lambda que recibe los formularios de la página (POST /unete y POST /contacto vía API Gateway HTTP API).
// 1. Verifica Cloudflare Turnstile (anti-bots)  2. Valida los campos  3. Guarda en DynamoDB  4. Avisa por correo con SES.
// Usa el AWS SDK v3 que ya viene incluido en el runtime de Node.js 22, así que no necesita dependencias.
import { randomUUID } from 'node:crypto';
import { DynamoDBClient, PutItemCommand } from '@aws-sdk/client-dynamodb';
import { SESv2Client, SendEmailCommand } from '@aws-sdk/client-sesv2';

const dynamo = new DynamoDBClient({});
const ses = new SESv2Client({});
const { TABLE_NAME, NOTIFY_EMAIL, FROM_EMAIL, TURNSTILE_SECRET } = process.env;
const DIECIOCHO_MESES = 60 * 60 * 24 * 548; // los registros se borran solos (TTL de DynamoDB)

const responder = (estado, cuerpo) => ({
  statusCode: estado,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(cuerpo),
});

const correoValido = (c) => typeof c === 'string' && c.length <= 200 && /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c);
const texto = (v, min, max) => typeof v === 'string' && v.trim().length >= min && v.trim().length <= max;

// Reglas de cada formulario: qué campos acepta y cómo se validan.
const FORMULARIOS = {
  unete: {
    asunto: (d) => `Nuevo registro: ${d.nombre}`,
    validar(d) {
      const errores = [];
      if (!texto(d.nombre, 2, 100)) errores.push('nombre');
      if (!correoValido(d.correo)) errores.push('correo');
      if (!texto(d.carrera, 2, 120)) errores.push('carrera');
      if (!texto(d.semestre, 1, 20)) errores.push('semestre');
      if (!['asistir', 'core-team', 'ponente'].includes(d.participacion)) errores.push('participacion');
      if (d.intereses && (!Array.isArray(d.intereses) || d.intereses.length > 10 || d.intereses.some((i) => !texto(i, 1, 40)))) errores.push('intereses');
      if (d.comentario && !texto(d.comentario, 0, 1000)) errores.push('comentario');
      return errores;
    },
    campos: ['nombre', 'correo', 'carrera', 'semestre', 'participacion', 'intereses', 'comentario'],
  },
  contacto: {
    asunto: (d) => `Contacto (${d.tipo}): ${d.nombre}`,
    validar(d) {
      const errores = [];
      if (!texto(d.nombre, 2, 100)) errores.push('nombre');
      if (!correoValido(d.correo)) errores.push('correo');
      if (!texto(d.tipo, 2, 60)) errores.push('tipo');
      if (d.organizacion && !texto(d.organizacion, 0, 120)) errores.push('organizacion');
      if (!texto(d.mensaje, 10, 2000)) errores.push('mensaje');
      return errores;
    },
    campos: ['nombre', 'correo', 'tipo', 'organizacion', 'mensaje'],
  },
};

async function verificarTurnstile(token, ip) {
  if (!TURNSTILE_SECRET) return true;
  if (typeof token !== 'string' || !token) return false;
  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret: TURNSTILE_SECRET, response: token, remoteip: ip ?? '' }),
    signal: AbortSignal.timeout(5000),
  });
  const json = await res.json().catch(() => ({}));
  return json.success === true;
}

// DynamoDB: cadenas -> S, listas de cadenas -> L
const aDynamo = (obj) =>
  Object.fromEntries(
    Object.entries(obj)
      .filter(([, v]) => v !== undefined && v !== '' && !(Array.isArray(v) && v.length === 0))
      .map(([k, v]) => [k, Array.isArray(v) ? { L: v.map((s) => ({ S: String(s) })) } : typeof v === 'number' ? { N: String(v) } : { S: String(v) }]),
  );

export async function handler(event) {
  const tipo = (event.rawPath ?? '').split('/').filter(Boolean).pop();
  const formulario = FORMULARIOS[tipo];
  if (!formulario) return responder(404, { ok: false, error: 'Formulario no encontrado' });

  let datos;
  try {
    const crudo = event.isBase64Encoded ? Buffer.from(event.body ?? '', 'base64').toString('utf8') : event.body ?? '';
    if (crudo.length > 10_000) return responder(413, { ok: false, error: 'Mensaje demasiado largo' });
    datos = JSON.parse(crudo);
  } catch {
    return responder(400, { ok: false, error: 'Datos inválidos' });
  }

  // Trampa para bots: el campo oculto "empresa" debe venir vacío. Se responde "ok" para no darles pistas.
  if (datos.empresa) return responder(200, { ok: true });

  const ip = event.requestContext?.http?.sourceIp;
  if (!(await verificarTurnstile(datos['cf-turnstile-response'], ip))) {
    return responder(400, { ok: false, error: 'No pudimos verificar que eres una persona' });
  }
  if (datos.privacidad !== 'si') return responder(400, { ok: false, error: 'Falta aceptar el aviso de privacidad' });

  const errores = formulario.validar(datos);
  if (errores.length) return responder(400, { ok: false, error: `Revisa estos campos: ${errores.join(', ')}` });

  const limpio = Object.fromEntries(
    formulario.campos.map((c) => [c, Array.isArray(datos[c]) ? datos[c].map((v) => String(v).trim()) : typeof datos[c] === 'string' ? datos[c].trim() : undefined]),
  );
  const ahora = new Date();
  const registro = {
    id: randomUUID(),
    formulario: tipo,
    creado: ahora.toISOString(),
    expira: Math.floor(ahora.getTime() / 1000) + DIECIOCHO_MESES,
    ...limpio,
  };

  await dynamo.send(new PutItemCommand({ TableName: TABLE_NAME, Item: aDynamo(registro) }));

  // El aviso por correo es "mejor esfuerzo": si SES falla, el registro ya quedó guardado.
  if (NOTIFY_EMAIL && FROM_EMAIL) {
    const cuerpo = formulario.campos
      .filter((c) => limpio[c] !== undefined && limpio[c] !== '')
      .map((c) => `${c}: ${Array.isArray(limpio[c]) ? limpio[c].join(', ') : limpio[c]}`)
      .join('\n');
    try {
      await ses.send(new SendEmailCommand({
        FromEmailAddress: FROM_EMAIL,
        Destination: { ToAddresses: [NOTIFY_EMAIL] },
        ReplyToAddresses: [limpio.correo],
        Content: { Simple: {
          Subject: { Data: `[Web SBG] ${formulario.asunto(limpio)}`.slice(0, 200), Charset: 'UTF-8' },
          Body: { Text: { Data: `${cuerpo}\n\nRegistro: ${registro.id}\nFecha: ${registro.creado}`, Charset: 'UTF-8' } },
        } },
      }));
    } catch (err) {
      console.error('No se pudo enviar el aviso por SES:', err.name, err.message);
    }
  }

  return responder(200, { ok: true });
}
