import { environment } from "../environments/enviroments";

export const APITarifario = {

  // ─── Estados ───────────────────────────────────────────────────────
  obtenerEstados: (): string =>
    `${environment.host}/OrigenesDestinos/estados`,

  // ─── Destinos ──────────────────────────────────────────────────────
  obtenerDestinos: (): string =>
    `${environment.host}/OrigenesDestinos/destinos`,

  obtenerDestinoPorId: (idCiudad: number): string =>
    `${environment.host}/OrigenesDestinos/destinos/${idCiudad}`,

  crearDestino: (): string =>
    `${environment.host}/OrigenesDestinos/destinos`,

  actualizarDestino: (idCiudad: number): string =>
    `${environment.host}/OrigenesDestinos/destinos/${idCiudad}`,

  eliminarDestino: (idCiudad: number): string =>
    `${environment.host}/OrigenesDestinos/destinos/${idCiudad}`,

  // ─── Orígenes ──────────────────────────────────────────────────────
  obtenerOrigenes: (): string =>
    `${environment.host}/OrigenesDestinos/origenes`,

  obtenerOrigenPorId: (idOrigen: number): string =>
    `${environment.host}/OrigenesDestinos/origenes/${idOrigen}`,

  crearOrigen: (): string =>
    `${environment.host}/OrigenesDestinos/origenes`,

  actualizarOrigen: (idOrigen: number): string =>
    `${environment.host}/OrigenesDestinos/origenes/${idOrigen}`,

  eliminarOrigen: (idOrigen: number): string =>
    `${environment.host}/OrigenesDestinos/origenes/${idOrigen}`,

};
