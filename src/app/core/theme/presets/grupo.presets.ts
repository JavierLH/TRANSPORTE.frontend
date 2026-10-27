import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';

/**
 * Tema de las pantallas que no son de una empresa, sino del grupo:
 * comercial grupo y lo que venga después.
 *
 * No lleva color de marca a propósito. En estas pantallas conviven las
 * cuatro empresas en la misma tabla, así que pintarlas de rojo o de azul
 * diría que pertenecen a Vikingo o a Drakkar, y no es cierto. El gris es
 * la señal de que estás por encima de las cuatro.
 *
 * El manual de identidad no tiene un color para esto porque piensa en
 * empresas; la vista de grupo sólo existe dentro del sistema.
 */
export const GrupoPreset = definePreset(Aura, {
  // ═══════════════════════════════════════════════════════════
  //  COLOR NEUTRO
  // ═══════════════════════════════════════════════════════════
  semantic: {
    primary: palette('#334155'),   // slate oscuro; aterriza en el 500

    // Ajustes transversales (afectan a todos los componentes)
    transitionDuration: '0.2s',
    focusRing: { width: '2px', style: 'solid', color: '{primary.color}', offset: '2px' },
    formField: { paddingX: '0.75rem', paddingY: '0.5rem', borderRadius: '6px' },
    content:   { borderRadius: '8px' },

    colorScheme: {
      light: {
        // Zinc y no slate: si las superficies fueran del mismo tono frío
        // que el primary, el hover del renglón quedaría indistinguible
        // del fondo. El cambio de matiz es lo que lo hace visible.
        surface: palette('#71717a'),
        primary: {
          color:         '{primary.500}',
          contrastColor: '#ffffff',
          hoverColor:    '{primary.600}',
          activeColor:   '{primary.700}',
        },
        highlight: {
          background:      '{primary.50}',
          focusBackground: '{primary.100}',
          color:           '{primary.700}',
          focusColor:      '{primary.800}',
        },
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  //  COMPONENTES
  // ═══════════════════════════════════════════════════════════
  components: {
    datatable: {
      headerCell: {
        background:         '{primary.50}',
        color:              '{primary.800}',
        borderColor:        '{primary.200}',
        hoverBackground:    '{primary.100}',
        hoverColor:         '{primary.900}',
        selectedBackground: '{primary.100}',
        selectedColor:      '{primary.900}',
        padding:            '0.6rem 0.75rem',
        gap:                '0.5rem',
      },
      columnTitle: { fontWeight: '600' },
      sortIcon:    { color: '{primary.400}', hoverColor: '{primary.600}', size: '0.875rem' },

      bodyCell: {
        padding:     '0.5rem 0.75rem',
        borderColor: '{surface.100}',
      },
      row: {
        background:         '{surface.0}',
        color:              '{text.color}',
        stripedBackground:  '{surface.50}',
        hoverBackground:    '{primary.50}',
        hoverColor:         '{primary.800}',
        selectedBackground: '{primary.100}',
        selectedColor:      '{primary.900}',
      },

      paginatorTop:    { borderColor: '{surface.200}', borderWidth: '0 0 1px 0' },
      paginatorBottom: { borderColor: '{surface.200}', borderWidth: '1px 0 0 0' },
    },

    card: {
      root: { borderRadius: '10px', shadow: '0 1px 3px rgba(0,0,0,.08)' },
    },

    panel: {
      root: {
        background:   '{surface.0}',
        borderColor:  '{surface.200}',
        color:        '{text.color}',
        borderRadius: '6px',
      },
      header: {
        background:   '{primary.color}',
        color:        '{primary.contrast.color}',
        padding:      '0.75rem 1.125rem',
        borderColor:  '{surface.200}',
        borderWidth:  '0 0 1px 0',
        borderRadius: '6px 6px 0 0',
      },
      title:   { fontWeight: '600' },
      content: { padding: '1.125rem' },
      footer:  { padding: '0 1.125rem 1.125rem 1.125rem' },
    },

    button: {
      root: { borderRadius: '6px' },
    },

    panelmenu: {
      panel: {
        background:   '{surface.0}',
        borderColor:  '{surface.300}',
        borderWidth:  '1px',
        borderRadius: '1px',
        padding:      '0.25rem',
        first: { borderWidth: '1px', topBorderRadius: '6px' },
        last:  { borderWidth: '1px', bottomBorderRadius: '6px' },
      },

      item: {
        color:           '{text.color}',
        focusColor:      '{primary.color}',
        focusBackground: '{primary.50}',
        padding:         '0.5rem 0.75rem',
        borderRadius:    '4px',
        gap:             '0.5rem',
        icon: { color: '{text.muted.color}', focusColor: '{primary.color}' },
      },

      submenu: {
        indent: '1rem',
      },

      css: ({ dt }) => `
        .p-panelmenu-item.menu-activo > .p-panelmenu-item-content .p-panelmenu-item-link {
          color: ${dt('primary.color')};
          font-weight: 640;
        }
        .p-panelmenu-item.menu-activo > .p-panelmenu-item-content {
          background: ${dt('primary.50')};
        }
      `,
    },
  },

  // ═══════════════════════════════════════════════════════════
  //  TOKENS PROPIOS
  // ═══════════════════════════════════════════════════════════
  extend: {
    app: {
      headerBackground: '{primary.600}',
      headerColor:      '#ffffff',
      sidebarWidth:     '260px',
    },
  },
});
