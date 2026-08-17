import { environment } from "../environments/enviroments";

export const APIEjecutivos = {
  obtenerTodosLosEjecutivos: () => `${environment.host}/Ejecutivo`,
  agregarNuevoEjecutivo:     () => `${environment.host}/Ejecutivo`,

  actualizarEjecutivo: (idEjecutivo: number) =>
    `${environment.host}/Ejecutivo/${idEjecutivo}`,

  inhabilitarEjecutivo: (idEjecutivo: number) =>
    `${environment.host}/Ejecutivo/${idEjecutivo}/inhabilitar`,

  eliminarEjecutivoPorId: (idEjecutivo: number) =>
    `${environment.host}/Ejecutivo/${idEjecutivo}`,

  obtenerEjecutivosPorEmpresa: (idEmpresa : number) => {
    return `${environment.host}/Ejecutivo/${idEmpresa}/ejecutivos`
  }

};
