import { environment } from "../environments/enviroments";

export const API = {

  obtenerTodosLosConvenios: (noConvenio: number) : string => `${environment.host}/Convenio/${noConvenio}`,
  crearNuevoConvenio: () : string => `${environment.host}/Convenio`,

  obtenerUsuarioPorID: (id: number): string => `${environment.host}/UsuariosSistema/${id}`,
  IniciarSesionEnSistema: () => `${environment.host}/UsuariosSistema`,

  obtenerTodosLosUsuarios: (): string => `${environment.host}/UsuariosSistema/todos`,

  insertarViaje: (): string => `${environment.host}/ProgramacionViajes`,
  actualizarViaje: (id: number): string => `${environment.host}/ProgramacionViajes/${id}`,
  eliminarViaje: (id: number): string => `${environment.host}/ProgramacionViajes/${id}`,
  subirDocumentoViaje: (idProgramacion: number): string => `${environment.host}/ProgramacionViajes/${idProgramacion}/documento`,

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

  obtenerViajesFiltradosVista: (fechaInicio: string, fechaFin: string, idEmpresa: number): string =>
  `${environment.host}/ProgramacionViajes/filtrar-vista-completa?fechaInicio=${fechaInicio}&fechaFin=${fechaFin}&idEmpresa=${idEmpresa}`,

  obtenerViajesFiltradosVistaPorCriterios: (
    idEmpresa: number,
    fechaInicio?: string | null,
    fechaFin?: string | null,
    idOrigen?: number | null,
    idEstatus?: number | null,
    idCliente?: number | null,
    idEjecutivo?: number | null,
    idConvenio?: number | null
  ): string => {
    let url = `${environment.host}/ProgramacionViajes/filtrar-vista?idEmpresa=${idEmpresa}`;

    if (fechaInicio) url += `&fechaInicio=${fechaInicio}`;
    if (fechaFin) url += `&fechaFin=${fechaFin}`;
    if (idOrigen != null) url += `&idOrigen=${idOrigen}`;
    if (idEstatus != null) url += `&idEstatus=${idEstatus}`;
    if (idCliente != null) url += `&idCliente=${idCliente}`;
    if (idEjecutivo != null) url += `&idEjecutivo=${idEjecutivo}`;
    if (idConvenio != null) url+= `&idConvenio=${idConvenio}`;

    return url;
  },

  obtenerAcumuladosVikingo: (anio : number): string => { return `${environment.host}/Pizarra/acumulado-anualVikingo?anio=${anio}` },

  obtenerAcumuladoRangoVikingo: (anioInicial: number, anioFinal: number): string => {
    return `${environment.host}/Pizarra/acumulado-rango-anual?anioInicial=${anioInicial}&anioFinal=${anioFinal}`;
  },

  obtenerAcumuladoRangoPorCodigos: (
    anioInicial: number,
    anioFinal: number,
    codigos: string[]
  ): string => {
    let url = `${environment.host}/Pizarra/acumulado-rango-anual-codigos?anioInicial=${anioInicial}&anioFinal=${anioFinal}`;

    codigos.forEach((codigo) => {
      url += `&codigos=${codigo}`;
    });

    return url;
  },

  verificarPermisoRuta: (ruta: string): string =>
  `${environment.host}/UsuariosSistema/tiene-permiso?ruta=${encodeURIComponent(ruta)}`,



};
