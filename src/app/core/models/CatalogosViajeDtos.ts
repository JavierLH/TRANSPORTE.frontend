export interface Equipo {
  idEquipo: number;
  clave: string | null;
  idTipoEquipo: number | null;
  descripcion: string | null;
  placa: string | null;
  serie: string | null;
  marca: string | null;
  modelo: string | null;
  anio: number | null;
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
}

export interface Cliente {
  idCliente: number | null;
  idEmpresa: number | null;
  nombreCliente: string | null;
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
  origenes: Origenes[];
  destinoEstados: DestinoEstados[];
  destinoEstadoCiudades: DestinoEstadoCiudades[];   // <-- antes decía "destinosEstadosCuidades", no coincidía con el JSON real
  patios: Patios[]
}
