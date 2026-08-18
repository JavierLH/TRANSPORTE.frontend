import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core'; // <-- Importa ChangeDetectorRef e inject
import { CardFiltros } from "../../../shared/card-filtros/card-filtros";
import { Button, ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { ModalAgregarviajeViaje } from '../../../shared/agregarviaje-modal/modal-agregarviaje-viaje/modal-agregarviaje-viaje';
import { TablaDashboardComponent, ColumnaTabla } from '../../../shared/tabla-dashboard/tabla-dashboard';
import { ProgramacionViajes } from '../../../core/models/ProgramacionViajesDto';
import { ProgramacionViajesService } from '../../../core/services/ProgramacionViajesService';
import { TableModule } from "primeng/table";
import { CrearNuevViajeDto } from '../../../core/models/CrearNuevoViajeDto';
import { NgClass } from '@angular/common';
import { ProgramacionDeViajesVista } from '../../../core/models/ProgramacionDeViajesVista';

@Component({
  selector: 'app-programacion-viajes-karve',
  imports: [
    TablaDashboardComponent,
    CardFiltros,
    Button,
    ButtonModule,
    DialogModule,
    ModalAgregarviajeViaje,
    TableModule,
    NgClass
],
  templateUrl: './programacion-viajes-karve.html',
  styleUrl: './programacion-viajes-karve.css',
})
export class ProgramacionViajesKarve implements OnInit {
    private cdr = inject(ChangeDetectorRef);

    /**
     * Columnas de la tabla. `field` apunta a las propiedades de
     * ProgramacionDeViajesVista, que es lo que se enlaza en [data].
     * El orden debe coincidir con el de los <td> del bodyTemplate.
     */
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
    tituloFormulario = 'Agregar Viaje KARVE';

    viajes: ProgramacionViajes[] = [];
    viajesVista: ProgramacionDeViajesVista[] = [];
    cargando: boolean = false;
    totalRegistros: number = 0;
    paginaActual: number = 1;
    tamanoPagina: number = 20;

    // Nombres de ProgramacionDeViajesVista, que es lo que se enlaza en [data].
    camposDeBusqueda: string[] = ['folio', 'numeroViaje', 'cliente', 'ejecutivo', 'comentarios'];

    datosEmpresa: CrearNuevViajeDto;

    idEmpresa: number = 1;

    constructor(private viajesService: ProgramacionViajesService) {
      const usuarioStorage = localStorage.getItem('usuario');
      this.datosEmpresa = {
          idCreador: usuarioStorage ? JSON.parse(usuarioStorage).idUsuario : null,
          idEmpresa: this.idEmpresa,
          tipoDeOperacion: "",
          nombreEmpresa: "Karve"
      }
    }

    ngOnInit(): void {
      this.cargarViajes();
    }

    cargarViajes() {
      this.cargando = true;

      const hoy = new Date();
      const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // día 1 del mes actual

      const formatear = (fecha: Date) => {
        const a = fecha.getFullYear();
        const m = String(fecha.getMonth() + 1).padStart(2, '0');
        const d = String(fecha.getDate()).padStart(2, '0');
        return `${a}-${m}-${d}`;
      };

      const inicio = formatear(inicioMes); // ej. 2026-07-01
      const fin = formatear(hoy);          // ej. 2026-07-24
      const idEmpresa = this.idEmpresa;

      this.viajesService.obtenerPorFechaYEmpresaVista(inicio, fin, idEmpresa).subscribe({
        next: (datos) => {
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
      return `tema-karve`;
    }

    /** Recibe los filtros de app-card-filtros y recarga la tabla con ellos. */
    public configurarFiltrosDeAppCardFiltros(datosDeLaCard: any) {
      const idOrigen = datosDeLaCard.origen?.idOrigen ?? null;
      const idEstatus = datosDeLaCard.estatus?.idEstatus ?? null;
      const idCliente = datosDeLaCard.cliente?.idCliente ?? null;
      const idEjecutivo = datosDeLaCard.ejecutivos?.idEjecutivo ?? null;
      const rangoDeFechas: Date[] | undefined = datosDeLaCard?.fehas;

      const sinFechas = !rangoDeFechas?.[0];

      // Sin ningún criterio, se vuelve a la carga por defecto del mes.
      if (idOrigen === null && idEstatus === null && idCliente === null && idEjecutivo === null && sinFechas) {
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

      this.cargando = true;

      this.viajesService.obtenerViajesFiltradosVistaPorCriterios(
        this.idEmpresa,
        fechaInicio,
        fechaFin,
        idOrigen,
        idEstatus,
        idCliente,
        idEjecutivo
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
