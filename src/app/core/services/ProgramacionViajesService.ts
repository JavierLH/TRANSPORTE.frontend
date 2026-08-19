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
   * Remueve un viaje del sistema. Requiere la contraseña de autorización, que
   * viaja en el cuerpo de la petición y no en la URL.
   * @returns El objeto que acaba de ser eliminado de la base de datos.
   */
  public eliminarViaje(idProgramacion: number, contrasena: string): Observable<ProgramacionViajes> {
    return this.http.delete<ProgramacionViajes>(
      API.eliminarViaje(idProgramacion),
      { body: { contrasena } }
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

  /**
   * Sube el documento del viaje. El backend arma la ruta
   * Documentos/EMPRESA/CLIENTE/AÑO/FOLIO_AÑO/archivo.ext
   */
  public subirDocumento(idProgramacion: number, archivo: File): Observable<ProgramacionViajes> {
    const formData = new FormData();
    formData.append('archivo', archivo);

    return this.http.post<ProgramacionViajes>(
      API.subirDocumentoViaje(idProgramacion),
      formData
    );
  }

  /**
   * Descarga el documento como blob. Se pide por HttpClient (no window.open)
   * para que el interceptor adjunte el token del usuario.
   */
  public descargarDocumento(idProgramacion: number): Observable<Blob> {
    return this.http.get(API.subirDocumentoViaje(idProgramacion), {
      responseType: 'blob'
    });
  }

  public obtenerViajesFiltradosVistaPorCriterios(
      idEmpresa: number,
      fechaInicio?: string | null,
      fechaFin?: string | null,
      idOrigen?: number | null,
      idEstatus?: number | null,
      idCliente?: number | null,
      idEjecutivo?: number | null
    ): Observable<ProgramacionDeViajesVista[]> {
    return this.http.get<ProgramacionDeViajesVista[]>(
      API.obtenerViajesFiltradosVistaPorCriterios(
        idEmpresa, fechaInicio, fechaFin, idOrigen, idEstatus, idCliente, idEjecutivo
      )
    );
  }

}


