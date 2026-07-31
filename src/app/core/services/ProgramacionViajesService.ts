import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../API';
import { ProgramacionViajes } from '../models/ProgramacionViajesDto';
import { ResultadoPaginado } from '../models/ResultadoPaginado';
import { ProgramacionDeViajesVista } from '../models/ProgramacionDeViajesVista';

@Injectable({
  providedIn: 'root',
})
export class ProgramacionViajesService {

  constructor(private http: HttpClient) { }

  /**
   * Envía un nuevo registro de viaje.
   * @returns El objeto completo creado en base de datos junto con su idProgramacion generado.
   */
  public insertarViaje(viaje: ProgramacionViajes): Observable<ProgramacionViajes> {
    return this.http.post<ProgramacionViajes>(
      API.insertarViaje(),
      viaje
    );
  }

  /**
   * Actualiza un registro existente mediante su ID.
   * @returns El objeto modificado con los últimos cambios aplicados.
   */
  public actualizarViaje(idProgramacion: number, viaje: ProgramacionViajes): Observable<ProgramacionViajes> {
    return this.http.put<ProgramacionViajes>(
      API.actualizarViaje(idProgramacion),
      viaje
    );
  }

  /**
   * Remueve un viaje del sistema.
   * @returns El objeto que acaba de ser eliminado de la base de datos.
   */
  public eliminarViaje(idProgramacion: number): Observable<ProgramacionViajes> {
    return this.http.delete<ProgramacionViajes>(
      API.eliminarViaje(idProgramacion)
    );
  }

  /**
   * Consulta los viajes mediante criterios específicos de negocio.
   * @returns Una lista estructurada de objetos del tipo ProgramacionViajes.
   */
  public obtenerPorFechaYEmpresa(fechaInicio: string, fechaFin: string, idEmpresa: number): Observable<ProgramacionViajes[]> {
    return this.http.get<ProgramacionViajes[]>(
      API.obtenerViajesFiltrados(fechaInicio, fechaFin, idEmpresa)
    );
  }

  public obtenerPorFechaYEmpresaVista(fechaInicio: string, fechaFin: string, idEmpresa: number): Observable<ProgramacionDeViajesVista[]> {
    return this.http.get<ProgramacionDeViajesVista[]>(
      API.obtenerViajesFiltradosVista(fechaInicio, fechaFin, idEmpresa)
    );
  }

  public obtenerViajePorId(id: number): Observable<ProgramacionViajes> {
    return this.http.get<ProgramacionViajes>(API.obtenerViajePorId(id));
  }

}
