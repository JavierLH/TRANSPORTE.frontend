import { environment } from "../environments/enviroments";

export const APIOperadores = {
  obtenerTodosLosOperadores: () => `${environment.host}/Operadores`,
  agregarNuevoOperador:      () => `${environment.host}/Operadores`,

  obtenerOperadorPorId: (idOperador: number) =>
    `${environment.host}/Operadores/${idOperador}`,

  actualizarOperador: (idOperador: number) =>
    `${environment.host}/Operadores/${idOperador}`,

  obtenerOperadoresPorEmpresa: (idEmpresa: number) =>
    `${environment.host}/Operadores/${idEmpresa}/operadores`,

  // El idEmpresa va en la ruta porque el backend verifica que el operador
  // pertenezca a esa empresa antes de tocarlo.
  cambiarEstatusOperador: (idEmpresa: number, idOperador: number, estatus: number) =>
    `${environment.host}/Operadores/${idEmpresa}/operadores/${idOperador}/estatus/${estatus}`,

  eliminarOperador: (idEmpresa: number, idOperador: number) =>
    `${environment.host}/Operadores/${idEmpresa}/operadores/${idOperador}`,
};
