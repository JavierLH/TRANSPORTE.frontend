import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { TablaDashboardComponent } from "../../../../shared/tabla-dashboard/tabla-dashboard";
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

@Component({
  selector: 'app-programacion-viajes-vikingo',
  imports: [TablaDashboardComponent,
    CardFiltros,
    Button,
    ButtonModule,
    DialogModule,
    ModalAgregarviajeViaje,
    TableModule,
    NgClass],
  templateUrl: './programacion-viajes-vikingo.html',
  styleUrl: './programacion-viajes-vikingo.css',
})
export class ProgramacionViajesVikingo {
  private cdr = inject(ChangeDetectorRef);

  mostrarModal = false;
  tituloFormulario = 'Agregar Viaje VIKINGO';

  viajes: ProgramacionViajes[] = [];
  cargando: boolean = false;
  totalRegistros: number = 0;
  paginaActual: number = 1;
  tamanoPagina: number = 20;

  camposDeBusqueda: string[] = ['idProgramacion', 'noViaje', 'fecha', 'comentarios'];

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
    const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1); // día 1 del mes actual

    const formatear = (fecha: Date) => {
      const a = fecha.getFullYear();
      const m = String(fecha.getMonth() + 1).padStart(2, '0');
      const d = String(fecha.getDate()).padStart(2, '0');
      return `${a}-${m}-${d}`;
    };

    const inicio = formatear(inicioMes); // ej. 2026-07-01
    const fin = formatear(hoy);          // ej. 2026-07-24
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
      });*/

      this.viajesService.obtenerPorFechaYEmpresaVista(inicio, fin, idEmpresa).subscribe(
        {
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
      return `tema-vikingo`;
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
