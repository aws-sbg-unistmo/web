import type { Schema, Struct } from '@strapi/strapi';

export interface EquipoBloque extends Struct.ComponentSchema {
  collectionName: 'components_equipo_bloques';
  info: {
    description: 'Por ejemplo \u00ABEspecialidad\u00BB con un elemento por l\u00EDnea';
    displayName: 'Bloque de ficha';
    icon: 'bulletList';
  };
  attributes: {
    elementos: Schema.Attribute.Text &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 600;
      }>;
    titulo: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.SetMinMaxLength<{
        maxLength: 40;
      }>;
  };
}

export interface EquipoRed extends Struct.ComponentSchema {
  collectionName: 'components_equipo_redes';
  info: {
    description: 'Enlace a una red social o sitio web';
    displayName: 'Red social';
    icon: 'link';
  };
  attributes: {
    tipo: Schema.Attribute.Enumeration<
      [
        'linkedin',
        'instagram',
        'github',
        'youtube',
        'tiktok',
        'x',
        'facebook',
        'web',
      ]
    > &
      Schema.Attribute.Required;
    url: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'equipo.bloque': EquipoBloque;
      'equipo.red': EquipoRed;
    }
  }
}
