/**
 * Decide si el texto va en negro o en blanco sobre un fondo dado.
 *
 * Hace falta porque los colores del convenio los calcula la vista y van
 * desde verdes muy claros (#6bff97) hasta un rojo oscuro (#cf2000): con un
 * color de texto fijo, la mitad de los estados quedaría ilegible.
 *
 * @param fondo Color de fondo en hexadecimal, con o sin #.
 */
export function colorDeTextoPara(fondo: string | null | undefined): string {
  const negro = '#1f2d3d';
  const blanco = '#ffffff';

  if (!fondo) {
    return negro;
  }

  const hex = fondo.replace('#', '').trim();

  if (hex.length !== 6) {
    return negro;
  }

  const rojo = parseInt(hex.substring(0, 2), 16);
  const verde = parseInt(hex.substring(2, 4), 16);
  const azul = parseInt(hex.substring(4, 6), 16);

  if (isNaN(rojo) || isNaN(verde) || isNaN(azul)) {
    return negro;
  }

  // Luminancia percibida: el ojo humano distingue mucho más el verde que el
  // azul, por eso los tres canales no pesan igual.
  const luminancia = (rojo * 299 + verde * 587 + azul * 114) / 1000;

  return luminancia > 150 ? negro : blanco;
}
