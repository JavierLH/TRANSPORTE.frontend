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
