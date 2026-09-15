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

  // ─── Tarifario ─────────────────────────────────────────────────────

  // Responde 200 tanto si la ruta existe como si no; el cuerpo trae el flag.
  buscarRuta: (idOrigen: number, idEstado: number, idCiudad: number): string =>
    `${environment.host}/Tarifario/ruta?idOrigen=${idOrigen}&idEstado=${idEstado}&idCiudad=${idCiudad}`,

  // Mismo endpoint para alta y edición: el backend decide cuál aplica.
  guardarRuta: (): string =>
    `${environment.host}/Tarifario/ruta`,

};
