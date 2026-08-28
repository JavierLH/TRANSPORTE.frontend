import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Operador } from "../models/Operador";
import { APIOperadores } from "../APIOperadores";

@Injectable({ providedIn: 'root' })
export default class OperadorService {

  private http = inject(HttpClient);

  obtenerTodosLosOperadores(): Observable<Operador[]> {
    return this.http.get<Operador[]>(APIOperadores.obtenerTodosLosOperadores());
  }

  obtenerOperadoresPorEmpresa(idEmpresa: number): Observable<Operador[]> {
    return this.http.get<Operador[]>(APIOperadores.obtenerOperadoresPorEmpresa(idEmpresa));
  }

  obtenerOperadorPorId(idOperador: number): Observable<Operador> {
    return this.http.get<Operador>(APIOperadores.obtenerOperadorPorId(idOperador));
  }

  agregarNuevoOperador(operador: Operador): Observable<Operador> {
    return this.http.post<Operador>(APIOperadores.agregarNuevoOperador(), operador);
  }

  actualizarOperador(operador: Operador): Observable<void> {
    return this.http.put<void>(
      APIOperadores.actualizarOperador(operador.idOperador!),
      operador
    );
  }

  cambiarEstatusOperador(idEmpresa: number, idOperador: number, estatus: number): Observable<void> {
    return this.http.put<void>(
      APIOperadores.cambiarEstatusOperador(idEmpresa, idOperador, estatus),
      {}
    );
  }

  eliminarOperador(idEmpresa: number, idOperador: number): Observable<void> {
    return this.http.delete<void>(APIOperadores.eliminarOperador(idEmpresa, idOperador));
  }
}
