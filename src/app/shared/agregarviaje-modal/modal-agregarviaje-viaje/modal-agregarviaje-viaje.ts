import { Component, Output, EventEmitter, Input, OnInit, inject } from '@angular/core';
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
import { Cliente, DestinoEstadoCiudades, DestinoEstados, Ejecutivo, Equipo, Operacion, Operador, Origenes, TipoMercancia } from '../../../core/models/CatalogosViajeDtos';
import { MessageService } from 'primeng/api';

const ID_TIPO_EQUIPO_TRACTOCAMION = 3;

@Component({
  selector: 'app-modal-agregarviaje-viaje',
  standalone: true,
  imports: [InputTextModule, RadioButtonModule, ButtonModule, InputNumberModule, FormsModule, DatePickerModule, SelectModule],
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

  // Propiedades vinculadas al HTML
  noViaje: string = '';
  datetime24h: Date[] | undefined;
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
  idPatio: string = ''; // Destino
  idCiudad: number | undefined;
  insumosAdicionales: string = '';
  reexpedicion: string = '';
  comision: number = 0;
  gasto: number = 0;
  estatus: number | undefined;
  asignacion: string = '';
  sIngreso: string = '';
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
  ingreso: string = '';
  entrega: string = '';
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

  todasLasCiudades: DestinoEstadoCiudades[] = [];  // <-- nuevo: el catálogo completo, sin filtrar
  ciudades: DestinoEstadoCiudades[] = [];          // <-- ahora arranca vacío; se llena al elegir un Destino

  estatusList = [
    { id: 1, nombre: 'PROGRAMADO' }, { id: 2, nombre: 'EN VIAJE' }, { id: 3, nombre: 'FINALIZADO' }
  ];

  idProgramacion: number | undefined;

  label: string | undefined = 'Guardar';

  ngOnInit(): void {
  const idEmpresa = this.datosViajeCreacion?.idEmpresa;
  if (!idEmpresa) return;

  this.catalogosService.obtenerCatalogosViaje(idEmpresa).subscribe({
    next: (data) => {
      this.equipos = data.equipos.flatMap(grupo => grupo.equipos);
      this.equiposTractocamion = data.equipos.find(
        grupo => grupo.idTipoEquipo === ID_TIPO_EQUIPO_TRACTOCAMION
      )?.equipos ?? [];

      this.operadores = data.operadores;
      this.ejecutivos = data.ejecutivos;
      this.clientes = data.clientes;
      this.mercancias = data.tipoMercancia;
      this.operaciones = data.operaciones;
      this.origenes = data.origenes;
      this.destinos = data.destinoEstados;
      this.todasLasCiudades = data.destinoEstadoCiudades;

      console.log('**************');
      console.log(data);

      // Solo hasta que los catálogos ya estén listos, pedimos el viaje a editar
      if (this.datosViajeCreacion?.tipoDeOperacion === "EDITAR") {
        this.label = 'Actualizar';
        this.viajesService.obtenerViajePorId(this.filaSeleccionada.idProgramacion)
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
    //this.datetime24h = viaje.fecha ? new Date(viaje.fecha) : undefined;
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

    this.idPatio = viaje.idPatio ?? '';
    this.idCiudad = viaje.idCiudad;
    this.insumosAdicionales = viaje.insumosAdicionales ?? '';
    this.reexpedicion = viaje.reexpedicion ?? '';
    this.comision = viaje.comision ?? 0;
    this.gasto = viaje.gasto ?? 0;
    this.estatus = viaje.estatus;
    this.asignacion = viaje.asignacion ?? '';
    this.sIngreso = viaje.sIngreso ?? '';
    this.idPatio2 = viaje.idPatio2;

    this.horaCita = viaje.horaCita ?? '';
    this.horaCitaDate = viaje.horaCita ? new Date(`1970-01-01T${viaje.horaCita}:00`) : undefined;

    this.EnvioAsig = viaje.envioAsignacion ?? '';
    this.EnvioDoc = viaje.envioDocumentos ?? '';
    this.EnvioCitas = viaje.envioCita ?? '';
    this.EnvioSeguimiento = viaje.envioSeguimiento ?? '';
    this.EnvioCcp = viaje.envioCCP ?? '';

    this.idEquipoIngreso = viaje.idEquipoIngreso;
    this.idOperadorIngreso = viaje.idOperadorIngreso;
    this.ingreso = viaje.ingreso ?? '';
    this.entrega = viaje.entrega ?? '';
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

      // El p-datepicker entrega un objeto Date real (o un arreglo con uno)
      const fecha = Array.isArray(val) ? val[0] : val;
      if (!fecha) return undefined;

      if (fecha instanceof Date) {
        return fecha.toISOString();
      }

      // Los campos de texto libre (ingreso, entrega) llegan como string
      let fechaStr = String(fecha).trim();
      if (fechaStr.includes(' ') && !fechaStr.includes('T')) {
        fechaStr = fechaStr.replace(' ', 'T');
      }
      if (!fechaStr.endsWith('Z')) {
        fechaStr += 'Z';
      }
      return fechaStr;
    };

    // Extraer solo la hora del componente DatePicker (HH:mm)
    const formatearHora = (dateObj: Date | undefined): string | undefined => {
      if (!dateObj) return undefined;
      return dateObj.toTimeString().substring(0, 5); // Ej: "14:30"
    };

    const nuevoViaje: ProgramacionViajes = {
      noViaje: resolverTexto(this.noViaje),
      fecha: resolverFecha(this.datetime24h),
      turno: resolverTexto(this.turno),
      citaTerminal: resolverFecha(this.citaTerminal),
      comentarios: resolverTexto(this.comentarios),
      idPatio: resolverTexto(this.idPatio),
      asignacion: resolverTexto(this.asignacion),
      sIngreso: resolverTexto(this.sIngreso),

     horaCita: formatearHora(this.horaCitaDate) || resolverTexto(this.horaCita),

      comentariosConvenio: resolverTexto(this.comentariosConvenio),
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

      envioSeguimiento: resolverTexto(this.EnvioSeguimiento), // <-- nuevo
      envioCCP: resolverTexto(this.EnvioCcp),

      idEquipoIngreso: resolverNumero(this.idEquipoIngreso),
      idOperadorIngreso: resolverNumero(this.idOperadorIngreso),
      ingreso: resolverFecha(this.ingreso),
      entrega: resolverFecha(this.entrega),
      envio: resolverTexto(this.envio),

      idUsuario: this.datosViajeCreacion?.idCreador || undefined,
      idEmpresa: this.datosViajeCreacion?.idEmpresa || undefined
    };

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

  cambioEnCuidad(evento: SelectChangeEvent) {
    const idSeleccionado = evento.value;
    const ciudadSeleccionada = this.destinos.find(c => c.idEstado === idSeleccionado);

    if (ciudadSeleccionada) {
      console.log('Ciudad seleccionada -> id:', ciudadSeleccionada.idEstado, '| nombre:', ciudadSeleccionada.destinoEstado1);



    }
  }

cambioEnDestino(evento: SelectChangeEvent) {
  const idEstadoSeleccionado = evento.value; // gracias a optionValue="idEstado" en el select de Destino
  this.ciudades = this.todasLasCiudades.filter(c => c.idEstado === idEstadoSeleccionado);
  this.idCiudad = undefined; // la ciudad que tenía elegida antes ya no aplica al nuevo estado
}

  guardarDatos() {
    if(this.datosViajeCreacion?.tipoDeOperacion === "EDITAR"){
      alert('Se editara el viaje '+this.noViaje);

    }else{
      this.insertarNuevoValor();
    }
  }

  cerrarModal() {
    this.onClose.emit();
  }
}
