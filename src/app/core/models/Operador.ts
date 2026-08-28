/** Estatus del operador. La columna es int, no bit. */
export const OPERADOR_ACTIVO = 1;
export const OPERADOR_INACTIVO = 0;

export interface Operador {
  idOperador: number | null;
  nombreOperador: string | null;
  estatus: number | null;
  idEmpresa: number | null;
}
