import { environment } from "../environments/enviroments";

export const APIClientes = {
  obtenerTodosLosClientes: () => `${environment.host}/Cliente`,
  agregarNuevoCliente:     () => `${environment.host}/Cliente`,

  actualizarCliente: (idCliente: number) =>
    `${environment.host}/Cliente/${idCliente}`,

  eliminarClientePorId: (idCliente: number) =>
    `${environment.host}/Cliente/${idCliente}`,

  obtenerClientePorId: (idCliente: number) =>
    `${environment.host}/Cliente/${idCliente}`,

  obtenerClientesPorEmpresa: (idEmpresa : number) => {
    return `${environment.host}/Cliente/${idEmpresa}/clientes`
  },

  // ─── Catálogo maestro ──────────────────────────────────────────────

  // Sólo los que esa empresa todavía no tiene anexados.
  obtenerMaestrosDisponibles: (idEmpresa: number) =>
    `${environment.host}/Cliente/${idEmpresa}/maestros-disponibles`,

  anexarCliente: () => `${environment.host}/Cliente/anexar`,

};
