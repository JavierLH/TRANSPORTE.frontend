import { environment } from "../environments/enviroments";

/**
 * Arma la URL del filtrado de la vista. `idEmpresa` es opcional: si no va,
 * el backend devuelve los viajes de las cuatro empresas, que es lo que
 * necesita comercial.
 */
function armarUrlDeViajes(parametros: {
  idEmpresa?: number | null;
  fechaInicio?: string | null;
  fechaFin?: string | null;
  idOrigen?: number | null;
  idEstatus?: number | null;
  idCliente?: number | null;
  idEjecutivo?: number | null;
  idConvenio?: number | null;
}): string {
  const partes: string[] = [];

  // Sólo se agregan los que traen valor: mandar `idEmpresa=null` haría que
  // el backend lo reciba como texto y falle el enlace del parámetro.
  Object.entries(parametros).forEach(([clave, valor]) => {
    if (valor !== null && valor !== undefined && valor !== '') {
      partes.push(`${clave}=${valor}`);
    }
  });

  const query = partes.length > 0 ? `?${partes.join('&')}` : '';

  return `${environment.host}/ProgramacionViajes/filtrar-vista${query}`;
}

export const APIComercial = {

  /** Los viajes de todas las empresas, o de una si se indica. */
  obtenerViajes: armarUrlDeViajes,

  // Endpoint propio, no el de actualizar viaje: ése reescribe todas las
  // columnas del registro y borraría lo que comercial no captura.
  validarConvenio: (folio: number): string =>
    `${environment.host}/ProgramacionViajes/${folio}/convenio`,

  // ─── Convenios ─────────────────────────────────────────────────────
  //
  // Se piden por empresa. En esta pantalla la empresa sale del renglón
  // abierto, porque cada uno puede ser de una distinta.

  obtenerConveniosDeEmpresa: (idEmpresa: number): string =>
    `${environment.host}/Convenio/${idEmpresa}`,

  crearConvenio: (): string =>
    `${environment.host}/Convenio`,

};
