import { environment } from "../environments/enviroments";

export const API = {

  obtenerUsuarioPorID: (id: number): string => `${environment.host}/UsuariosSistema/${id}`,
  IniciarSesionEnSistema: () => `${environment.host}/UsuariosSistema`,

  obtenerTodosLosUsuarios: (): string => `${environment.host}/UsuariosSistema/todos`,

  insertarViaje: (): string => `${environment.host}/ProgramacionViajes`,
  actualizarViaje: (id: number): string => `${environment.host}/ProgramacionViajes/${id}`,
  eliminarViaje: (id: number): string => `${environment.host}/ProgramacionViajes/${id}`,

  obtenerViajesFiltrados: (fechaInicio: string, fechaFin: string, idEmpresa: number): string =>
  `${environment.host}/ProgramacionViajes/filtrar?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idEmpresa=${idEmpresa}`,

  obtenerTodasLasEmpresas: (): string => `${environment.host}/Empresas`,
  actualizarPermisos: (): string => `${environment.host}/Empresas/actualizar-permisos`,
  obtenerUsuariosPorEmpresa: (idEmpresa: number): string => `${environment.host}/Empresas/${idEmpresa}`,
  obtenerRolesPorEmpresa: (idEmpresa: number): string => `${environment.host}/Empresas/${idEmpresa}/roles`,
  actualizarRolUsuario: (idEmpresa: number, idUsuario: number): string =>
  `${environment.host}/Empresas/${idEmpresa}/usuarios/${idUsuario}/rol`,

  obtenerPermisosConRuta: (): string => `${environment.host}/Roles/permisos`,
  obtenerFunciones: (): string => `${environment.host}/Roles/funciones`,
  obtenerPermisosDeRol: (idRol: number): string => `${environment.host}/Roles/${idRol}/permisos`,
  guardarPermisosDeRol: (idRol: number): string => `${environment.host}/Roles/${idRol}/permisos`,
  obtenerCatalogosViajeEmpresa: (idEmpresa: number): string => `${environment.host}/Empresas/${idEmpresa}/catalogos-viaje`,
  obtenerViajePorId: (idViajeProgramacion: number): string => `${environment.host}/ProgramacionViajes/${idViajeProgramacion}`,
  obtenerCatalagosPorEmpresa: (idEmpresa: number): string => `${environment.host}/Empresas/${idEmpresa}/filtros-busqueda`,

};
