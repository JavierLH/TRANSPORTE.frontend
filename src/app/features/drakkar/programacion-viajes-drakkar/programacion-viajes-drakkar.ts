import { Component, ChangeDetectorRef, inject, OnInit } from '@angular/core'; // <-- Importa ChangeDetectorRef e inject
import { CardFiltros } from "../../../shared/card-filtros/card-filtros";
import { Button, ButtonModule } from "primeng/button";
import { DialogModule } from 'primeng/dialog';
import { ModalAgregarviajeViaje } from '../../../shared/agregarviaje-modal/modal-agregarviaje-viaje/modal-agregarviaje-viaje';
import { TablaDashboardComponent } from '../../../shared/tabla-dashboard/tabla-dashboard';
import { ProgramacionViajes } from '../../../core/models/ProgramacionViajesDto';
import { ProgramacionViajesService } from '../../../core/services/ProgramacionViajesService';
import { TableModule } from "primeng/table";
import { CrearNuevViajeDto } from '../../../core/models/CrearNuevoViajeDto';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-programacion-viajes-drakkar',
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
  templateUrl: './programacion-viajes-drakkar.html',
  styleUrl: './programacion-viajes-drakkar.css',
})
export class ProgramacionViajesDrakkar implements OnInit{
    private cdr = inject(ChangeDetectorRef);

    mostrarModal = false;
    tituloFormulario = 'Agregar Viaje KARVE';

    viajes: ProgramacionViajes[] = [];
    cargando: boolean = false;
    totalRegistros: number = 0;
    paginaActual: number = 1;
    tamanoPagina: number = 20;

    camposDeBusqueda: string[] = ['idProgramacion', 'noViaje', 'fecha', 'comentarios'];

    datosEmpresa: CrearNuevViajeDto;

    idEmpresa : number = 3;

    constructor(private viajesService: ProgramacionViajesService) {
      const usuarioStorage = localStorage.getItem('usuario');
      this.datosEmpresa = {
          idCreador: usuarioStorage ? JSON.parse(usuarioStorage).idUsuario : null,
          idEmpresa: this.idEmpresa,
          tipoDeOperacion: "",
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
    }

    get claseTema(): string {
      return `tema-drakkar`;
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
