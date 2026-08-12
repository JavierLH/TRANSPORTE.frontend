import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection, Inject } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura'; // Puedes cambiar 'aura' por 'lara', 'material' o 'nora'
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideHttpClient, withInterceptors } from '@angular/common/http';

import { provideAppInitializer, inject } from '@angular/core';
import { BRANDS, BRAND_DEFAULT } from './core/theme/brands';
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
      preset: BRANDS[BRAND_DEFAULT].preset,
      options: {
        darkModeSelector: false,
        cssLayer: { name: 'primeng', order: 'theme, base, primeng, utilities' }
      }
    }
  }),
    provideAppInitializer(() => inject(ThemeService).restaurar()),
  ]
};
