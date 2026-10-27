import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TablaDashboardComponent, ColumnaTabla } from "../../../../shared/tabla-dashboard/tabla-dashboard";
import { CardFiltros } from "../../../../shared/card-filtros/card-filtros";
import { Button, ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ModalAgregarviajeViaje } from '../../../../shared/agregarviaje-modal/modal-agregarviaje-viaje/modal-agregarviaje-viaje';
import { TableModule } from 'primeng/table';
import { ProgramacionViajes } from '../../../../core/models/ProgramacionViajesDto';
import { CrearNuevViajeDto } from '../../../../core/models/CrearNuevoViajeDto';
import { ProgramacionViajesService } from '../../../../core/services/ProgramacionViajesService';
import { NgClass } from '@angular/common';
import { ProgramacionDeViajesVista } from '../../../../core/models/ProgramacionDeViajesVista';
import { TooltipModule } from 'primeng/tooltip';
import { colorDeTextoPara } from '../../../../core/utilidades/contraste';

@Component({
  selector: 'app-programacion-viajes-vikingo',
  imports: [TablaDashboardComponent,
    CardFiltros,
    Button,
    ButtonModule,
    DialogModule,
    ModalAgregarviajeViaje,
    TableModule,
    NgClass,
    TooltipModule],
  templateUrl: './programacion-viajes-vikingo.html',
  styleUrl: './programacion-viajes-vikingo.css',
})
export class ProgramacionViajesVikingo {

  /** El template sólo ve miembros de la clase, por eso se expone aquí. */
  public colorDeTexto = colorDeTextoPara;
  private cdr = inject(ChangeDetectorRef);

  /**
   * Columnas de la tabla. `field` apunta a las propiedades de
   * ProgramacionDeViajesVista, que es lo que se enlaza en [data].
   * El orden debe coincidir con el de los <td> del bodyTemplate.
   */
  /**
   * Al copiar al portapapeles, el convenio conserva el color que le calculó
   * la vista, igual que en pantalla.
   */
  columnaDelConvenio = { field: 'numeroConvenio', propiedadColor: 'color' };

  columnas: ColumnaTabla[] = [
    { field: 'folio',                   header: 'Folio' },
    { field: 'numeroViaje',             header: 'No. Viaje' },
    { field: 'numeroConvenio',          header: 'No. Convenio' },
    { field: 'fecha',                   header: 'Fecha' },
    { field: 'cliente',                 header: 'Cliente' },
    { field: 'ejecutivo',               header: 'Ejecutivo' },
    { field: 'turno',                   header: 'Turno' },
    { field: 'ecoRuta',                 header: 'Eco. Ruta' },
    { field: 'nombreOperador',          header: 'Operador Ruta' },
    { field: 'ecoRetira',               header: 'Eco. Retira' },
    { field: 'operadorRetira',          header: 'Operador Retira' },
    { field: 'mercanciaDescripcion',    header: 'Tipo Mercancía' },
    { field: 'operacion',               header: 'Operación' },
    { field: 'citaTerminal',            header: 'Terminal' },
    { field: 'comentarios',             header: 'Comentarios' },
    { field: 'nombreOrigen',            header: 'Origen' },
    { field: 'nombreDestino',           header: 'Destino' },
    { field: 'destinosEstadosCuidad',   header: 'Ciudad' },
    { field: 'comision',                header: 'Comisión' },
    { field: 'gasto',                   header: 'Gasto' },
    { field: 'asignacion',              header: 'Asignación' },
    { field: 'temperatura',             header: 'Temperatura' },
    { field: 'estatusConDetalle',      header: 'Estatus' },
    { field: 'ecoIngresa',              header: 'Eco. Ingresa' },
    { field: 'operadorIngresa',         header: 'Operador Ingresa' },
    { field: 'ingreso',                 header: 'Ingreso' },
    { field: 'entrega',                 header: 'Entrega' },
    { field: 'horaCita',                header: 'Horario Cita' },
    { field: 'envioPod',                header: 'Envío POD' },
    { field: 'envioAsignacion',         header: 'Envio Asignación' },
    { field: 'envioDocumentos',         header: 'Envio Documentos' },
    { field: 'envioCita',               header: 'Envío Cita' },
    { field: 'envioSeguimiento',        header: 'Envío Datos' },
    { field: 'envioCcp',                header: 'Envío CCP' },
    { field: 'salidaPatio',             header: 'Salida Patio' },
    { field: 'llegadaPlanta',           header: 'Llegada Planta' },
    { field: 'salidaPlanta',            header: 'Salida Planta' },
    { field: 'llegadaPatio',            header: 'Llegada Patio' },
    { field: 'estatusCita',             header: 'Estatus Cita' },
    { field: 'costoEstadias',           header: 'Costo por Estadia' },
    { field: 'estadias',                header: 'Estadias' },
    { field: 'costoToEstadias',         header: 'Total Estadias' },
    { field: 'observacionesMonitoreo',  header: 'Observaciones Monitoreo' },
    { field: 'idEquipoRemolque1',       header: 'Primer Remolque' },
    { field: 'idEquipoGenerador1',      header: 'Primer Generador' },
    { field: 'idEquipoRemolque2',       header: 'Segundo Remolque' },
    { field: 'idEquipoGenerador2',      header: 'Segundo Generador' },
    { field: 'idEquipoDolly',           header: 'Dolly' },
    { field: 'registro',                header: 'Fecha de creación' },
  ];

  mostrarModal = false;
  tituloFormulario = 'Agregar Viaje VIKINGO';

  viajes: ProgramacionViajes[] = [];
  cargando: boolean = false;
  totalRegistros: number = 0;
  paginaActual: number = 1;
  tamanoPagina: number = 20;

  // Nombres de ProgramacionDeViajesVista, que es lo que se enlaza en [data].
  camposDeBusqueda: string[] = ['folio', 'numeroViaje', 'cliente', 'ejecutivo', 'comentarios'];

  datosEmpresa: CrearNuevViajeDto;

  viajesVista: ProgramacionDeViajesVista[] = [];

  constructor(private viajesService: ProgramacionViajesService) {
    const usuarioStorage = localStorage.getItem('usuario');
    this.datosEmpresa = {
        idCreador: usuarioStorage ? JSON.parse(usuarioStorage).idUsuario : null,
        idEmpresa: 2,
        tipoDeOperacion: "",
        nombreEmpresa: "Vikingo"
    }
  }

  ngOnInit(): void {
    this.cargarViajes();
  }

  cargarViajes() {
    this.cargando = true;

    const hoy = new Date();
    const finMes = new Date(hoy.getFullYear(), hoy.getMonth() + 1, 0);

    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);

    const formatear = (fecha: Date) => {
      const a = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const d = String(fecha.getDate()).padStart(2, '0');
      return `${a}-${m}-${d}`;
    };

    const inicio = formatear(inicioMes);
    const fin = formatear(finMes);
    const idEmpresa = 2;

    /*
    this.viajesService.obtenerPorFechaYEmpresa(inicio, fin, idEmpresa).subscribe({
      next: (datos) => {
        this.viajes = datos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar viajes', err);
        this.cargando = false;
      }
      });
      */

      this.viajesService.obtenerPorFechaYEmpresaVista(inicio, fin, idEmpresa).subscribe(
        {
          next: (datos) => {
            console.log(datos);
            this.viajesVista = datos;
            this.cargando = false;
          },
          error: (err) => {
            console.error('Error al cargar viajes', err);
            this.cargando = false;
          }
        });

    }

    get claseTema(): string {
      return `tema-vikingo`;
    }

    public configurarFiltrosDeAppCardFiltros(datosDeLaCard: any) {
      const idOrigen = datosDeLaCard.origen?.idOrigen ?? null;
      const idEstatus = datosDeLaCard.estatus?.idEstatus ?? null;
      const idCliente = datosDeLaCard.cliente?.idCliente ?? null;
      const idEjecutivo = datosDeLaCard.ejecutivos?.idEjecutivo ?? null;
      const rangoDeFechas: Date[] | undefined = datosDeLaCard?.fehas;
      const idConvenio = datosDeLaCard.convenios?.idConvenio ?? null;
      //idConvenio

      const sinFechas = !rangoDeFechas?.[0];

      if (idConvenio == null && idOrigen === null && idEstatus === null && idCliente === null && idEjecutivo === null && sinFechas) {
        this.cargarViajes();
        return;
      }

      const formatear = (fecha: Date) => {
        const a = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, '0');
        const d = String(fecha.getDate()).padStart(2, '0');
        return `${a}-${m}-${d}`;
      };

      const fechaInicio = rangoDeFechas?.[0] ? formatear(rangoDeFechas[0]) : null;
      const fechaFin = rangoDeFechas?.[1]
        ? formatear(rangoDeFechas[1])
        : (rangoDeFechas?.[0] ? formatear(rangoDeFechas[0]) : null);

      const idEmpresa = 2;

      this.cargando = true;

      this.viajesService.obtenerViajesFiltradosVistaPorCriterios(
        idEmpresa,
        fechaInicio,
        fechaFin,
        idOrigen,
        idEstatus,
        idCliente,
        idEjecutivo,
        idConvenio

      ).subscribe({
        next: (datos) => {
          this.viajesVista = datos;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al filtrar viajes', err);
          this.cargando = false;
        }
      });
    }

    manejarClicEnViaje(viajeSeleccionado: ProgramacionViajes) {
      //console.log('¡El usuario hizo clic en este viaje!', viajeSeleccionado);
      //this.abrirModal('Editar viaje');
    }

    abrirModal(titulo: string) {
        this.tituloFormulario = titulo;
        this.mostrarModal = true;
        this.cdr.detectChanges();
    }

    cerrarModal() {
        this.mostrarModal = false;
        this.cdr.detectChanges();
    }



}
