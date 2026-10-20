import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
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
import { ComercialService } from '../../../core/services/ComercialService';
import { CatalogosViajeService } from '../../../core/services/CatalogosViajesService';
import { ProgramacionViajesService } from '../../../core/services/ProgramacionViajesService';
import { ProgramacionDeViajesVista } from '../../../core/models/ProgramacionDeViajesVista';
import { FiltroDeBusqueda, Origen } from '../../../core/models/CatalogosFiltrosDtos';
import { Cliente, Ejecutivo } from '../../../core/models/CatalogosViajeDtos';
import Convenio from '../../../core/models/Convenio';

/** Los ids de las cuatro empresas, para pedir sus catálogos. */
const IDS_DE_EMPRESAS = [1, 2, 3, 4];

/**
 * La vista sólo devuelve `idEmpresa`, no el nombre. Como las cuatro son
 * fijas, se resuelve aquí en vez de pedirle el join al backend.
 */
const NOMBRES_DE_EMPRESA: { [idEmpresa: number]: string } = {
  1: 'Karve',
  2: 'Vikingo',
  3: 'Drakkar',
  4: 'Letca',
};

/**
 * En la base, EstatusConvenio es 1 aceptado, 0 rechazado y null sin
 * revisar. Aquí se maneja con texto porque un 0 y un null en el template
 * se confunden solos.
 */
function aEstatusDeTexto(valor: number | null | undefined): EstatusConvenio {
  if (valor === 1) return 'VALIDADO';
  if (valor === 0) return 'RECHAZADO';
  return 'PENDIENTE';
}

function aNumeroDeEstatus(estatus: EstatusConvenio): number | null {
  if (estatus === 'VALIDADO') return 1;
  if (estatus === 'RECHAZADO') return 0;
  return null;
}

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
  mercancia: string;
  origen: string;
  estatusConvenio: EstatusConvenio;

  // Lo que sólo se ve al abrir el registro.
  numeroViaje: string | null;
  destino: string;
  ciudad: string;
  operacion: string;
  comentariosConvenio: string | null;
  nombreArchivo: string | null;

  /** La llave; `numeroConvenio` es sólo el texto que se muestra. */
  idConvenio: number | null;
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

  constructor(
    private messageService: MessageService,
    private comercialService: ComercialService,
    private catalogosService: CatalogosViajeService,
    private viajesService: ProgramacionViajesService
  ) {}

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

  public origenes: Origen[] = [];
  public clientes: Cliente[] = [];
  public ejecutivos: Ejecutivo[] = [];

  // ─── Filtros seleccionados ───────────────────────────────────────

  public filtroIdEmpresa: number | null = null;

  /** Arranca en "Por validar": es el trabajo de comercial, no la excepción. */
  public filtroEstatus: EstatusConvenio | null = 'PENDIENTE';

  public filtroIdOrigen: number | null = null;
  public filtroIdCliente: number | null = null;
  public filtroIdEjecutivo: number | null = null;
  public filtroRangoFechas: Date[] | undefined;

  // ─── Tabla ───────────────────────────────────────────────────────

  /** Todo lo que trajo el servidor con los filtros de arriba. */
  public viajes: ViajeConvenio[] = [];

  /**
   * Lo que se pinta: `viajes` menos el filtro de estatus.
   *
   * El estatus se filtra aquí y no en el servidor para que los contadores
   * sigan contando el periodo completo. Si el servidor devolviera sólo los
   * pendientes, "Validados" y "Rechazados" saldrían siempre en cero.
   */
  public viajesVisibles: ViajeConvenio[] = [];

  public seleccionados: ViajeConvenio[] = [];
  public cargando = false;

  public camposDeBusqueda = [
    'folio', 'numeroConvenio', 'cliente', 'ejecutivo', 'empresa',
    'origen', 'destino', 'ciudad'
  ];

  /** Quién está validando; viaja en cada guardado para la bitácora. */
  private idUsuario: number | null = this.leerIdUsuario();

  private leerIdUsuario(): number | null {
    const guardado = localStorage.getItem('usuario');
    return guardado ? JSON.parse(guardado).idUsuario ?? null : null;
  }

  // ─── Contadores ──────────────────────────────────────────────────

  public totalPendientes = 0;
  public totalValidados = 0;
  public totalRechazados = 0;

  ngOnInit(): void {
    this.cargarCatalogos();

    // Al entrar se arranca con el mes en curso, igual que programación de
    // viajes: sin rango, la consulta traería el histórico completo de las
    // cuatro empresas.
    this.filtroRangoFechas = this.mesEnCurso();

    this.cargarViajes();
  }

  /**
   * Los catálogos vienen por empresa, así que se piden los de las cuatro y
   * se juntan: aquí el usuario filtra sobre todo el grupo.
   */
  private cargarCatalogos(): void {
    forkJoin(
      IDS_DE_EMPRESAS.map(id => this.catalogosService.obtenerCatalagosPorEmpresa(id))
    ).subscribe({
      next: (respuestas) => {
        this.origenes = this.unirSinRepetir(
          respuestas.flatMap(r => r.origenesDestinos ?? []),
          origen => origen.idOrigen
        );

        this.clientes = this.unirSinRepetir(
          respuestas.flatMap(r => r.cliente ?? []),
          cliente => cliente.idCliente
        );

        this.ejecutivos = this.unirSinRepetir(
          respuestas.flatMap(r => r.ejecutivos ?? []),
          ejecutivo => ejecutivo.idEjecutivo
        );
      },
      error: (err) => console.error('Error al cargar los catálogos', err)
    });
  }

  /**
   * Quita los repetidos quedándose con el primero de cada llave. Hace falta
   * porque un mismo origen aparece en las cuatro empresas.
   */
  private unirSinRepetir<T>(elementos: T[], llave: (elemento: T) => any): T[] {
    const vistos = new Map<any, T>();

    elementos.forEach(elemento => {
      const id = llave(elemento);

      if (id != null && !vistos.has(id)) {
        vistos.set(id, elemento);
      }
    });

    return [...vistos.values()];
  }

  /** Del día 1 al último día del mes actual. */
  private mesEnCurso(): Date[] {
    const hoy = new Date();

    return [
      new Date(hoy.getFullYear(), hoy.getMonth(), 1),
      new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0)
    ];
  }

  public cargarViajes(): void {
    this.cargando = true;

    // Sin idEmpresa el backend devuelve las cuatro; sin estatus, todos.
    this.comercialService.obtenerViajes({
      idEmpresa: this.filtroIdEmpresa,
      fechaInicio: this.aTextoDeFecha(this.filtroRangoFechas?.[0]),

      // Si sólo se eligió un día en el calendario, el rango es ese día.
      fechaFin: this.aTextoDeFecha(
        this.filtroRangoFechas?.[1] ?? this.filtroRangoFechas?.[0]
      ),

      idOrigen: this.filtroIdOrigen,
      idCliente: this.filtroIdCliente,
      idEjecutivo: this.filtroIdEjecutivo
    }).subscribe({
      next: (datos) => {
        this.viajes = datos.map(viaje => this.aViajeConvenio(viaje));
        this.seleccionados = [];
        this.recalcularContadores();
        this.aplicarFiltroDeEstatus();
        this.cargando = false;
      },
      error: (err) => {
        this.cargando = false;
        console.error('Error al cargar los viajes', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error al cargar',
          detail: 'No se pudieron traer los viajes.'
        });
      }
    });
  }

  /**
   * Fecha local a texto. No se usa toISOString() porque convierte a UTC y
   * en México adelanta la fecha, con lo que el rango se corre un día.
   */
  private aTextoDeFecha(fecha: Date | undefined): string | null {
    if (!fecha) {
      return null;
    }

    const dosDigitos = (n: number) => String(n).padStart(2, '0');

    return `${fecha.getFullYear()}-${dosDigitos(fecha.getMonth() + 1)}-${dosDigitos(fecha.getDate())}`;
  }

  /** Aplana la fila de la vista a lo que necesita esta pantalla. */
  private aViajeConvenio(viaje: ProgramacionDeViajesVista): ViajeConvenio {
    const idEmpresa = viaje.idEmpresa ?? 0;

    return {
      folio: viaje.folio,
      idEmpresa,
      empresa: NOMBRES_DE_EMPRESA[idEmpresa] ?? 'Sin empresa',
      numeroConvenio: viaje.numeroConvenio ?? null,
      fecha: viaje.fecha ?? '',
      cliente: viaje.cliente ?? '',
      ejecutivo: viaje.ejecutivo ?? '',
      mercancia: viaje.mercanciaDescripcion ?? '',
      origen: viaje.nombreOrigen ?? '',
      destino: viaje.nombreDestino ?? '',
      ciudad: viaje.destinosEstadosCuidad ?? '',

      estatusConvenio: aEstatusDeTexto(viaje.estatusConvenio),
      idConvenio: viaje.idConvenio ?? null,

      numeroViaje: viaje.numeroViaje ?? null,
      operacion: viaje.operacion ?? '',

      // Los del convenio, no los del viaje: `comentarios` son las notas de
      // tráfico y aquí no tienen nada que hacer.
      comentariosConvenio: viaje.comentariosConvenio ?? null,
      nombreArchivo: viaje.nombreArchivo ?? null
    };
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

    // Vuelve al mes en curso, no a vacío: dejar el rango sin valor traería
    // el histórico completo de las cuatro empresas.
    this.filtroRangoFechas = this.mesEnCurso();

    this.cargarViajes();
  }

  private aplicarFiltroDeEstatus(): void {
    this.viajesVisibles = this.filtroEstatus == null
      ? [...this.viajes]
      : this.viajes.filter(viaje => viaje.estatusConvenio === this.filtroEstatus);
  }

  private recalcularContadores(): void {
    this.totalPendientes = this.viajes.filter(v => v.estatusConvenio === 'PENDIENTE').length;
    this.totalValidados = this.viajes.filter(v => v.estatusConvenio === 'VALIDADO').length;
    this.totalRechazados = this.viajes.filter(v => v.estatusConvenio === 'RECHAZADO').length;
  }

  // ─── Acciones ────────────────────────────────────────────────────

  /**
   * Valida en lote. Sólo aplica a aceptar: rechazar exige el motivo, que
   * no se puede capturar desde la barra de la tabla.
   */
  public validarSeleccionados(): void {
    if (this.seleccionados.length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona al menos un viaje.'
      });
      return;
    }

    const aValidar = [...this.seleccionados];

    // Una petición por viaje: el endpoint trabaja sobre un folio. Con
    // forkJoin todas salen juntas y se espera a que terminen.
    forkJoin(
      aValidar.map(viaje =>
        this.comercialService.validarConvenio(viaje.folio, {
          idConvenio: viaje.idConvenio,
          comentariosConvenio: viaje.comentariosConvenio,
          estatusConvenio: 1,
          idUsuario: this.idUsuario
        })
      )
    ).subscribe({
      next: () => {
        aValidar.forEach(viaje => (viaje.estatusConvenio = 'VALIDADO'));

        this.messageService.add({
          severity: 'success',
          summary: 'Listo',
          detail: `Se validaron ${aValidar.length} convenios.`
        });

        this.seleccionados = [];
        this.recalcularContadores();
        this.aplicarFiltroDeEstatus();
      },
      error: (err) => {
        console.error('Error al validar en lote', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error al validar',
          detail: 'No se pudieron validar todos los convenios. Recarga para ver cuáles sí.'
        });
      }
    });
  }

  public rechazarSeleccionados(): void {
    // Rechazar sin motivo no se permite, y el motivo se escribe por viaje.
    this.messageService.add({
      severity: 'info',
      summary: 'Abre el registro',
      detail: 'Rechazar requiere capturar el motivo, así que se hace uno por uno.'
    });
  }

  // ─── Modal de validación ─────────────────────────────────────────

  public mostrarModal = false;

  /** El renglón que se abrió; null mientras el modal está cerrado. */
  public viajeAbierto: ViajeConvenio | null = null;

  /**
   * Folio del último renglón abierto. A diferencia de viajeAbierto, éste
   * NO se limpia al cerrar: deja marcado en qué iba el usuario cuando
   * regresa a la tabla, que con 15 renglones por página se pierde fácil.
   */
  public folioUltimoAbierto: number | null = null;

  // Campos editables del modal. Se copian del renglón al abrir y se
  // vuelcan de regreso al guardar: así cancelar no deja cambios a medias.
  public formIdConvenio: number | null = null;
  public formComentarios = '';
  public formEstatus: EstatusConvenio = 'PENDIENTE';

  public guardando = false;

  /** Los convenios de la empresa del renglón abierto. */
  public conveniosDisponibles: Convenio[] = [];
  public cargandoConvenios = false;

  public abrirModal(viaje: ViajeConvenio): void {
    this.viajeAbierto = viaje;
    this.folioUltimoAbierto = viaje.folio;

    this.formIdConvenio = viaje.idConvenio;
    this.formComentarios = viaje.comentariosConvenio ?? '';
    this.formEstatus = viaje.estatusConvenio;

    // Cada renglón puede ser de una empresa distinta, así que la lista se
    // pide al abrir y no se puede precargar como en el modal de viajes.
    this.cargarConveniosDeLaEmpresa(viaje.idEmpresa);

    this.mostrarModal = true;
  }

  private cargarConveniosDeLaEmpresa(idEmpresa: number): void {
    this.conveniosDisponibles = [];

    if (!idEmpresa) {
      return;
    }

    this.cargandoConvenios = true;

    this.comercialService.obtenerConveniosDeEmpresa(idEmpresa).subscribe({
      next: (convenios) => {
        this.conveniosDisponibles = convenios;
        this.cargandoConvenios = false;
      },
      error: (err) => {
        this.cargandoConvenios = false;
        console.error('Error al cargar los convenios', err);
      }
    });
  }

  public cerrarModal(): void {
    this.mostrarModal = false;
    this.viajeAbierto = null;
    this.guardando = false;
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
    // El backend lo valida igual; esto es para avisar antes de la petición.
    if (this.formEstatus === 'RECHAZADO' && this.formComentarios.trim().length === 0) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Escribe el motivo del rechazo en Comentarios.'
      });
      return;
    }

    const viaje = this.viajeAbierto;
    const comentarios = this.formComentarios.trim() || null;
    const estatus = this.formEstatus;
    const idConvenio = this.formIdConvenio;

    this.guardando = true;

    this.comercialService.validarConvenio(viaje.folio, {
      idConvenio,
      comentariosConvenio: comentarios,
      estatusConvenio: aNumeroDeEstatus(estatus),
      idUsuario: this.idUsuario
    }).subscribe({
      next: () => {
        // Se actualiza el renglón en memoria en vez de recargar la tabla:
        // recargar perdería el filtro y la página en la que iba el usuario.
        viaje.idConvenio = idConvenio;
        viaje.numeroConvenio = this.nombreDelConvenio(idConvenio);
        viaje.comentariosConvenio = comentarios;
        viaje.estatusConvenio = estatus;

        this.messageService.add({
          severity: 'success',
          summary: 'Guardado',
          detail: `Se actualizó el convenio del folio ${viaje.folio}.`
        });

        this.recalcularContadores();
        this.aplicarFiltroDeEstatus();
        this.cerrarModal();
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error al guardar el convenio', err);

        const detalle = err?.status === 422
          ? err?.error?.mensaje ?? 'Los datos del convenio no son válidos.'
          : 'No se pudo guardar el convenio.';

        this.messageService.add({
          severity: 'error',
          summary: 'Error al guardar',
          detail: detalle
        });
      }
    });
  }

  private nombreDelConvenio(idConvenio: number | null): string | null {
    if (idConvenio == null) {
      return null;
    }

    return this.conveniosDisponibles
      .find(convenio => convenio.idConvenio === idConvenio)?.noConvenio ?? null;
  }

  /**
   * Abre el documento del viaje en otra pestaña. Reusa el mismo endpoint
   * que el modal de programación de viajes.
   */
  public verDocumento(): void {
    if (this.viajeAbierto == null) {
      return;
    }

    if (!this.viajeAbierto.nombreArchivo) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin documento',
        detail: 'Este viaje no tiene ningún documento cargado.'
      });
      return;
    }

    this.viajesService.descargarDocumento(this.viajeAbierto.folio).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Se libera la URL temporal una vez que el navegador ya la abrió.
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => {
        console.error('Error al obtener el documento', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo abrir el documento.'
        });
      }
    });
  }

  // ─── Alta de convenio ────────────────────────────────────────────

  public mostrarModalNuevoConvenio = false;
  public nuevoConvenioTexto = '';
  public creandoConvenio = false;

  public abrirModalNuevoConvenio(): void {
    this.nuevoConvenioTexto = '';
    this.mostrarModalNuevoConvenio = true;
  }

  public cerrarModalNuevoConvenio(): void {
    this.mostrarModalNuevoConvenio = false;
    this.nuevoConvenioTexto = '';
    this.creandoConvenio = false;
  }

  /**
   * Mismo flujo que el modal de viajes: se crea, se agrega a la lista y
   * queda seleccionado. La empresa sale del renglón abierto, porque aquí
   * no hay una fija como allá.
   */
  public agregarConvenio(): void {
    const texto = this.nuevoConvenioTexto.trim();

    if (!texto || this.viajeAbierto == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Ingresa el número de convenio.'
      });
      return;
    }

    this.creandoConvenio = true;

    this.comercialService.crearConvenio({
      noConvenio: texto,
      idEmpresa: this.viajeAbierto.idEmpresa
    }).subscribe({
      next: (convenioCreado) => {
        this.conveniosDisponibles = [...this.conveniosDisponibles, convenioCreado];
        this.formIdConvenio = convenioCreado.idConvenio ?? null;

        this.messageService.add({
          severity: 'success',
          summary: 'Convenio creado',
          detail: `${convenioCreado.noConvenio} quedó seleccionado.`
        });

        this.cerrarModalNuevoConvenio();
      },
      error: (err) => {
        this.creandoConvenio = false;
        console.error('Error al crear el convenio', err);

        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el convenio.'
        });
      }
    });
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


}
