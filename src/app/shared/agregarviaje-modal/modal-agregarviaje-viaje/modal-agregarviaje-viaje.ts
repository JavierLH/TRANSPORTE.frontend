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
  @Output() onGuardado = new EventEmitter<void>();
  @Input() viajeAEditar: ProgramacionViajes | undefined;

  @Input() filaSeleccionada: any;

  private viajesService = inject(ProgramacionViajesService);
  private catalogosService = inject(CatalogosViajeService);
  private messageService = inject(MessageService);
  private ConvenioServices = inject(ConvenioServices);

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

  // ================= ARREGLOS QUE SIGUEN SIENDO MOCK (sin endpoint todavía) =================
  tipos = [
    { id: 1, nombre: 'Sencillo' }, { id: 2, nombre: 'Full' }
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

  verDocumento() {}

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

    this.viajesService.insertarViaje(nuevoViaje).subscribe({
      next: (respuesta) => {
        console.log('Viaje creado con éxito:', respuesta);
        this.onGuardado.emit();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error detallado del backend:', err.error?.errors);
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

    this.viajesService.actualizarViaje(this.idProgramacion, viajeActualizado).subscribe({
      next: (respuesta) => {
        console.log('Viaje actualizado con éxito:', respuesta);
        this.onGuardado.emit();
        this.cerrarModal();
      },
      error: (err) => {
        console.error('Error detallado del backend:', err.error?.errors);
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

    const tipoMercancia = this.mercancias.filter(e => e.idTipoMercancia === event.value)[0].descripcion;

    if(tipoMercancia === "REFRIGERADA" || tipoMercancia
       === "REFRIGERADA/PELIGROSA" || tipoMercancia === "REFRIGERADA/GENERAL"
    ){
      this.NoEsVisibleLaTemperatura = false;
    }
    else{
      this.NoEsVisibleLaTemperatura = true;
      this.conexiones = '';
    }

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

    const resolverFecha = (val: any): string | undefined => {
      if (!val) return undefined;

      const fecha = Array.isArray(val) ? val[0] : val;
      if (!fecha) return undefined;

      if (fecha instanceof Date) {
        return fecha.toISOString();
      }

      let fechaStr = String(fecha).trim();
      if (fechaStr.includes(' ') && !fechaStr.includes('T')) {
        fechaStr = fechaStr.replace(' ', 'T');
      }
      if (!fechaStr.endsWith('Z')) {
        fechaStr += 'Z';
      }
      return fechaStr;
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
