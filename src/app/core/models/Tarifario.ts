/** Fila de DestinoEstado: el estado al que pertenece un destino. */
export interface Estado {
  idEstado: number | null;
  destinoEstado1: string | null;
}

/**
 * Destino con el nombre de su estado ya resuelto por el backend.
 * Es lo que devuelve GET /destinos y lo que pinta la tabla.
 */
export interface Destino {
  idCiudad: number | null;
  destinoEstadoCiudad: string | null;
  idEstado: number | null;
  estado: string | null;
}

/**
 * Lo que espera POST /destinos. Los nombres coinciden con la entidad
 * DestinoEstadoCiudad del backend, que es distinta al DTO de lectura.
 */
export interface DestinoNuevo {
  idCiudad: number | null;
  idEstado: number | null;
  destinoEstadoCiudad1: string | null;
}

/** Fila de Origen. */
export interface Origen {
  idOrigen: number | null;
  origen1: string | null;
}

/**
 * Una ruta ya registrada en OrigenesDestinosTarifario, con los nombres
 * resueltos por el backend.
 */
export interface RutaTarifario {
  id: number;
  idOrigen: number;
  origen: string | null;
  idEstado: number;
  estado: string | null;
  idCiudad: number;
  destino: string | null;
  ltDieselPrecio: number;
  ow: number;
  renglones: RenglonTarifario[];
}

/**
 * Lo que responde GET /Tarifario/ruta. Que la ruta no exista no es un error,
 * por eso llega como un 200 con `existe` en false y `ruta` en null.
 */
export interface ExistenciaRuta {
  existe: boolean;
  ruta: RutaTarifario | null;
}

/**
 * Un renglón del tarifario: una mercancía en una configuración. No lleva
 * claveCot ni folio; los genera la base.
 */
export interface RenglonTarifario {
  idMercancia: number;
  codigoConfiguracion: number;
  kmxlRendimiento: number;
  costoFijoOperador: number;
  recargaDieselRf: number;
  tarifaDeseadaCliente: number;
  utilidadDeseada: number;
  casetas: number;
  kmOperador: number;
  operadorMonto: number;
}

/**
 * Lo que espera POST /Tarifario/ruta. No lleva id: la ruta se identifica por
 * origen + estado + destino, y el backend decide si inserta o actualiza.
 * Los renglones son uno por mercancía y configuración.
 */
export interface RutaNueva {
  idOrigen: number;
  idEstado: number;
  idCiudad: number;
  ltDieselPrecio: number;
  ow: number;
  renglones: RenglonTarifario[];
}
