import { Component, ViewChild, ElementRef, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Button } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { PizarraService } from '../../../core/services/PizarraService';

/** Encabezados que no se muestran aunque vengan en el archivo. */
const COLUMNAS_IGNORADAS = ['TRASLADO', '#', 'PESO'];

/** Encabezado del que se toma el número que se valida contra la pizarra. */
const COLUMNA_GUIA = 'GUIA';

/** Una fila del Excel más el resultado de su verificación. */
interface RegistroImportado {
  datos: Record<string, any>;
  guia: number | null;
  yaExiste: boolean;
}

@Component({
  selector: 'app-cargar-registros',
  standalone: true,
  imports: [CommonModule, Button, TableModule, TagModule, ToastModule],
  providers: [MessageService],
  templateUrl: './cargar-registros.html',
  styleUrl: './cargar-registros.css',
})
export class CargarRegistros {

  private messageService = inject(MessageService);
  private pizarraService = inject(PizarraService);

  /** El input de archivo va oculto: el que se ve es el p-button. */
  @ViewChild('selectorArchivo') selectorArchivo!: ElementRef<HTMLInputElement>;

  columnas: string[] = [];
  registros: RegistroImportado[] = [];

  /** Nombre real de la columna de guía tal como viene en el archivo. */
  private nombreColumnaGuia = '';

  nombreArchivo = '';
  leyendo = false;
  verificando = false;

  get hayDatos(): boolean {
    return this.registros.length > 0;
  }

  get totalExistentes(): number {
    return this.registros.filter(registro => registro.yaExiste).length;
  }

  get totalNuevos(): number {
    return this.registros.length - this.totalExistentes;
  }

  abrirSelectorDeArchivo(): void {
    this.selectorArchivo.nativeElement.click();
  }

  async alSeleccionarArchivo(evento: Event): Promise<void> {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    this.nombreArchivo = archivo.name;
    this.leyendo = true;

    try {
      // Import dinámico: SheetJS pesa ~700 kB y sólo hace falta cuando alguien
      // va a leer un archivo. Así no entra al bundle inicial ni rebasa el
      // presupuesto de 1 MB configurado en angular.json.
      const XLSX = await import('xlsx');

      const contenido = await archivo.arrayBuffer();
      const libro = XLSX.read(contenido, { type: 'array' });
      const hoja = libro.Sheets[libro.SheetNames[0]];

      // header:1 devuelve arreglos crudos. No se usa el modo objeto porque la
      // primera fila del archivo es el título, no los encabezados.
      const matriz: any[][] = XLSX.utils.sheet_to_json(hoja, {
        header: 1,
        defval: null,
        blankrows: true
      });

      this.procesarMatriz(matriz);
    } catch (error) {
      console.error('Error al leer el archivo', error);
      this.limpiar();

      this.messageService.add({
        severity: 'error',
        summary: 'No se pudo leer',
        detail: 'El archivo no es un Excel válido o está dañado.'
      });
    } finally {
      this.leyendo = false;

      // Se limpia el input para que volver a elegir el MISMO archivo dispare
      // el evento change otra vez.
      input.value = '';
    }
  }

  /**
   * Convierte la matriz cruda del Excel en columnas y registros:
   *
   *  - Quita la primera fila (el título del reporte).
   *  - Quita la última (la fila de Totales).
   *  - Descarta las columnas cuyo encabezado viene vacío.
   *  - Descarta Traslado, # y Peso.
   */
  private procesarMatriz(matriz: any[][]): void {
    // Se necesitan al menos título + encabezados + una fila de datos + totales.
    if (matriz.length < 4) {
      this.limpiar();

      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo sin registros',
        detail: 'El archivo no contiene filas de datos.'
      });

      return;
    }

    const encabezados: any[] = matriz[1];

    // Sólo se conservan los índices con encabezado y que no estén en la lista
    // de ignoradas. Se trabaja con índices para poder recortar cada fila igual.
    const indicesUtiles: number[] = [];

    encabezados.forEach((encabezado, indice) => {
      const texto = (encabezado ?? '').toString().trim();

      if (texto === '') {
        return;
      }

      if (COLUMNAS_IGNORADAS.includes(texto.toUpperCase())) {
        return;
      }

      indicesUtiles.push(indice);
    });

    this.columnas = indicesUtiles.map(i => encabezados[i].toString().trim());

    this.nombreColumnaGuia =
      this.columnas.find(columna => columna.toUpperCase() === COLUMNA_GUIA) ?? '';

    // De la fila 2 hasta la penúltima: se salta el título y los totales.
    const filasDeDatos = matriz.slice(2, matriz.length - 1);

    this.registros = filasDeDatos
      // Una fila totalmente vacía no aporta nada a la vista previa.
      .filter(fila => fila.some(celda => celda !== null && celda !== ''))
      .map(fila => {
        const datos: Record<string, any> = {};

        indicesUtiles.forEach((indice, posicion) => {
          datos[this.columnas[posicion]] = fila[indice] ?? '';
        });

        return {
          datos,
          guia: this.extraerGuia(datos),
          // Se asume nuevo hasta que el backend diga lo contrario: así ningún
          // registro se pinta en rojo sin haberse verificado.
          yaExiste: false
        };
      });

    if (this.registros.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo sin registros',
        detail: 'No se encontraron filas con información.'
      });

      return;
    }

    this.verificarGuias();
  }

  /** El Excel puede traer la guía como número o como texto. */
  private extraerGuia(datos: Record<string, any>): number | null {
    if (!this.nombreColumnaGuia) {
      return null;
    }

    const valor = datos[this.nombreColumnaGuia];

    if (valor === null || valor === undefined || valor === '') {
      return null;
    }

    const numero = Number(valor);

    return Number.isFinite(numero) ? numero : null;
  }

  /**
   * Pregunta al backend cuáles guías ya están en la pizarra. Va una sola
   * petición con todas: preguntar renglón por renglón serían cientos.
   */
  private verificarGuias(): void {
    const guias = this.registros
      .map(registro => registro.guia)
      .filter((guia): guia is number => guia !== null);

    if (guias.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin guías que validar',
        detail: 'El archivo no trae la columna Guía o viene vacía.'
      });

      return;
    }

    this.verificando = true;

    this.pizarraService.verificarGuiasExistentes(guias).subscribe({
      next: (respuesta) => {
        // Set y no includes(): con cientos de renglones, buscar en un arreglo
        // por cada uno es cuadrático.
        const existentes = new Set(respuesta.existentes ?? []);

        this.registros.forEach(registro => {
          registro.yaExiste = registro.guia !== null && existentes.has(registro.guia);
        });

        this.verificando = false;

        this.messageService.add({
          severity: 'success',
          summary: 'Archivo verificado',
          detail: `${this.totalNuevos} por cargar, ${this.totalExistentes} ya registrados.`
        });
      },
      error: (err) => {
        console.error('Error al verificar las guías', err);
        this.verificando = false;

        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo verificar',
          detail: 'Se muestra la vista previa, pero sin validar contra la pizarra.'
        });
      }
    });
  }

  limpiar(): void {
    this.columnas = [];
    this.registros = [];
    this.nombreColumnaGuia = '';
    this.nombreArchivo = '';
  }
}
