import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { DatePickerModule } from 'primeng/datepicker';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { TooltipModule } from 'primeng/tooltip';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { MessageService } from 'primeng/api';

/** Los tres estados por los que pasa un convenio. */
export type EstatusConvenio = 'PENDIENTE' | 'VALIDADO' | 'RECHAZADO';

/**
 * Un viaje visto desde comercial: sólo lo necesario para validar su
 * convenio. Es un subconjunto de la vista de programación, más la empresa,
 * que aquí sí importa porque se ven las cuatro juntas.
 */
export interface ViajeConvenio {
  folio: number;
  idEmpresa: number;
  empresa: string;
  numeroConvenio: string | null;
  fecha: string;
  cliente: string;
  ejecutivo: string;
  tipo: string;
  mercancia: string;
  origen: string;
  estatusConvenio: EstatusConvenio;

  // Lo que sólo se ve al abrir el registro.
  numeroViaje: string | null;
  destino: string;
  ciudad: string;
  operacion: string;
  fechaVencimiento: string | null;
  comentarios: string | null;
  horasEstadias: number | null;
  nombreArchivo: string | null;
}

@Component({
  selector: 'app-control-viajes',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    SelectModule,
    DatePickerModule,
    TableModule,
    InputTextModule,
    IconFieldModule,
    InputIconModule,
    TooltipModule,
    ToastModule,
    DialogModule,
    InputNumberModule
  ],
  providers: [MessageService],
  templateUrl: './control-viajes.html',
  styleUrl: './control-viajes.css',
})
export class ControlViajes implements OnInit {

  constructor(private messageService: MessageService) {}

  // ─── Catálogos de los filtros ────────────────────────────────────
  //
  // Por ahora en duro: esto es sólo el diseño. Al conectarlo, empresas
  // sale del catálogo y el resto de sus servicios, como en card-filtros.

  /** `null` en idEmpresa significa "todas": es la opción por defecto. */
  public empresas = [
    { idEmpresa: null, nombreEmpresa: 'Todas las empresas' },
    { idEmpresa: 1, nombreEmpresa: 'Karve' },
    { idEmpresa: 2, nombreEmpresa: 'Vikingo' },
    { idEmpresa: 3, nombreEmpresa: 'Drakkar' },
    { idEmpresa: 4, nombreEmpresa: 'Letca' },
  ];

  public estatusDeConvenio = [
    { valor: 'PENDIENTE', nombre: 'Por validar' },
    { valor: 'VALIDADO', nombre: 'Validado' },
    { valor: 'RECHAZADO', nombre: 'Rechazado' },
  ];

  public origenes: { idOrigen: number; origen1: string }[] = [];
  public clientes: { idCliente: number; nombreCliente: string }[] = [];
  public ejecutivos: { idEjecutivo: number; nombreEjecutivo: string }[] = [];

  // ─── Filtros seleccionados ───────────────────────────────────────

  public filtroIdEmpresa: number | null = null;

  /** Arranca en "Por validar": es el trabajo de comercial, no la excepción. */
  public filtroEstatus: EstatusConvenio | null = 'PENDIENTE';

  public filtroIdOrigen: number | null = null;
  public filtroIdCliente: number | null = null;
  public filtroIdEjecutivo: number | null = null;
  public filtroRangoFechas: Date[] | undefined;

  // ─── Tabla ───────────────────────────────────────────────────────

  public viajes: ViajeConvenio[] = [];
  public seleccionados: ViajeConvenio[] = [];
  public cargando = false;

  public camposDeBusqueda = [
    'folio', 'numeroConvenio', 'cliente', 'ejecutivo', 'empresa',
    'origen', 'destino', 'ciudad'
  ];

  // ─── Contadores ──────────────────────────────────────────────────

  public totalPendientes = 0;
  public totalValidadosHoy = 0;
  public totalRechazados = 0;

  ngOnInit(): void {
    this.cargarViajes();
  }

  public cargarViajes(): void {
    // Datos de ejemplo mientras no existe el endpoint transversal.
    this.viajes = this.datosDeEjemplo();
    this.recalcularContadores();
  }

  public aplicarFiltros(): void {
    this.cargarViajes();
  }

  public limpiarFiltros(): void {
    this.filtroIdEmpresa = null;
    this.filtroEstatus = 'PENDIENTE';
    this.filtroIdOrigen = null;
    this.filtroIdCliente = null;
    this.filtroIdEjecutivo = null;
    this.filtroRangoFechas = undefined;

    this.cargarViajes();
  }

  private recalcularContadores(): void {
    this.totalPendientes = this.viajes.filter(v => v.estatusConvenio === 'PENDIENTE').length;
    this.totalValidadosHoy = this.viajes.filter(v => v.estatusConvenio === 'VALIDADO').length;
    this.totalRechazados = this.viajes.filter(v => v.estatusConvenio === 'RECHAZADO').length;
  }

  // ─── Acciones ────────────────────────────────────────────────────

  public validarSeleccionados(): void {
    this.cambiarEstatusDeSeleccionados('VALIDADO', 'validaron');
  }

  public rechazarSeleccionados(): void {
    this.cambiarEstatusDeSeleccionados('RECHAZADO', 'rechazaron');
  }

  private cambiarEstatusDeSeleccionados(estatus: EstatusConvenio, verbo: string): void {
    if (this.seleccionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona al menos un viaje.'
      });
      return;
    }

    // Sólo cambia la pantalla: falta el endpoint que lo persista.
    this.seleccionados.forEach(viaje => (viaje.estatusConvenio = estatus));

    this.messageService.add({
      severity: 'success',
      summary: 'Listo',
      detail: `Se ${verbo} ${this.seleccionados.length} convenios.`
    });

    this.seleccionados = [];
    this.recalcularContadores();
  }

  // ─── Modal de validación ─────────────────────────────────────────

  public mostrarModal = false;

  /** El renglón que se abrió; null mientras el modal está cerrado. */
  public viajeAbierto: ViajeConvenio | null = null;

  // Campos editables del modal. Se copian del renglón al abrir y se
  // vuelcan de regreso al guardar: así cancelar no deja cambios a medias.
  public formNumeroConvenio: string | null = null;
  public formFechaVencimiento: Date | undefined;
  public formComentarios = '';
  public formHorasEstadias: number | null = null;
  public formEstatus: EstatusConvenio = 'PENDIENTE';

  /** Convenios disponibles para el cliente del viaje abierto. */
  public conveniosDisponibles: { noConvenio: string }[] = [];

  public abrirModal(viaje: ViajeConvenio): void {
    this.viajeAbierto = viaje;

    this.formNumeroConvenio = viaje.numeroConvenio;
    this.formFechaVencimiento = viaje.fechaVencimiento
      ? new Date(viaje.fechaVencimiento)
      : undefined;
    this.formComentarios = viaje.comentarios ?? '';
    this.formHorasEstadias = viaje.horasEstadias;
    this.formEstatus = viaje.estatusConvenio;

    // Mientras no exista el endpoint, se arma la lista con lo que trae
    // el propio viaje para que el selector no salga vacío.
    this.conveniosDisponibles = viaje.numeroConvenio
      ? [{ noConvenio: viaje.numeroConvenio }]
      : [];

    this.mostrarModal = true;
  }

  public cerrarModal(): void {
    this.mostrarModal = false;
    this.viajeAbierto = null;
  }

  /** Marca el convenio sin cerrar: todavía hay que dar Guardar. */
  public marcarEstatus(estatus: EstatusConvenio): void {
    this.formEstatus = estatus;
  }

  public guardarDesdeModal(): void {
    if (this.viajeAbierto == null) {
      return;
    }

    // Rechazar sin explicar por qué deja al ejecutivo sin saber qué
    // corregir, así que el comentario se vuelve obligatorio en ese caso.
    if (this.formEstatus === 'RECHAZADO' && this.formComentarios.trim().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Escribe el motivo del rechazo en Comentarios.'
      });
      return;
    }

    this.viajeAbierto.numeroConvenio = this.formNumeroConvenio;
    this.viajeAbierto.comentarios = this.formComentarios.trim() || null;
    this.viajeAbierto.horasEstadias = this.formHorasEstadias;
    this.viajeAbierto.estatusConvenio = this.formEstatus;
    this.viajeAbierto.fechaVencimiento = this.formFechaVencimiento
      ? this.aTextoDeFecha(this.formFechaVencimiento)
      : null;

    this.messageService.add({
      severity: 'success',
      summary: 'Guardado',
      detail: `Se actualizó el convenio del folio ${this.viajeAbierto.folio}.`
    });

    this.recalcularContadores();
    this.cerrarModal();
  }

  public verDocumento(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Pendiente',
      detail: 'Falta conectar la descarga del documento.'
    });
  }

  public agregarConvenio(): void {
    this.messageService.add({
      severity: 'info',
      summary: 'Pendiente',
      detail: 'Falta el alta de convenios desde aquí.'
    });
  }

  /** Fecha local a texto, sin pasar por UTC para que no se corra un día. */
  private aTextoDeFecha(fecha: Date): string {
    const dosDigitos = (n: number) => String(n).padStart(2, '0');
    return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
  }

  // ─── Apoyos para la plantilla ────────────────────────────────────

  /** Clase del chip de empresa; el número es el IdEmpresa. */
  public claseDeEmpresa(idEmpresa: number): string {
    return `chip-empresa chip-empresa--${idEmpresa}`;
  }

  public claseDeEstatus(estatus: EstatusConvenio): string {
    return `chip-estatus chip-estatus--${estatus.toLowerCase()}`;
  }

  public textoDeEstatus(estatus: EstatusConvenio): string {
    if (estatus === 'VALIDADO') return 'Validado';
    if (estatus === 'RECHAZADO') return 'Rechazado';
    return 'Por validar';
  }

  private datosDeEjemplo(): ViajeConvenio[] {
    const base = {
      numeroViaje: null,
      fechaVencimiento: '2026-10-30',
      comentarios: null,
      horasEstadias: null,
      nombreArchivo: null
    };

    return [
      { ...base, folio: 29983, idEmpresa: 1, empresa: 'Karve', numeroConvenio: '100027-2', fecha: '2026-10-18', cliente: 'LESCHACO MEXICANA S.A. DE C.V.', ejecutivo: 'NESTOR SANCHEZ', tipo: '1X20 TK', mercancia: 'GENERAL', origen: 'MANZANILLO', destino: 'VERACRUZ', ciudad: 'XALAPA', operacion: 'IMPORTACION', estatusConvenio: 'PENDIENTE' },
      { ...base, folio: 30030, idEmpresa: 2, empresa: 'Vikingo', numeroConvenio: '1000726', fecha: '2026-10-18', cliente: 'KUEHNE + NAGEL, S.A. DE C.V.', ejecutivo: 'NESTOR SANCHEZ', tipo: '1X40 HC', mercancia: 'GENERAL', origen: 'MANZANILLO', destino: 'JALISCO', ciudad: 'GUADALAJARA', operacion: 'IMPORTACION', estatusConvenio: 'PENDIENTE' },
      { ...base, folio: 30181, idEmpresa: 3, empresa: 'Drakkar', numeroConvenio: '300B28-5 - KN BAYER ORIZABA EXPO', fecha: '2026-10-18', cliente: 'KN - BAYER', ejecutivo: 'STEFANY LOPEZ', tipo: '1X40 RF', mercancia: 'REFRIGERADA', origen: 'VERACRUZ', destino: 'VERACRUZ', ciudad: 'IXTACZOQUITLAN', operacion: 'EXPORTACION', estatusConvenio: 'PENDIENTE', nombreArchivo: null },
      { ...base, folio: 30304, idEmpresa: 4, empresa: 'Letca', numeroConvenio: '28911- GEODIS COATEPER', fecha: '2026-10-18', cliente: 'GEODIS MEXICO S.A. DE C.V.', ejecutivo: 'SAID FUENTES', tipo: '1X40 HC', mercancia: 'GENERAL', origen: 'VERACRUZ', destino: 'VERACRUZ', ciudad: 'COATEPEC', operacion: 'IMPORTACION', estatusConvenio: 'VALIDADO', nombreArchivo: 'convenio-28911.pdf' },
      { ...base, folio: 30369, idEmpresa: 1, empresa: 'Karve', numeroConvenio: null, fecha: '2026-10-18', cliente: 'DHL - DURACELL', ejecutivo: 'NESTOR SANCHEZ', tipo: '1X40 HC', mercancia: 'PELIGROSA', origen: 'MANZANILLO', destino: 'MORELOS', ciudad: 'CUERNAVACA', operacion: 'IMPORTACION', estatusConvenio: 'RECHAZADO', comentarios: 'Falta adjuntar el convenio firmado.', fechaVencimiento: null },
      { ...base, folio: 30392, idEmpresa: 2, empresa: 'Vikingo', numeroConvenio: 'UPS GRUNENTHAL 21777777', fecha: '2026-10-18', cliente: 'TELD GRUNENTHAL-UPS', ejecutivo: 'HUGO SANTOS', tipo: '1X40 RF', mercancia: 'REFRIGERADA', origen: 'VERACRUZ', destino: 'PUEBLA', ciudad: 'PUEBLA', operacion: 'EXPORTACION', estatusConvenio: 'PENDIENTE' },
      { ...base, folio: 30393, idEmpresa: 3, empresa: 'Drakkar', numeroConvenio: 'UPS GRUNENTHAL 21777777', fecha: '2026-10-17', cliente: 'TELD GRUNENTHAL-UPS', ejecutivo: 'HUGO SANTOS', tipo: '1X40 RF', mercancia: 'REFRIGERADA', origen: 'VERACRUZ', destino: 'PUEBLA', ciudad: 'PUEBLA', operacion: 'EXPORTACION', estatusConvenio: 'VALIDADO' },
      { ...base, folio: 30396, idEmpresa: 4, empresa: 'Letca', numeroConvenio: '000011', fecha: '2026-10-17', cliente: 'GEODIS MEXICO S.A. DE C.V.', ejecutivo: 'NESTOR SANCHEZ', tipo: '1X40 RF', mercancia: 'REFRIGERADA', origen: 'MANZANILLO', destino: 'VERACRUZ', ciudad: 'VERACRUZ', operacion: 'IMPORTACION', estatusConvenio: 'PENDIENTE' },
    ];
  }

}
