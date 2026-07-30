export interface ResultadoPaginado<T> {
  items: T[];
  totalRegistros: number;
  paginaActual: number;
  tamanoPagina: number;
}
