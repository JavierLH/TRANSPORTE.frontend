import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, map, throwError } from 'rxjs';
import { PermisosService } from '../core/services/PermisosService';

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
    })
  );
};


export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }

};

export const publicGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const token = localStorage.getItem('token');

  if (token) {
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
