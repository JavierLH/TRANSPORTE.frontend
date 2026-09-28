import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
// El de security/Guards.ts: además de poner el token, atiende el 401 y
// devuelve al login cuando la sesión expira.
import { authInterceptor } from './security/Guards';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAppInitializer, inject } from '@angular/core';
import { BRANDS, marcaGuardada } from './core/theme/brands';
import { ThemeService } from './core/theme/theme.services';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimationsAsync(),
    provideHttpClient(withInterceptors([authInterceptor])),
    providePrimeNG({
      theme: {
        // Preset de la marca persistida. Tiene que entrar por aquí:
        // aplicarlo después con `usePreset` lo pisa el effect interno de PrimeNG.
        preset: BRANDS[marcaGuardada()].preset,
        options: {
          darkModeSelector: false,
          cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' }
        }
      }
    }),
    // Instancia el servicio para que su constructor enganche el router
    // y aplique el `brand` de cada ruta al navegar.
    provideAppInitializer(() => { inject(ThemeService); }),
  ]
};
