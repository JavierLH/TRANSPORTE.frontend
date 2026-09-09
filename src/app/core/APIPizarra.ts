import { environment } from "../environments/enviroments";

/**
 * Arma la URL de los endpoints que reciben año y prefijos. Los parámetros se
 * van sumando sólo si vienen, para no mandar `anio=undefined` ni un
 * `prefijos=` vacío.
 */
function armarUrlContenedores(recurso: string, anio: number | undefined, prefijos: string[]): string {
  const parametros: string[] = [];

  if (anio != null) {
    parametros.push(`anio=${anio}`);
  }

  // Se repite el parámetro por cada prefijo: así lo espera el string[] de .NET.
  prefijos.forEach((prefijo) => parametros.push(`prefijos=${prefijo}`));

  const query = parametros.length > 0 ? `?${parametros.join('&')}` : '';

  return `${environment.host}/Pizarra/${recurso}${query}`;
}

export const APIPizarra = {

  obtenerAcumuladosVikingo: (anio: number): string =>
    `${environment.host}/Pizarra/acumulado-anualVikingo?anio=${anio}`,

  obtenerAcumuladoRangoVikingo: (anioInicial: number, anioFinal: number): string =>
    `${environment.host}/Pizarra/acumulado-rango-anual?anioInicial=${anioInicial}&anioFinal=${anioFinal}`,

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

  // El año es opcional: si no se manda, el backend usa el actual.
  // Los prefijos acotan la empresa (Vikingo son 31-34); sin ellos no se filtra.
  obtenerContenedoresSencillo: (anio?: number, prefijos: string[] = []): string =>
    armarUrlContenedores('contenedores-sencillo', anio, prefijos),

  obtenerContenedoresFull: (anio?: number, prefijos: string[] = []): string =>
    armarUrlContenedores('contenedores-full', anio, prefijos),

  // Devuelve las cinco mercancías en una sola llamada.
  obtenerMercancias: (anio?: number, prefijos: string[] = []): string =>
    armarUrlContenedores('mercancias', anio, prefijos),

  // POST: las guías van en el cuerpo porque un Excel puede traer cientos y no
  // caben en un query string.
  verificarGuiasExistentes: (): string =>
    `${environment.host}/Pizarra/guias-existentes`,

};
