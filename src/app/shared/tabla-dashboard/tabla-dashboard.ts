import { Component, Input, ContentChild, TemplateRef, ChangeDetectorRef, inject, OnInit, OnDestroy, OnChanges, SimpleChanges, ViewChild, ElementRef } from '@angular/core';
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
import { colorDeTextoPara } from '../../core/utilidades/contraste';

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
export class TablaDashboardComponent implements OnInit, OnDestroy, OnChanges {

  ngOnDestroy(): void {
    clearTimeout(this.temporizadorResaltado);
  }

  ngOnChanges(changes: SimpleChanges): void {
    // Después de guardar, el padre recarga y manda un arreglo nuevo. Hasta
    // que ese arreglo llega no hay en qué buscar el folio guardado.
    if (changes['data'] && this.folioPorUbicar != null) {
      // Se difiere un ciclo: p-table recibe el [value] nuevo después de este
      // hook, y hasta entonces no ha aplicado orden ni filtro.
      setTimeout(() => this.irAlFolioGuardado());
    }
  }


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
   * Columna cuyo fondo no es fijo sino que sale de una propiedad del propio
   * renglón, como el convenio en programación de viajes: la vista calcula el
   * color y la tabla sólo lo pinta. Si no se pasa, todas las celdas van sin
   * fondo.
   */
  @Input() columnaColoreada?: { field: string; propiedadColor: string };

  /**
   * Copia la tabla al portapapeles en dos formatos a la vez:
   *
   * - `text/plain` en TSV, que es lo que leen el Bloc de notas y WhatsApp.
   * - `text/html`, que es lo que prefieren Excel y Word, y que conserva el
   *   formato: encabezados con el color de la marca y la celda del convenio
   *   con el color que le calculó la vista.
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

      await this.escribirPortapapeles(
        `${encabezados}\n${cuerpo}`,
        this.construirHtml(filas)
      );

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

  copiandoVista = false;

  /**
   * Copia la tabla tal como se ve: sólo los renglones de la página actual y
   * con los colores que el navegador está pintando en ese momento.
   *
   * Es el complemento del otro botón. Aquel copia todos los renglones del
   * filtro; éste deja que quien va a pegar decida cuáles quiere — cambia el
   * tamaño de página o se mueve de página y copia lo que quedó a la vista.
   */
  async copiarVista(): Promise<void> {
    // Se acota al datatable: el componente tiene diálogos anidados que
    // podrían traer sus propias <table> y colarse en la copia.
    const raiz = (this.host.nativeElement as HTMLElement).querySelector('.p-datatable');

    if (!raiz) {
      this.avisar('warn', 'Sin tabla', 'La tabla todavía no está en pantalla.');
      return;
    }

    // Con [scrollable] PrimeNG puede partir encabezado y cuerpo en dos
    // <table> distintas, así que se recorren todas y se juntan.
    const tablas = Array.from(raiz.querySelectorAll('table')) as HTMLTableElement[];

    const encabezados = tablas.flatMap(tabla => Array.from(tabla.tHead?.rows ?? []));

    const renglones = tablas
      .flatMap(tabla => Array.from(tabla.tBodies))
      .flatMap(cuerpo => Array.from(cuerpo.rows))
      // El mensaje de "sin registros" es un solo <td> con colspan.
      .filter(renglon => renglon.cells.length > 1);

    if (!renglones.length) {
      this.avisar('warn', 'Tabla vacía', 'No hay nada visible que copiar.');
      return;
    }

    this.copiandoVista = true;

    try {
      const html =
        `<table style="border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:10pt">` +
        `<thead>${encabezados.map(renglon => this.renglonAHtml(renglon, true)).join('')}</thead>` +
        `<tbody>${renglones.map(renglon => this.renglonAHtml(renglon, false)).join('')}</tbody>` +
        `</table>`;

      const texto = [...encabezados, ...renglones]
        .map(renglon =>
          Array.from(renglon.cells).map(celda => this.limpiar(celda.innerText)).join('\t')
        )
        .join('\n');

      await this.escribirPortapapeles(texto, html);

      this.avisar(
        'success',
        'Copiado',
        `${renglones.length} ${renglones.length === 1 ? 'fila visible copiada' : 'filas visibles copiadas'}.`
      );
    } catch (error) {
      console.error('Error al copiar la vista', error);
      this.avisar('error', 'No se pudo copiar', 'El navegador bloqueó el acceso al portapapeles.');
    } finally {
      this.copiandoVista = false;
    }
  }

  /**
   * Un <tr> del DOM pasado a HTML con sus colores ya resueltos. Hay que
   * resolverlos aquí porque Excel no recibe las hojas de estilo: lo que no
   * vaya en el atributo `style` de la celda se pierde.
   */
  private renglonAHtml(renglon: HTMLTableRowElement, esEncabezado: boolean): string {
    const etiqueta = esEncabezado ? 'th' : 'td';

    const celdas = Array.from(renglon.cells).map(celda => {
      const estilo = getComputedStyle(celda);

      const fondo = this.esTransparente(estilo.backgroundColor)
        ? ''
        : `background:${estilo.backgroundColor};`;

      return (
        `<${etiqueta} style="${fondo}color:${estilo.color};border:1px solid #d0d0d0;` +
        `padding:3px 8px;text-align:left;white-space:nowrap">` +
        `${this.escaparHtml(this.limpiar(celda.innerText))}</${etiqueta}>`
      );
    });

    return `<tr>${celdas.join('')}</tr>`;
  }

  /** Un fondo transparente no se escribe: en Excel saldría como blanco sólido. */
  private esTransparente(color: string): boolean {
    return !color || color === 'transparent' || /rgba\([^)]*,\s*0\s*\)$/.test(color);
  }

  /**
   * Deja en el portapapeles el texto y el HTML a la vez. Excel y Word toman
   * el HTML, con lo que conservan colores y columnas; el Bloc de notas y
   * WhatsApp toman el texto.
   */
  private async escribirPortapapeles(texto: string, html: string): Promise<void> {
    // ClipboardItem no existe en navegadores viejos; ahí se copia sólo el
    // texto, que es el comportamiento que había antes.
    if (typeof ClipboardItem === 'function' && navigator.clipboard?.write) {
      await navigator.clipboard.write([
        new ClipboardItem({
          'text/plain': new Blob([texto], { type: 'text/plain' }),
          'text/html': new Blob([html], { type: 'text/html' }),
        }),
      ]);
      return;
    }

    await navigator.clipboard.writeText(texto);
  }

  /** La tabla como HTML, para que Excel la pegue con formato. */
  private construirHtml(filas: any[]): string {
    const marca = this.coloresDeMarca();

    const borde = `1px solid ${marca.borde}`;

    const encabezado = this.columnas
      .map(
        columna =>
          `<th style="background:${marca.fondoEncabezado};color:${marca.textoEncabezado};` +
          `border:${borde};padding:4px 8px;text-align:left;white-space:nowrap">` +
          `${this.escaparHtml(columna.header)}</th>`
      )
      .join('');

    const cuerpo = filas
      .map(fila => {
        const celdas = this.columnas
          .map(columna => {
            const fondo = this.fondoDeCelda(fila, columna.field);
            const pintado = fondo
              ? `background:${fondo};color:${colorDeTextoPara(fondo)};`
              : '';

            return `<td style="${pintado}border:${borde};padding:3px 8px">` +
              `${this.escaparHtml(this.limpiar(fila?.[columna.field]))}</td>`;
          })
          .join('');

        return `<tr>${celdas}</tr>`;
      })
      .join('');

    return (
      `<table style="border-collapse:collapse;font-family:Segoe UI,Arial,sans-serif;font-size:10pt">` +
      `<thead><tr>${encabezado}</tr></thead><tbody>${cuerpo}</tbody></table>`
    );
  }

  /** El color de fondo del renglón para esa columna, si lleva uno. */
  private fondoDeCelda(fila: any, field: string): string | null {
    if (!this.columnaColoreada || this.columnaColoreada.field !== field) {
      return null;
    }

    const color = fila?.[this.columnaColoreada.propiedadColor];
    return typeof color === 'string' && color.trim() ? color.trim() : null;
  }

  /**
   * Los colores de la marca activa, tomados de las variables que genera
   * PrimeNG, así el pegado se ve como la pantalla sin tener que repetir los
   * hex de cada empresa aquí.
   */
  private coloresDeMarca(): { fondoEncabezado: string; textoEncabezado: string; borde: string } {
    const raiz = getComputedStyle(document.documentElement);

    const leer = (nombre: string, respaldo: string) =>
      this.aRgb(raiz.getPropertyValue(nombre).trim(), respaldo);

    return {
      fondoEncabezado: leer('--p-primary-50', '#fdecec'),
      textoEncabezado: leer('--p-primary-800', '#8f1915'),
      borde: leer('--p-primary-200', '#e8c4c4'),
    };
  }

  /**
   * Normaliza cualquier color de CSS a `rgb(...)`. Las variables de PrimeNG
   * pueden venir en formatos que Excel no entiende, y el navegador es quien
   * sabe convertirlos.
   */
  private aRgb(valor: string, respaldo: string): string {
    if (!valor) {
      return respaldo;
    }

    const sonda = document.createElement('span');
    sonda.style.display = 'none';
    sonda.style.color = valor;
    document.body.appendChild(sonda);
    const resuelto = getComputedStyle(sonda).color;
    sonda.remove();

    return resuelto || respaldo;
  }

  private escaparHtml(valor: string): string {
    return valor
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;');
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

  /**
   * Folio del viaje que se acaba de guardar. Mientras tenga valor, su
   * renglón se pinta distinto en la tabla.
   */
  folioResaltado: number | null = null;

  private temporizadorResaltado: any;

  /** Cuánto dura el resaltado antes de apagarse solo. */
  private static readonly DuracionDelResaltado = 6000;

  @ViewChild('dt') private tabla?: Table;

  private host = inject(ElementRef);

  /** Índice del primer renglón visible; enlazado a [(first)] del p-table. */
  primerRegistro = 0;

  /**
   * Folio guardado que todavía falta ubicar en la tabla. Se llena al guardar
   * y se consume cuando llega la recarga; separado de folioResaltado porque
   * ése controla el color y dura más.
   */
  private folioPorUbicar: number | null = null;

  /**
   * Lleva la tabla a la página donde quedó el viaje guardado y lo trae a la
   * vista. Sin esto el resaltado funciona, pero si el renglón cae en otra
   * página el usuario no lo ve.
   */
  private irAlFolioGuardado(): void {
    const folio = this.folioPorUbicar;
    this.folioPorUbicar = null;

    if (folio == null || !this.tabla) {
      return;
    }

    // Lo que la tabla muestra de verdad: con texto en el buscador es
    // filteredValue; si no, value. Ambos ya vienen con el orden aplicado.
    const filas: any[] = this.tabla.filteredValue ?? this.tabla.value ?? [];
    const indice = filas.findIndex(fila => fila?.[this.dataKey] === folio);

    if (indice === -1) {
      // Pasa cuando el viaje queda fuera del rango de fechas cargado o no
      // coincide con lo escrito en el buscador.
      this.avisar('info', 'Viaje guardado', `El folio ${folio} no aparece con los filtros actuales.`);
      return;
    }

    const filasPorPagina = this.tabla.rows ?? 10;
    this.primerRegistro = Math.floor(indice / filasPorPagina) * filasPorPagina;
    this.cdr.detectChanges();

    // Ya está en la página visible; falta traerlo al centro del scroll de la
    // tabla, que con 25 o 50 filas por página lo deja fuera de vista.
    setTimeout(() => {
      this.host.nativeElement
        .querySelector('tr.fila-recien-guardada')
        ?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  viajeGuardadoConExito(folio?: number) {
    this.cerrarModal();

    // La tabla trae 49 columnas y paginación: sin marcar el renglón, el
    // usuario no tiene forma de ubicar el viaje que acaba de guardar.
    this.resaltarFolio(folio);

    this.recargarTabla.emit(); // Disparamos el aviso hacia el componente Padre (Principal)
  }

  private resaltarFolio(folio?: number) {
    if (folio == null) {
      return;
    }

    // Si se guardan dos viajes seguidos, el temporizador anterior apagaría
    // el resaltado del nuevo antes de tiempo.
    clearTimeout(this.temporizadorResaltado);

    this.folioResaltado = folio;
    this.folioPorUbicar = folio;

    this.temporizadorResaltado = setTimeout(() => {
      this.folioResaltado = null;
      this.cdr.detectChanges();
    }, TablaDashboardComponent.DuracionDelResaltado);
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
    CodigoConfiguracion: 'Tipo',
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









