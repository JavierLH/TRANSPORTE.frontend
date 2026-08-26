/** Un campo que cambió dentro de una edición. */
export interface CampoModificado {
  campo: string | null;
  valorAnterior: string | null;
  valorNuevo: string | null;
}

/**
 * Una edición del viaje: quién, cuándo y qué campos tocó.
 * El backend ya agrupa las filas de la bitácora que pertenecen al mismo
 * guardado, así que aquí sólo se pintan.
 */
export interface EdicionBitacora {
  fechaCambio: string | null;
  idUsuario: number | null;
  usuario: string | null;
  cambios: CampoModificado[];
}
