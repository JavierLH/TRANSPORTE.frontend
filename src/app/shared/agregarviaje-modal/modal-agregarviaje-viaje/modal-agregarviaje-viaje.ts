import { Component, Output, EventEmitter, Input, OnInit, inject, ViewChild, ElementRef } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { RadioButtonModule } from 'primeng/radiobutton';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { CrearNuevViajeDto } from '../../../core/models/CrearNuevoViajeDto';
import { ProgramacionViajesService } from '../../../core/services/ProgramacionViajesService';
import { ProgramacionViajes } from '../../../core/models/ProgramacionViajesDto';
import { DatePickerModule } from 'primeng/datepicker';
import { SelectChangeEvent, SelectModule } from 'primeng/select';
import { CatalogosViajeService } from '../../../core/services/CatalogosViajesService';
import { Cliente, DestinoEstadoCiudades, DestinoEstados, Ejecutivo, Equipo, Operacion, Operador, Origenes, Patios, TipoMercancia } from '../../../core/models/CatalogosViajeDtos';
import { MessageService } from 'primeng/api';
import { DialogModule } from 'primeng/dialog';
import { ConvenioServices } from '../../../core/services/ConvenioService';
import Convenio from '../../../core/models/Convenio';
import { PanelModule } from 'primeng/panel';


// Solo documentos: nada de imágenes ni videos
const EXTENSIONES_PERMITIDAS = ['pdf', 'doc', 'docx', 'xls', 'xlsx'];
const TAMANO_MAXIMO_MB = 10;

const ID_TIPO_EQUIPO_TRACTOCAMION = 3;
const ID_TIPO_EQUIPO_RABON = 7;


@Component({
  selector: 'app-modal-agregarviaje-viaje',
  standalone: true,
  imports: [PanelModule, InputTextModule, RadioButtonModule, ButtonModule, InputNumberModule, FormsModule, DatePickerModule, SelectModule, DialogModule],
  templateUrl: './modal-agregarviaje-viaje.html',
  styleUrl: './modal-agregarviaje-viaje.css',
})
export class ModalAgregarviajeViaje implements OnInit {

  @Input() datosViajeCreacion: CrearNuevViajeDto | undefined;
  @Output() onClose = new EventEmitter<void>();

  /**
   * Lleva el folio del viaje guardado para que la tabla pueda resaltarlo al
   * recargar: con 49 columnas y paginación, sin eso el usuario no sabe cuál
   * de todos los renglones acaba de crear.
   */
  @Output() onGuardado = new EventEmitter<number | undefined>();
  @Input() viajeAEditar: ProgramacionViajes | undefined;

  @Input() filaSeleccionada: any;

  private viajesService = inject(ProgramacionViajesService);
  private catalogosService = inject(CatalogosViajeService);
  private messageService = inject(MessageService);
  private ConvenioServices = inject(ConvenioServices);

  /** Bloquea el botón mientras la petición está en vuelo, para no guardar dos veces. */
  public guardando = false;

  NoEsVisibleLaTemperatura : boolean = true;

  noViaje: string = '';
  datetime24h: Date | undefined;
  fecha: Date[] | undefined;

  idCliente: number | undefined;
  idEjecutivo: number | undefined;
  comentariosConvenio: string = '';
  turno: string = '';

  idOperador: number | undefined;
  idEquipoRuta: number | undefined;
  idOperadorRetira: number | undefined;
  idEquipoRetira: number | undefined;

  idTipo: number | undefined; // <-- Creado para "Tipo" (antes chocaba con Operacion)
  idTipoOperacion: number | undefined; // <-- Usado para "Operación"
  idTipoMercancia: number | undefined;

  idDestino : number | undefined;

  citaTerminal: string = '';
  comentarios: string = '';
  idOrigen: number | undefined;
  idPatio: number | undefined;   // antes: idPatio: string = ''; // Destino

  idCiudad: number | undefined;
  insumosAdicionales: string = '';
  reexpedicion: string = '';
  comision: number = 0;
  gasto: number = 0;
  estatus: number | undefined;
  asignacion: string = '';

  idPatio2: number | undefined;

  horaCita: string = '';
  horaCitaDate: Date | undefined; // <-- Nueva variable para el p-datepicker de Horario Cita

  // Radio Buttons
  EnvioAsig: string = '';
  EnvioDoc: string = '';
  EnvioCitas: string = '';
  EnvioSeguimiento: string = '';
  EnvioCcp: string = '';

  // Sección Ingreso
  idEquipoIngreso: number | undefined;
  idOperadorIngreso: number | undefined;
  sIngreso: Date | undefined;   // se guarda en la columna sIngreso (datetime) de ProgramacionViajes
  entrega: Date | undefined;
  envio: string = '';

  // ================= DATOS REALES (desde CatalogosViajeService) =================
  clientes: Cliente[] = [];
  ejecutivos: Ejecutivo[] = [];
  operadores: Operador[] = [];
  equipos: Equipo[] = [];              // todos los equipos, usado en Económico Ingresa
  equiposTractocamion: Equipo[] = [];  // solo idTipoEquipo === 3, usado en Ruta y Retira
  mercancias: TipoMercancia[] = [];
  operaciones: Operacion[] = [];

  tipos = [
    { id: 1, nombre: 'SENCILLO' }, { id: 2, nombre: 'FULL' }
  ];

  origenes: Origenes[] = [];
  destinos: DestinoEstados[] = [];

  patios: Patios[] = [];

  todasLasCiudades: DestinoEstadoCiudades[] = [];  // <-- nuevo: el catálogo completo, sin filtrar
  ciudades: DestinoEstadoCiudades[] = [];          // <-- ahora arranca vacío; se llena al elegir un Destino

  estatusList = [
    { id: 1, nombre: 'PROGRAMADO' }, { id: 2, nombre: 'EN VIAJE' }, { id: 3, nombre: 'FINALIZADO' }
  ];

  idProgramacion: number | undefined;

  label: string | undefined = 'Guardar';

  convenios: Convenio[] = [];
  idConvenio: number | undefined;
  fechaVencimientoConvenio: Date | undefined;
  comentariosComercial: string = '';
  nombreArchivoCargado: string = '';

  mostrarModalNuevoConvenio = false;
  nuevoConvenioTexto: string = '';

  conexiones : string = '';


  nuevoConvenio() {
    this.mostrarModalNuevoConvenio = true;
  }

  cerrarModalNuevoConvenio() {
    this.mostrarModalNuevoConvenio = false;
    this.nuevoConvenioTexto = '';
  }

  agregarConvenio() {
    if (!this.nuevoConvenioTexto || !this.datosViajeCreacion?.idEmpresa) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Ingresa el número de convenio.'
      });
      return;
    }

    const nuevoConvenio: Convenio = {
      noConvenio: this.nuevoConvenioTexto,
      idEmpresa: this.datosViajeCreacion.idEmpresa
    };

    this.ConvenioServices.crearNuevoConvenio(nuevoConvenio).subscribe({
      next: (convenioCreado) => {
        // Se reemplaza el arreglo en vez de hacer push: p-select detecta cambios
        // por referencia, y mutar el arreglo existente no refresca las opciones.
        this.convenios = [...this.convenios, convenioCreado];

        this.idConvenio = convenioCreado.idConvenio;
        this.cerrarModalNuevoConvenio();

        this.messageService.add({
          severity: 'success',
          summary: 'Convenio creado',
          detail: `${convenioCreado.noConvenio} quedó seleccionado.`
        });
      },
      error: (err) => {
        console.error('Error al crear el convenio:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo crear el convenio.'
        });
      }
    });
  }

  @ViewChild('inputArchivo') inputArchivo!: ElementRef<HTMLInputElement>;

  archivoSeleccionado: File | undefined;

  cargarDocumento() {
    this.inputArchivo.nativeElement.click();
  }

  onArchivoSeleccionado(evento: Event) {
    const input = evento.target as HTMLInputElement;
    const archivo = input.files?.[0];

    if (!archivo) {
      return;
    }

    const extension = archivo.name.split('.').pop()?.toLowerCase() ?? '';

    if (!EXTENSIONES_PERMITIDAS.includes(extension)) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Formato no permitido',
        detail: `Solo se aceptan documentos: ${EXTENSIONES_PERMITIDAS.join(', ')}.`
      });
      input.value = '';
      return;
    }

    if (archivo.size > TAMANO_MAXIMO_MB * 1024 * 1024) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Archivo muy grande',
        detail: `El documento no debe superar los ${TAMANO_MAXIMO_MB} MB.`
      });
      input.value = '';
      return;
    }

    this.archivoSeleccionado = archivo;
    this.nombreArchivoCargado = archivo.name;

    // Permite volver a elegir el mismo archivo (el evento change no dispara si no cambia el valor)
    input.value = '';
  }

  verDocumento() {
    if (!this.idProgramacion) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Guarda el viaje antes de consultar su documento.'
      });
      return;
    }

    if (!this.nombreArchivoCargado) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Sin documento',
        detail: 'Este viaje no tiene ningún documento cargado.'
      });
      return;
    }

    this.viajesService.descargarDocumento(this.idProgramacion).subscribe({
      next: (blob) => {
        const url = URL.createObjectURL(blob);
        window.open(url, '_blank');

        // Se libera la URL temporal una vez que el navegador ya la abrió
        setTimeout(() => URL.revokeObjectURL(url), 60000);
      },
      error: (err) => {
        console.error('Error al obtener el documento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudo abrir el documento.'
        });
      }
    });
  }

  ngOnInit(): void {
    const idEmpresa = this.datosViajeCreacion?.idEmpresa;
    if (!idEmpresa) return;

    // Los convenios se cargan siempre, tanto al CREAR como al EDITAR, y de forma
    // independiente de los catálogos: son peticiones distintas y si una falla,
    // la otra no tiene por qué quedarse sin datos.
    this.ConvenioServices.obtenerTodosLosConvenios(idEmpresa).subscribe({
      next: (data) => {
        this.convenios = data;
      },
      error: (err) => console.error('Error cargando convenios de la empresa:', err)
    });

    this.catalogosService.obtenerCatalogosViaje(idEmpresa).subscribe({
      next: (data) => {
        this.equipos = data.equipos.flatMap(grupo => grupo.equipos);
        this.equiposTractocamion = data.equipos.find(
          grupo => (grupo.idTipoEquipo === ID_TIPO_EQUIPO_TRACTOCAMION
                 || grupo.idTipoEquipo === ID_TIPO_EQUIPO_RABON)
        )?.equipos ?? [];

        this.operadores = data.operadores;
        this.ejecutivos = data.ejecutivos;
        this.clientes = data.clientes;
        this.mercancias = data.tipoMercancia;
        this.operaciones = data.operaciones;
        this.origenes = data.origenes;
        this.destinos = data.destinoEstados;
        this.todasLasCiudades = data.destinoEstadoCiudades;
        this.patios = data.patios;

        if (this.datosViajeCreacion?.tipoDeOperacion === "EDITAR") {
          this.label = 'Actualizar';
          this.viajesService.obtenerViajePorId(this.filaSeleccionada.folio)
            .subscribe({
              next: (viaje) => {
                this.aplicarValoresCamposDeTexto(viaje);
              }
            });
        }
      },
      error: (err) => console.error('Error cargando catálogos del viaje:', err)
    });
  }


  public aplicarValoresCamposDeTexto(viaje: ProgramacionViajes) {
    this.idProgramacion = viaje.idProgramacion;
    this.noViaje = viaje.noViaje ?? '';
    this.datetime24h = viaje.fecha ? new Date(viaje.fecha) : undefined;
    this.turno = viaje.turno ?? '';

    this.idCliente = viaje.idCliente;
    this.idEjecutivo = viaje.idEjecutivo;
    this.comentariosConvenio = viaje.comentariosConvenio ?? '';

    this.idOperador = viaje.idOperador;
    this.idEquipoRuta = viaje.idEquipoRuta;
    this.idOperadorRetira = viaje.idOperadorRetira;
    this.idEquipoRetira = viaje.idEquipoRetira;

    this.idTipoOperacion = viaje.idTipoOperacion;
    this.idTipoMercancia = viaje.idTipoMercancia;

    // La temperatura se guarda en conexiones. Sin esta línea el campo se
    // mostraba vacío aunque la base trajera el valor, y al actualizar se
    // volvía a guardar en blanco.
    this.conexiones = viaje.conexiones ?? '';

    // Y sin esto, un viaje guardado como refrigerado abre con la temperatura
    // escondida: la visibilidad sólo se recalculaba al mover el selector.
    this.actualizarVisibilidadDeTemperatura(viaje.idTipoMercancia);

    // Igual que datetime24h: citaTerminal se muestra en un p-datepicker, así que necesita un Date
    this.citaTerminal = viaje.citaTerminal ? (new Date(viaje.citaTerminal) as any) : '';

    this.comentarios = viaje.comentarios ?? '';
    this.idOrigen = viaje.idOrigen;
    this.idDestino = viaje.idEstado;

    this.ciudades = this.todasLasCiudades.filter(c => c.idEstado === viaje.idEstado);

    this.idConvenio = viaje.idConvenio;
    this.comentariosComercial = (viaje.comentariosConvenio === undefined) ? '' : viaje.comentariosConvenio;

    this.idCiudad = viaje.idCiudad;
    this.insumosAdicionales = viaje.insumosAdicionales ?? '';
    this.reexpedicion = viaje.reexpedicion ?? '';
    this.comision = viaje.comision ?? 0;
    this.gasto = viaje.gasto ?? 0;
    this.estatus = viaje.estatus;
    this.asignacion = viaje.asignacion ?? '';

    this.idPatio = viaje.idPatio ? Number(viaje.idPatio) : undefined;
    this.idPatio2 = viaje.idPatio2 ? Number(viaje.idPatio2) : undefined;

    this.horaCita = viaje.horaCita ?? '';
    this.horaCitaDate = viaje.horaCita ? new Date(`1970-01-01T${viaje.horaCita.substring(0, 5)}:00`) : undefined;

    this.EnvioAsig = viaje.envioAsignacion ?? '';
    this.EnvioDoc = viaje.envioDocumentos ?? '';
    this.EnvioCitas = viaje.envioCita ?? '';
    this.EnvioSeguimiento = viaje.envioSeguimiento ?? '';
    this.EnvioCcp = viaje.envioCCP ?? '';

    this.idEquipoIngreso = viaje.idEquipoIngreso;
    this.idOperadorIngreso = viaje.idOperadorIngreso;
    this.nombreArchivoCargado = viaje.nombreArchivo ?? '';

    this.sIngreso = viaje.sIngreso ? new Date(viaje.sIngreso) : undefined;
    this.entrega = viaje.entrega ? new Date(viaje.entrega) : undefined;
    this.envio = viaje.envio ?? '';
  }

  insertarNuevoValor(){
    if (!this.datetime24h) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'La fecha es obligatoria para guardar el viaje.'
      });
      return;
    }

    const nuevoViaje = this.construirObjetoViaje();

    console.log('Objeto limpio enviado al API:', nuevoViaje);

    this.guardando = true;

    this.viajesService.insertarViaje(nuevoViaje).subscribe({
      next: (respuesta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Viaje creado',
          detail: `Se registró el viaje con folio ${respuesta.idProgramacion}.`
        });

        // El folio recién existe aquí, así que el documento se sube después de insertar
        this.subirDocumentoSiHay(respuesta.idProgramacion);
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error detallado del backend:', err.error?.errors);

        // Sin esto el usuario se quedaba viendo el modal abierto sin saber
        // que el guardado había fallado.
        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo crear el viaje',
          detail: err?.error?.mensaje ?? 'El servidor rechazó el registro.'
        });
      }
    });
  }

  /**
   * Sube el documento seleccionado (si lo hay) y cierra el modal.
   * Se llama después de guardar porque la ruta del archivo necesita el folio.
   */
  private subirDocumentoSiHay(idProgramacion: number | undefined) {
    if (!this.archivoSeleccionado || !idProgramacion) {
      this.guardando = false;
      this.onGuardado.emit(idProgramacion);
      this.cerrarModal();
      return;
    }

    this.viajesService.subirDocumento(idProgramacion, this.archivoSeleccionado).subscribe({
      next: (viaje) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Documento cargado',
          detail: viaje.nombreArchivo ?? this.nombreArchivoCargado
        });
        this.archivoSeleccionado = undefined;
        this.guardando = false;
        this.onGuardado.emit(idProgramacion);
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error al subir el documento:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'El viaje se guardó, pero el documento no',
          detail: err.error?.mensaje ?? 'No se pudo cargar el documento.'
        });
        this.guardando = false;
        this.onGuardado.emit(idProgramacion);
        this.cerrarModal();
      }
    });
  }

  actualizarValorExistente() {
    if (!this.datetime24h) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'La fecha es obligatoria para guardar el viaje.'
      });
      return;
  }

    if (!this.idProgramacion) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se encontró el ID del viaje a actualizar.'
      });
      return;
    }

    const viajeActualizado = this.construirObjetoViaje();

    this.guardando = true;

    this.viajesService.actualizarViaje(this.idProgramacion, viajeActualizado).subscribe({
      next: (respuesta) => {
        this.messageService.add({
          severity: 'success',
          summary: 'Viaje actualizado',
          detail: `Se guardaron los cambios del folio ${this.idProgramacion}.`
        });

        this.subirDocumentoSiHay(this.idProgramacion);
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error detallado del backend:', err.error?.errors);

        this.messageService.add({
          severity: 'error',
          summary: 'No se pudo actualizar el viaje',
          detail: err?.error?.mensaje ?? 'El servidor rechazó los cambios.'
        });
      }
    });
  }

  cambioEnCuidad(evento: SelectChangeEvent) {
    const idSeleccionado = evento.value;
    const ciudadSeleccionada = this.destinos.find(c => c.idEstado === idSeleccionado);

    if (ciudadSeleccionada) {
      console.log ('Ciudad seleccionada -> id:', ciudadSeleccionada.idEstado, '| nombre:', ciudadSeleccionada.destinoEstado1);

    }

  }

  cambioEnDestino(evento: SelectChangeEvent) {
    const idEstadoSeleccionado = evento.value; // gracias a optionValue="idEstado" en el select de Destino
    this.ciudades = this.todasLasCiudades.filter(c => c.idEstado === idEstadoSeleccionado);
    this.idCiudad = undefined; // la ciudad que tenía elegida antes ya no aplica al nuevo estado
  }

  guardarDatos() {
    if (this.datosViajeCreacion?.tipoDeOperacion === "EDITAR") {
      this.actualizarValorExistente();
    } else {
      this.insertarNuevoValor();
    }
  }

  cerrarModal() {
    this.onClose.emit();
  }



  mercanciaEsRefrigerada(event: SelectChangeEvent){

    this.actualizarVisibilidadDeTemperatura(event.value);

    // La temperatura sólo se limpia cuando el usuario cambia la mercancía a una
    // que no la lleva. Al precargar un viaje no se toca, porque ahí el valor
    // viene de la base y borrarlo sería perder el dato guardado.
    if (this.NoEsVisibleLaTemperatura) {
      this.conexiones = '';
    }

  }

  /**
   * Decide si el campo de temperatura se muestra, a partir del id de mercancía.
   *
   * Vive aparte del (onChange) porque también hace falta al precargar un viaje
   * en modo EDITAR: si sólo se evaluara al cambiar el selector, un viaje
   * guardado como refrigerado abriría con la temperatura escondida.
   */
  private actualizarVisibilidadDeTemperatura(idTipoMercancia: number | undefined | null): void {
    // find en vez de filter[0]: un viaje viejo puede traer la mercancía en null
    // o con un id que ya no está en el catálogo, y ahí filter[0] truena.
    const descripcion = this.mercancias
      .find(mercancia => mercancia.idTipoMercancia === idTipoMercancia)
      ?.descripcion;

    this.NoEsVisibleLaTemperatura = !(
      descripcion === "REFRIGERADA"
      || descripcion === "REFRIGERADA/PELIGROSA"
      || descripcion === "REFRIGERADA/GENERAL"
    );
  }

  private construirObjetoViaje(): ProgramacionViajes {
    const resolverNumero = (val: any): number | undefined => {
      if (val === null || val === undefined || val === '') return undefined;
      const num = Number(val);
      return isNaN(num) ? undefined : num;
    };

    const resolverTexto = (val: any): string | undefined => {
      return (val === null || val === undefined || val === '') ? undefined : String(val);
    };

    /**
     * Convierte la fecha a texto SIN tocar la zona horaria.
     *
     * Las columnas del backend son `datetime`, que no guarda zona: representan
     * hora local. Usar toISOString() la convertía a UTC y le sumaba 6 horas en
     * cada guardado, así que el valor se corría solo aunque nadie lo editara.
     */
    const aTextoLocal = (fecha: Date): string => {
      const dosDigitos = (n: number) => String(n).padStart(2, '0');

      const anio = fecha.getFullYear();
      const mes = dosDigitos(fecha.getMonth() + 1);
      const dia = dosDigitos(fecha.getDate());
      const horas = dosDigitos(fecha.getHours());
      const minutos = dosDigitos(fecha.getMinutes());
      const segundos = dosDigitos(fecha.getSeconds());

      return `${anio}-${mes}-${dia}T${horas}:${minutos}:${segundos}`;
    };

    const resolverFecha = (val: any): string | undefined => {
      if (!val) return undefined;

      const fecha = Array.isArray(val) ? val[0] : val;
      if (!fecha) return undefined;

      if (fecha instanceof Date) {
        return aTextoLocal(fecha);
      }

      let fechaStr = String(fecha).trim();
      if (fechaStr.includes(' ') && !fechaStr.includes('T')) {
        fechaStr = fechaStr.replace(' ', 'T');
      }

      // Se quita la marca de UTC en vez de agregarla: con la 'Z' el backend
      // interpretaba la hora local como si fuera universal.
      return fechaStr.replace(/Z$/, '');
    };

    const formatearHora = (dateObj: Date | undefined): string | undefined => {
      if (!dateObj) return undefined;
      return dateObj.toTimeString().substring(0, 5);
    };

    return {
      noViaje: resolverTexto(this.noViaje),
      fecha: resolverFecha(this.datetime24h),
      turno: resolverTexto(this.turno),
      citaTerminal: resolverFecha(this.citaTerminal),
      comentarios: resolverTexto(this.comentarios),
      idPatio: resolverNumero(this.idPatio),
      asignacion: resolverTexto(this.asignacion),
      sIngreso: resolverFecha(this.sIngreso),

      horaCita: formatearHora(this.horaCitaDate) || resolverTexto(this.horaCita),

      idConvenio: this.idConvenio,
      comentariosConvenio: resolverTexto(this.comentariosComercial),

      insumosAdicionales: resolverTexto(this.insumosAdicionales),
      reexpedicion: resolverTexto(this.reexpedicion),

      idCliente: resolverNumero(this.idCliente),
      idEjecutivo: resolverNumero(this.idEjecutivo),
      idOperador: resolverNumero(this.idOperador),
      idEquipoRuta: resolverNumero(this.idEquipoRuta),
      idOperadorRetira: resolverNumero(this.idOperadorRetira),
      idEquipoRetira: resolverNumero(this.idEquipoRetira),
      idTipoOperacion: resolverNumero(this.idTipoOperacion),
      idTipoMercancia: resolverNumero(this.idTipoMercancia),

      idOrigen: resolverNumero(this.idOrigen),

      idCiudad: resolverNumero(this.idCiudad),
      idEstado: resolverNumero(this.idDestino),

      comision: resolverNumero(this.comision),
      gasto: resolverNumero(this.gasto),
      estatus: resolverNumero(this.estatus),
      idPatio2: resolverNumero(this.idPatio2),

      envioAsignacion: resolverTexto(this.EnvioAsig),
      envioDocumentos: resolverTexto(this.EnvioDoc),
      envioCita: resolverTexto(this.EnvioCitas),

      envioSeguimiento: resolverTexto(this.EnvioSeguimiento),
      envioCCP : resolverTexto(this.EnvioCcp),

      idEquipoIngreso: resolverNumero(this.idEquipoIngreso),
      idOperadorIngreso: resolverNumero(this.idOperadorIngreso),
      entrega: resolverFecha(this.entrega),
      envio: resolverTexto(this.envio),

      conexiones: this.conexiones,

      idUsuario: this.datosViajeCreacion?.idCreador || undefined,
      idEmpresa: this.datosViajeCreacion?.idEmpresa || undefined,

    };
  }

}
