import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { APIPizarra } from "../APIPizarra";
import { Observable } from "rxjs";

/** Año → 12 valores, uno por mes. Es lo que consume app-comparativa-anual. */
export type AcumuladoPorAnio = { [anio: number]: number[] };

/**
 * Mercancía → 12 valores. A diferencia de AcumuladoPorAnio, aquí la llave es el
 * nombre de la mercancía: el año viene fijo en la petición y cada serie de la
 * gráfica es una mercancía.
 */
export type AcumuladoPorMercancia = { [mercancia: string]: number[] };

/** Respuesta de la verificación de guías contra la pizarra. */
export interface GuiasVerificadas {
  existentes: number[];
  totalRevisadas: number;
}

@Injectable({
  providedIn: 'root',
})
export class PizarraService {

  constructor(private httpClient: HttpClient) { }

  obtenerViajesVikingo(anioDeseado: number): Observable<[]> {
    return this.httpClient.get<[]>(APIPizarra.obtenerAcumuladosVikingo(anioDeseado));
  }

  obtenerAcumuladoRangoVikingo(anioInicial: number, anioFinal: number): Observable<AcumuladoPorAnio> {
    return this.httpClient.get<AcumuladoPorAnio>(
      APIPizarra.obtenerAcumuladoRangoVikingo(anioInicial, anioFinal)
    );
  }

  obtenerAcumuladoRangoPorCodigos(
    anioInicial: number,
    anioFinal: number,
    codigos: string[]): Observable<AcumuladoPorAnio>
    {
      return this.httpClient.get<AcumuladoPorAnio>(
        APIPizarra.obtenerAcumuladoRangoPorCodigos(anioInicial, anioFinal, codigos)
      );
    }

  /**
   * Contenedores SENCILLO por mes. Sin año se usa el actual.
   * Cada renglón de la pizarra es un contenedor, no se agrupa.
   * Los prefijos acotan la empresa: Vikingo son ['31','32','33','34'].
   */
  obtenerContenedoresSencillo(anio?: number, prefijos: string[] = []): Observable<AcumuladoPorAnio> {
    return this.httpClient.get<AcumuladoPorAnio>(
      APIPizarra.obtenerContenedoresSencillo(anio, prefijos)
    );
  }

  /**
   * Contenedores FULL por mes. Sin año se usa el actual.
   * El backend agrupa por viaje para no contar dos veces el mismo.
   */
  obtenerContenedoresFull(anio?: number, prefijos: string[] = []): Observable<AcumuladoPorAnio> {
    return this.httpClient.get<AcumuladoPorAnio>(
      APIPizarra.obtenerContenedoresFull(anio, prefijos)
    );
  }

  /**
   * Viajes por mercancía y por mes. Sin año se usa el actual.
   * Trae las cinco mercancías en una sola petición: GENERAL,
   * PELIGROSOREFRIGERADO, REFRIGERADO, PELIGROSO y COMPLEMENTO.
   */
  obtenerMercancias(anio?: number, prefijos: string[] = []): Observable<AcumuladoPorMercancia> {
    return this.httpClient.get<AcumuladoPorMercancia>(
      APIPizarra.obtenerMercancias(anio, prefijos)
    );
  }

  /**
   * Revisa en una sola petición cuáles guías ya están en la pizarra.
   * Devuelve únicamente las existentes; las que no vengan en la respuesta son
   * nuevas.
   */
  verificarGuiasExistentes(guias: number[]): Observable<GuiasVerificadas> {
    return this.httpClient.post<GuiasVerificadas>(
      APIPizarra.verificarGuiasExistentes(),
      { guias }
    );
  }

}
