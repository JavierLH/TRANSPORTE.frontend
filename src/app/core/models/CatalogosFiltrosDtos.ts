import { Cliente, Ejecutivo } from './CatalogosViajeDtos';

export interface Origen {
  idOrigen: number | null;
  origen1: string | null;
}

export interface EstatusViaje {
  idEstatus: number;
  nombre: string;
  descripcion: string | null;
}

export interface FiltroDeBusqueda {
  origenesDestinos: Origen[];
  estatusViajes: EstatusViaje[];
  cliente: Cliente[];
  ejecutivos: Ejecutivo[];
}
