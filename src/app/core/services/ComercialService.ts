import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIComercial } from "../APIComercial";
import { ProgramacionDeViajesVista } from "../models/ProgramacionDeViajesVista";
import Convenio from "../models/Convenio";

/**
 * Lo que comercial decide sobre el convenio de un viaje. Es lo único que
 * se manda: el endpoint toca esas tres columnas y nada más.
 */
export interface ValidacionDeConvenio {
  idConvenio: number | null;
  comentariosConvenio: string | null;

  /** 1 aceptado, 0 rechazado, null sin revisar. */
  estatusConvenio: number | null;

  /**
   * Nueva vigencia del convenio, en yyyy-MM-dd. Se guarda en la tabla
   * Convenios, no en el viaje: aplica a todos los que usen ese convenio.
   */
  vigenciaConvenio: string | null;

  /** Quién hizo el cambio; el backend lo guarda en la bitácora. */
  idUsuario: number | null;
}

/** Lo que acepta el filtrado; todo opcional. */
export interface FiltrosDeViajes {
  idEmpresa?: number | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  idOrigen?: number | null;
  idEstatus?: number | null;
  idCliente?: number | null;
  idEjecutivo?: number | null;
  idConvenio?: number | null;
}

@Injectable({ providedIn: 'root' })
export class ComercialService {

  private http = inject(HttpClient);

  /**
   * Trae los viajes de la vista. Sin `idEmpresa` vienen los de las cuatro
   * empresas: es el caso que usa el control de viajes de comercial.
   */
  obtenerViajes(filtros: FiltrosDeViajes = {}): Observable<ProgramacionDeViajesVista[]> {
    return this.http.get<ProgramacionDeViajesVista[]>(
      APIComercial.obtenerViajes(filtros)
    );
  }

  /** Guarda convenio, comentarios y estatus de un viaje. Nada más. */
  validarConvenio(folio: number, validacion: ValidacionDeConvenio): Observable<void> {
    return this.http.put<void>(
      APIComercial.validarConvenio(folio),
      validacion
    );
  }

  // ─── Convenios ─────────────────────────────────────────────────────

  obtenerConveniosDeEmpresa(idEmpresa: number): Observable<Convenio[]> {
    return this.http.get<Convenio[]>(
      APIComercial.obtenerConveniosDeEmpresa(idEmpresa)
    );
  }

  crearConvenio(convenio: Convenio): Observable<Convenio> {
    return this.http.post<Convenio>(APIComercial.crearConvenio(), convenio);
  }

}
