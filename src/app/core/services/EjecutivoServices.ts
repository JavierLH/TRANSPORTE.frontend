import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Ejecutivo } from "../models/CatalogosViajeDtos";
import { APIEjecutivos } from "../APIEjecutivos";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export default class EjecutivoService {

  private http = inject(HttpClient);

  obtenerTodosLosEjecutivos(): Observable<Ejecutivo[]> {
    return this.http.get<Ejecutivo[]>(APIEjecutivos.obtenerTodosLosEjecutivos());
  }

  obtenerEjecutivosPorEmpresa(idEmpresa : number) : Observable<Ejecutivo[]> {
    return this.http.get<Ejecutivo[]>(APIEjecutivos.obtenerEjecutivosPorEmpresa(idEmpresa));
  }

  agregarNuevoEjecutivo(ejecutivo: Ejecutivo): Observable<Ejecutivo> {
    return this.http.post<Ejecutivo>(APIEjecutivos.agregarNuevoEjecutivo(), ejecutivo);
  }

  actualizarEjecutivo(ejecutivo: Ejecutivo): Observable<void> {
    return this.http.put<void>(
      APIEjecutivos.actualizarEjecutivo(ejecutivo.idEjecutivo!),
      ejecutivo
    );
  }

  inhabilitarEjecutivo(idEjecutivo: number): Observable<void> {
    return this.http.put<void>(APIEjecutivos.inhabilitarEjecutivo(idEjecutivo), {});
  }

  eliminarEjecutivo(idEjecutivo: number): Observable<void> {
    return this.http.delete<void>(APIEjecutivos.eliminarEjecutivoPorId(idEjecutivo));
  }
}
