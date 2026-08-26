import { Component, Input, ContentChild, TemplateRef, ChangeDetectorRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule, Table } from 'primeng/table';
import { PasswordModule } from 'primeng/password';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageService, ConfirmationService } from 'primeng/api';
import { CrearNuevViajeDto } from '../../core/models/CrearNuevoViajeDto';
import { ProgramacionViajesService } from '../../core/services/ProgramacionViajesService';
import { ProgramacionViajes } from '../../core/models/ProgramacionViajesDto';
import { EdicionBitacora } from '../../core/models/BitacoraViaje';

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
    TooltipModule,
    ConfirmDialogModule,
    FormsModule,
    PasswordModule
  ],
  providers: [MessageService, ConfirmationService],
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
    private confirmationService = inject(ConfirmationService);
    private viajesService = inject(ProgramacionViajesService);
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

  mostrarDialogBitacora = false;
  cargandoBitacora = false;
  folioBitacora: number | null = null;
  bitacora: EdicionBitacora[] = [];

  /**
   * Nombres técnicos de las columnas traducidos a lo que el usuario reconoce.
   * La bitácora guarda el nombre de la propiedad de C# ("IdEquipoRemolque1"),
   * que no le dice nada a nadie. Lo que no esté aquí se muestra tal cual.
   */
  private readonly etiquetasDeCampos: Record<string, string> = {
    NoViaje: 'No. Viaje',
    IdConvenio: 'Convenio',
    Fecha: 'Fecha',
    IdCliente: 'Cliente',
    IdEjecutivo: 'Ejecutivo',
    Turno: 'Turno',
    IdEquipoRuta: 'Eco. Ruta',
    IdOperador: 'Operador Ruta',
    IdEquipoRetira: 'Eco. Retira',
    IdOperadorRetira: 'Operador Retira',
    IdTipoMercancia: 'Tipo Mercancía',
    IdTipoOperacion: 'Operación',
    CitaTerminal: 'Terminal',
    Comentarios: 'Comentarios',
    IdOrigen: 'Origen',
    IdEstado: 'Destino',
    IdCiudad: 'Ciudad',
    Comision: 'Comisión',
    Gasto: 'Gasto',
    Costo: 'Costo',
    Asignacion: 'Asignación',
    Conexiones: 'Temperatura',
    Estatus: 'Estatus',
    IdEquipoIngreso: 'Eco. Ingresa',
    IdOperadorIngreso: 'Operador Ingresa',
    Ingreso: 'Ingreso',
    Entrega: 'Entrega',
    HoraCita: 'Horario Cita',
    Envio: 'Envío POD',
    EnvioAsignacion: 'Envío Asignación',
    EnvioDocumentos: 'Envío Documentos',
    EnvioCita: 'Envío Cita',
    EnvioSeguimiento: 'Envío Datos',
    EnvioCcp: 'Envío CCP',
    SalidaPatio: 'Salida Patio',
    LlegadaPlanta: 'Llegada Planta',
    SalidaPlanta: 'Salida Planta',
    LlegadaPatio: 'Llegada Patio',
    EstatusCita: 'Estatus Cita',
    CostoEstadias: 'Costo por Estadía',
    Estadias: 'Estadías',
    CostoToEstadias: 'Total Estadías',
    ObservacionesMonitoreo: 'Observaciones Monitoreo',
    IdEquipoRemolque1: 'Primer Remolque',
    IdEquipoGenerador1: 'Primer Generador',
    IdEquipoRemolque2: 'Segundo Remolque',
    IdEquipoGenerador2: 'Segundo Generador',
    IdEquipoDolly: 'Dolly',
    ComentariosConvenio: 'Comentarios Convenio',
    EstatusConvenio: 'Estatus Convenio'
  };

  etiquetaDelCampo(campo: string | null): string {
    if (!campo) {
      return '';
    }

    return this.etiquetasDeCampos[campo] ?? campo;
  }

  /** Un valor vacío se muestra explícito: "vacío → algo" también es un cambio. */
  valorLegible(valor: string | null): string {
    return valor === null || valor === '' ? '(vacío)' : valor;
  }

  gestionarBitacora() {
    if (!this.filaSeleccionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, seleccione una fila para ver su bitácora.'
      });
      return;
    }

    // La tabla se alimenta de la vista, donde el id del viaje es `folio`.
    const folio = this.filaSeleccionada.folio;

    this.folioBitacora = folio;
    this.bitacora = [];
    this.cargandoBitacora = true;
    this.mostrarDialogBitacora = true;
    this.cdr.detectChanges();

    this.viajesService.obtenerBitacoraDelViaje(folio).subscribe({
      next: (ediciones) => {
        this.bitacora = ediciones;
        this.cargandoBitacora = false;
      },
      error: (err) => {
        console.error('Error al cargar la bitácora', err);
        this.cargandoBitacora = false;
        this.mostrarDialogBitacora = false;

        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo cargar',
          detail: `No se obtuvo el historial del viaje ${folio}.`
        });
      }
    });
  }

  cerrarDialogBitacora() {
    this.mostrarDialogBitacora = false;
    this.bitacora = [];
    this.folioBitacora = null;
  }

  mostrarDialogEliminar = false;
  contrasenaEliminar = '';
  eliminando = false;

  /** Abre el diálogo que pide la contraseña de autorización. */
  gestionarEliminacion() {
    if (!this.filaSeleccionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, seleccione una fila para eliminar.'
      });
      return;
    }

    this.contrasenaEliminar = '';
    this.mostrarDialogEliminar = true;
    this.cdr.detectChanges();
  }

  cerrarDialogEliminar() {
    this.mostrarDialogEliminar = false;
    this.contrasenaEliminar = '';
    this.eliminando = false;
  }

  confirmarEliminacion() {
    if (!this.contrasenaEliminar.trim()) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Escribe la contraseña para continuar.'
      });
      return;
    }

    // La tabla se alimenta de la vista, donde el id del viaje es `folio`.
    const folio = this.filaSeleccionada.folio;

    this.eliminando = true;

    this.viajesService.eliminarViaje(folio, this.contrasenaEliminar).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Viaje eliminado',
          detail: `Se eliminó el viaje con folio ${folio}.`
        });

        this.cerrarDialogEliminar();
        this.filaSeleccionada = null;
        this.recargarTabla.emit();
      },
      error: (err) => {
        this.eliminando = false;

        // 403: contraseña incorrecta. Se deja el diálogo abierto para reintentar.
        const detalle = err?.status === 403
          ? 'La contraseña es incorrecta.'
          : err?.error?.mensaje ?? 'No se pudo eliminar el viaje.';

        this.messageService.add({
          severity: 'error',
          summary: 'No se eliminó',
          detail: detalle
        });

        this.contrasenaEliminar = '';
      }
    });
  }

  duplicando = false;

  /**
   * Duplica el viaje seleccionado: pide el registro completo al backend y lo
   * vuelve a insertar como uno nuevo. El id no se envía, así que SQL Server
   * genera el folio del duplicado.
   */
  duplicarViaje() {
    if (!this.filaSeleccionada) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Por favor, seleccione una fila para duplicar.'
      });
      return;
    }

    // La tabla se alimenta de la vista, donde el id del viaje es `folio`.
    const folio = this.filaSeleccionada.folio;

    this.confirmationService.confirm({
      header: 'Duplicar viaje',
      message: `¿Estás seguro que deseas duplicar el viaje con folio ${folio}?`,
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Sí, duplicar',
      rejectLabel: 'Cancelar',
      accept: () => this.ejecutarDuplicado(folio)
    });
  }

  private ejecutarDuplicado(folio: number) {
    this.duplicando = true;

    this.viajesService.obtenerViajePorId(folio).subscribe({
      next: (viaje) => {
        if (!viaje) {
          this.duplicando = false;
          this.messageService.add({
            severity: 'error',
            summary: 'No se pudo duplicar',
            detail: `No se encontró el viaje con folio ${folio}.`
          });
          return;
        }

        const duplicado: ProgramacionViajes = {
          ...viaje,
          // Copia idéntica salvo el folio: se omite el id para que SQL Server
          // genere uno nuevo. Todo lo demás se conserva tal cual.
          idProgramacion: undefined
        };

        this.viajesService.insertarViaje(duplicado).subscribe({
          next: (creado) => {
            this.duplicando = false;

            this.messageService.add({
              severity: 'success',
              summary: 'Viaje duplicado',
              detail: `Se creó el viaje con folio ${creado?.idProgramacion ?? 'nuevo'} a partir del ${folio}.`
            });

            this.filaSeleccionada = null;
            this.recargarTabla.emit();
          },
          error: (err) => {
            this.duplicando = false;
            console.error('Error al insertar el viaje duplicado', err);
            this.messageService.add({
              severity: 'error',
              summary: 'No se pudo duplicar',
              detail: 'El servidor rechazó el nuevo viaje.'
            });
          }
        });
      },
      error: (err) => {
        this.duplicando = false;
        console.error('Error al obtener el viaje a duplicar', err);
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo duplicar',
          detail: `No se pudieron leer los datos del viaje ${folio}.`
        });
      }
    });
  }

  showWarn() {

    if(!this.datos){
      this.messageService.add({ severity: 'warn', summary: 'Warn', detail: 'Message Content' });
    }

  }




}









