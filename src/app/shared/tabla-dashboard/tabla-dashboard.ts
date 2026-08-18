import { Component, Input, ContentChild, TemplateRef, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { Output, EventEmitter } from '@angular/core';
import { Button } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { ModalAgregarviajeViaje } from '../agregarviaje-modal/modal-agregarviaje-viaje/modal-agregarviaje-viaje';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { MessageService } from 'primeng/api';
import { CrearNuevViajeDto } from '../../core/models/CrearNuevoViajeDto';

/**
 * Definición de una columna de la tabla.
 * `field` debe ser el nombre de la propiedad del objeto de datos (no la etiqueta),
 * porque es lo que usa PrimeNG para ordenar.
 */
export interface ColumnaTabla {
  field: string;
  header: string;
}

@Component({
  standalone: true,
  imports: [
    CommonModule, // Obligatorio para que funcione *ngTemplateOutlet
    TableModule, // Obligatorio para <p-table>
    IconFieldModule, // Para <p-iconfield>
    InputIconModule, // Para <p-inputicon>
    InputTextModule, // Para pInputText
    TagModule,
    Button,
    DialogModule,
    ModalAgregarviajeViaje,
    ToastModule,
    RippleModule,
    TooltipModule
  ],
  providers: [MessageService],
  selector: 'app-tabla-dashboard',
  templateUrl: './tabla-dashboard.html',
  styleUrl: './tabla-dashboard.css',
})
export class TablaDashboardComponent implements OnInit{

  @Input() data: any[] = [];
  @Input() loading: boolean = false;
  @Input() dataKey: string = 'id';
  @Input() globalFilterFields: string[] = [];

  /**
   * Columnas del encabezado. Se declaran aquí y no como plantilla proyectada
   * porque `pSortableColumn` y `p-sortIcon` necesitan inyectar la instancia de
   * `Table`, y una plantilla proyectada resuelve sus dependencias en el
   * componente donde fue declarada, no donde se dibuja.
   *
   * El orden debe coincidir con el de los <td> del `bodyTemplate`.
   */
  @Input() columnas: ColumnaTabla[] = [];

  @ContentChild('bodyTemplate') bodyTemplate!: TemplateRef<any>;

  @Output() rowClicked = new EventEmitter<any>();

  @Input() datosEmpresa: any;

  private _filaSeleccionada: any;

  @Output() recargarTabla = new EventEmitter<void>(); // <-- 1. NUEVO: Evento para el Abuelo

  @Input()
  get filaSeleccionada(): any {
    return this._filaSeleccionada;
  }

  set filaSeleccionada(val: any) {
    this._filaSeleccionada = val;
    this.datos = val; // Sincroniza automáticamente con tu variable 'datos'
    this.rowClicked.emit(val);

    if (val) {
      console.log('Fila seleccionada:', val);

    } else {
      console.log('Fila deseleccionada');

    }
  }

  @Input() totalRecords: number = 0;
  @Input() rows: number = 20; // tamaño de página, antes estaba fijo en el HTML
  @Output() lazyLoad = new EventEmitter<{ pagina: number; tamanoPagina: number }>();

  onLazyLoad(event: any) {
    const pagina = Math.floor(event.first / event.rows) + 1;
    this.lazyLoad.emit({ pagina, tamanoPagina: event.rows });
  }

  copiando = false;

  /**
   * Copia la tabla al portapapeles en formato TSV (separado por tabuladores),
   * que es lo que Excel interpreta como columnas al pegar.
   *
   * Copia lo que el usuario está viendo: si hay filtro activo usa el resultado
   * filtrado, y respeta el orden actual. No se limita a la página visible.
   */
  async copiarTabla(tabla: Table): Promise<void> {
    if (!this.columnas?.length) {
      this.avisar('warn', 'Sin columnas', 'La tabla no tiene columnas configuradas.');
      return;
    }

    // filteredValue sólo existe cuando hay un filtro aplicado.
    const filas: any[] = tabla.filteredValue ?? tabla.value ?? [];

    if (!filas.length) {
      this.avisar('warn', 'Tabla vacía', 'No hay filas que copiar.');
      return;
    }

    this.copiando = true;

    try {
      const encabezados = this.columnas.map(c => c.header).join('\t');

      const cuerpo = filas
        .map(fila => this.columnas.map(c => this.limpiar(fila?.[c.field])).join('\t'))
        .join('\n');

      await navigator.clipboard.writeText(`${encabezados}\n${cuerpo}`);

      this.avisar(
        'success',
        'Copiado',
        `${filas.length} ${filas.length === 1 ? 'fila copiada' : 'filas copiadas'} al portapapeles.`
      );
    } catch (error) {
      console.error('Error al copiar la tabla', error);
      this.avisar('error', 'No se pudo copiar', 'El navegador bloqueó el acceso al portapapeles.');
    } finally {
      this.copiando = false;
    }
  }

  /**
   * Los tabuladores y saltos de línea dentro de una celda romperían el TSV
   * (Excel los leería como columna o fila nueva), así que se aplanan.
   */
  private limpiar(valor: any): string {
    if (valor === null || valor === undefined) {
      return '';
    }

    return String(valor).replace(/[\t\r\n]+/g, ' ').trim();
  }

  private avisar(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

  constructor(){

  }

  ngOnInit() {
    console.log(this.datosEmpresa);
  }

  private messageService = inject(MessageService);
    private cdr = inject(ChangeDetectorRef);

    mostrarModal = false;
    tituloFormulario = 'Agregar Viaje KARVE';

    datos : any;

  onRowSelect(event: any) {
    /*alert('select')
    this.datos = event.data;
    this.rowClicked.emit(event.data);*/
  }

  onRowUnselect(event: any) {
    /*alert('unselect')
    console.log(event.data);
    this.datos = null; // Esto es clave para que el botón vuelva a mostrar el toast
    this.rowClicked.emit(null);*/
  }


  abrirModal(titulo: string) {
    this.tituloFormulario = titulo;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  agregarViaje() {
    this.datosEmpresa.tipoDeOperacion = "CREAR";
    this.abrirModal('Agregar viaje '+this.datosEmpresa.nombreEmpresa);
  }

  cerrarModal() {
      this.mostrarModal = false;
      this.cdr.detectChanges();
  }

  gestionarEdicion() {
    if (this.filaSeleccionada) {
      this.datosEmpresa.tipoDeOperacion = "EDITAR";
      this.abrirModal('Editar viaje '+this.datosEmpresa.nombreEmpresa);
    } else {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, seleccione una fila para editar.'
      });
    }
  }

viajeGuardadoConExito() {
    this.cerrarModal();
    this.recargarTabla.emit(); // Disparamos el aviso hacia el componente Padre (Principal)
  }

  showWarn() {

    if(!this.datos){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    }

  }




}









