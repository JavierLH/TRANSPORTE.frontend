/**
 * Una unidad disponible para la empresa.
 *
 * Los datos salen del catálogo maestro, pero `idEquipo` es el del registro
 * hijo en Equipos: es el que se guarda en el viaje.
 */
export interface Equipo {
  idEquipo: number;

  /** El id de la unidad física en el catálogo maestro. */
  idReal: number | null;

  clave: string | null;
  idTipoEquipo: number | null;
  descripcion: string | null;
  placa: string | null;
  estatus: number | null;
  idEmpresa: number | null;
}

export interface EquipoPorTipo {
  idTipoEquipo: number;
  descripcion: string;
  equipos: Equipo[];
}

export interface Operador {
  idOperador: number | null;
  nombreOperador: string | null;
  estatus: number | null;
  idEmpresa: number | null;
}

export interface Ejecutivo {
  idEjecutivo: number | null;
  nombreEjecutivo: string | null;
  idEmpresa: number | null;
  activo: boolean | null;
}

export interface Cliente {
  idCliente: number | null;
  idEmpresa: number | null;
  nombreCliente: string | null;
  /** El cliente real del catálogo maestro al que corresponde. */
  idClienteMaestro?: number | null;
}

/** Un cliente del catálogo maestro, para elegir cuál anexar a una empresa. */
export interface ClienteMaestro {
  idClienteMaestro: number;
  rfc: string | null;
  razonSocial: string | null;
}

export interface TipoMercancia {
  idTipoMercancia: number | null;
  descripcion: string | null;
  idEmpresa: number | null;
}

export interface Operacion {
  idOperacion: number | null;
  tipoOperacion: string | null;
}

/** Sencillo o full: el catálogo Configuracion, el mismo del tarifario. */
export interface Configuracion {
  codigoConfiguracion: number;
  nombre: string | null;
}

export interface Origenes {
  idOrigen : number | null;
  origen1 : number | null;
}

export interface DestinoEstados{
  idEstado: number | null;
  destinoEstado1: number | null;
}

export interface DestinoEstadoCiudades {
  idCiudad: number | null;
  idEstado: number | null;
  destinoEstadoCiudad1: string | null;
}

export interface Patios {

  idPatio: number | null;
  idEstado: number | null;
  idTipoOperacion: number | null;
  idTipoPatio: number | null;
  descripcion: string | null;
  estatus: number | null;

}

export interface CatalogosViaje {
  equipos: EquipoPorTipo[];
  operadores: Operador[];
  ejecutivos: Ejecutivo[];
  clientes: Cliente[];
  tipoMercancia: TipoMercancia[];
  operaciones: Operacion[];
  configuraciones: Configuracion[];
  origenes: Origenes[];
  destinoEstados: DestinoEstados[];
  destinoEstadoCiudades: DestinoEstadoCiudades[];   // <-- antes decía "destinosEstadosCuidades", no coincidía con el JSON real
  patios: Patios[]
}
