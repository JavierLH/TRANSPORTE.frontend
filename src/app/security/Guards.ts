import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, map, of, throwError } from 'rxjs';
import { PermisosService } from '../core/services/PermisosService';

/**
 * Dice si el JWT ya venció leyendo su campo `exp`.
 *
 * Sólo devuelve true cuando está seguro: si el token viene mal formado o no
 * trae `exp`, se deja pasar y que decida el backend con su 401. Así un cambio
 * en el formato del token no deja a nadie fuera del sistema.
 */
function tokenExpirado(token: string): boolean {
  try {
    const carga = token.split('.')[1];

    if (!carga) {
      return false;
    }

    // El JWT usa base64url, que cambia dos caracteres respecto a base64.
    const base64 = carga.replace(/-/g, '+').replace(/_/g, '/');
    const contenido = JSON.parse(atob(base64));

    if (typeof contenido.exp !== 'number') {
      return false;
    }

    // exp viene en segundos desde epoch; Date.now() en milisegundos.
    return contenido.exp * 1000 <= Date.now();
  } catch {
    return false;
  }
}

export const permisoRutaGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const permisosService = inject(PermisosService);

  const rutaModulo = route.data?.['rutaModulo'] as string | undefined;

  if (!rutaModulo) {
    return true;
  }

  return permisosService.tienePermiso(rutaModulo).pipe(
    map(tieneAcceso => {
      if (tieneAcceso) {
        return true;
      }

      return router.createUrlTree(['/siil/sin-permisos'], {
        queryParams: { ruta: state.url }
      });
    }),

    // Aquí sólo llega el 401 de sesión expirada: el servicio ya convierte
    // cualquier otro fallo en `false`. No se manda a sin-permisos porque no
    // es falta de permisos —el interceptor ya navegó al login—; devolver
    // false simplemente cancela esta navegación.
    catchError(() => of(false))
  );
};


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const permisosService = inject(PermisosService);
  const token = localStorage.getItem('token');

  // Se revisa la expiración aquí y no sólo la existencia del token: si no,
  // el usuario entra con una sesión vencida y se entera hasta que falla la
  // primera consulta, que además se veía como "no tienes permisos".
  if (!token || tokenExpirado(token)) {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    // Los permisos en caché son del usuario que se acaba de ir.
    permisosService.limpiarCache();

    router.navigate(['/login']);
    return false;
  }

  return true;
};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  // Un token vencido no cuenta como sesión: hay que dejar ver el login.
  if (token && !tokenExpirado(token)) {
    router.navigate(['/']);
    return false;
  }

  return true;
};


export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  const reqConToken = token
    ? req.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : req;

  return next(reqConToken).pipe(
    catchError((error) => {
      if (error.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('usuario');
        router.navigate(['/login']);
      }
      return throwError(() => error);
    })
  );
};
