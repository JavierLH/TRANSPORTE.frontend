import Aura from '@primeuix/themes/aura';
import { definePreset, palette } from '@primeuix/themes';

export const KarvePreset = definePreset(Aura, {
  // ═══════════════════════════════════════════════════════════
  //  COLOR DE MARCA
  // ═══════════════════════════════════════════════════════════
  semantic: {
    primary: palette('#EE4E22'),   // el hex aterriza en el 500

    // Ajustes transversales (afectan a todos los componentes)
    transitionDuration: '0.2s',
    focusRing: { width: '2px', style: 'solid', color: '{primary.color}', offset: '2px' },
    formField: { paddingX: '0.75rem', paddingY: '0.5rem', borderRadius: '6px' },
    content:   { borderRadius: '8px' },

    colorScheme: {
      light: {
        surface: palette('#78716c'),          // grises cálidos (stone), pegan con el naranja
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
        background:  '{surface.50}',
        color:       '{text.color}',
        borderColor: '{surface.200}',
        padding:     '0.75rem 1rem',
      },
      bodyCell: { padding: '0.6rem 1rem' },
      row: {
        stripedBackground: '{surface.50}',
        hoverBackground:   '{surface.100}',
      },
    },

    card: {
      root: { borderRadius: '10px', shadow: '0 1px 3px rgba(0,0,0,.08)' },
    },

    button: {
      root: { borderRadius: '6px' },
      // Los colores del botón salen de `primary` automáticamente.
      // Si algún día lo quieres DISTINTO al color de marca, va aquí:
      // colorScheme: { light: { root: { primary: { background: '#B23A18', borderColor: '#B23A18' } } } },
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
