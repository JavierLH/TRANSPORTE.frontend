declare const process: any;

/**
 * Configuración de producción. Angular usa este archivo en lugar de
 * enviroments.ts sólo cuando se compila con `ng build` (configuración
 * production, ver fileReplacements en angular.json). `ng serve` sigue usando
 * el original.
 *
 * Debe exportar exactamente lo mismo que enviroments.ts: Angular reemplaza el
 * archivo completo, así que cualquier export que falte aquí rompe la
 * compilación de producción.
 */
export const environment = {
  production: true,
  // Relativo: la API y Angular se publican juntos en el mismo sitio de IIS.
  host: '/api',
};

export const IDsEmpresas = {
  KARVE: 1,
  VIKINGO: 2,
  DRAKKAR: 3,
  LETCA: 4
}
