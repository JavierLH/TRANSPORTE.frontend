import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { map, tap, catchError } from 'rxjs/operators';
import { API } from '../API';

interface TienePermisoRespuesta {
  ruta: string;
  tieneAcceso: boolean;
}

@Injectable({ providedIn: 'root' })
export class PermisosService {

  private http = inject(HttpClient);

  // Evita repetir la petición cada vez que se navega a la misma ruta
  // dentro de la misma sesión de la SPA.
  private cache = new Map<string, boolean>();

  public tienePermiso(ruta: string): Observable<boolean> {
    const enCache = this.cache.get(ruta);

    if (enCache !== undefined) {
      return of(enCache);
    }

    return this.http.get<TienePermisoRespuesta>(API.verificarPermisoRuta(ruta)).pipe(
      map(respuesta => respuesta.tieneAcceso),
      tap(tieneAcceso => this.cache.set(ruta, tieneAcceso)),
      // Ante fallo de red o 401 se niega el acceso, pero NO se cachea el fallo.
      catchError(() => of(false))
    );
  }

  // Llamar al iniciar y al cerrar sesión: los permisos del nuevo usuario son otros.
  public limpiarCache(): void {
    this.cache.clear();
  }
}
