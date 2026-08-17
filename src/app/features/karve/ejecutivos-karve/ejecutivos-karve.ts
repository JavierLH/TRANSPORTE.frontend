import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { TagModule } from 'primeng/tag';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import EjecutivoService from '../../../core/services/EjecutivoServices';
import { Ejecutivo } from '../../../core/models/CatalogosViajeDtos';

@Component({
  selector: 'app-ejecutivos-karve',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    TagModule,
    ToggleSwitchModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './ejecutivos-karve.html',
  styleUrl: './ejecutivos-karve.css',
})
export class EjecutivosKarve implements OnInit {
  private readonly idEmpresa = 1;
  private messageService = inject(MessageService);

  ejecutivoService: EjecutivoService = inject(EjecutivoService);

  tablaEjecutivos: Ejecutivo[] = [];
  cargando = false;

  mostrarDialog = false;
  ejecutivoSeleccionado: Ejecutivo | null = null;

  formNombre = '';
  formHabilitado = true;
  formIdEjecutivo : number | undefined;

  private seGuardaElEjecutivo : boolean | undefined;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.ejecutivoService.obtenerEjecutivosPorEmpresa(this.idEmpresa).subscribe(
      {
        next : (data) => {
          this.tablaEjecutivos = data;
          this.cargando = false;
        },
        error: (error) => {
          console.log('Error ',error);
        }
      }
    );

  }

  nuevoEjecutivo(): void {
    this.ejecutivoSeleccionado = null;
    this.formNombre = '';
    this.formHabilitado = true;
    this.mostrarDialog = true;
    this.seGuardaElEjecutivo = true;

  }

  editarEjecutivo(ejecutivo: Ejecutivo): void {
    this.formIdEjecutivo = ejecutivo.idEjecutivo ?? undefined;
    this.ejecutivoSeleccionado = ejecutivo;
    this.formNombre = ejecutivo.nombreEjecutivo ?? '';
    this.formHabilitado = ejecutivo.activo ?? true;
    this.mostrarDialog = true;
    this.seGuardaElEjecutivo = false;
  }

  cerrarDialog(): void {
    this.mostrarDialog = false;
    this.ejecutivoSeleccionado = null;
  }

  guardarEjecutivo(): void {
    const idEjecutivo = this.formIdEjecutivo;
    const nombreEjecutivo = this.formNombre;
    const idEmpresa = this.idEmpresa;
    const activo = this.formHabilitado;

    const creandoEjecutivo : Ejecutivo = {
      idEjecutivo: idEjecutivo ?? null,
      nombreEjecutivo : nombreEjecutivo,
      activo : activo,
      idEmpresa : idEmpresa
    };

    if(this.seGuardaElEjecutivo){
      this.ejecutivoService.agregarNuevoEjecutivo(creandoEjecutivo)
      .subscribe(
        {
          next : (req) => {
            this.imprimirMensaje(
              'success',
               this.ejecutivoSeleccionado ? 'Ejecutivo actualizado' : 'Ejecutivo creado',
              `${this.formNombre} se guardó correctamente.`
              );

            this.cargarDatos();
          },
          error : (error) => {
            this.imprimirMensaje(
              'error',
              'Error al guardar',
              `${this.formNombre} Error al guardar ejecutivo`
              );

              this.cargarDatos();

            }
        }
      );

    } else {

      this.ejecutivoService.actualizarEjecutivo(creandoEjecutivo).subscribe(
        {
          next : (data) => {
            this.imprimirMensaje(
              'success',
               this.ejecutivoSeleccionado ? 'Ejecutivo actualizado' : 'Ejecutivo creado',
              `${this.formNombre} se guardó correctamente.`
              );

              this.cargarDatos();
          },
          error : (error) => {
            this.imprimirMensaje(
              'error',
              'Error al guardar',
              `${this.formNombre} Error al guardar ejecutivo`
              );

              this.cargarDatos();

            }

        }
      );


    }

    this.seGuardaElEjecutivo = undefined;
    this.cerrarDialog();

  }

  imprimirMensaje (severety : string, summary : string, detail: string) {
      this.messageService.add({
      severity: severety,
      summary: summary,
      detail: detail,
    });
  }

}
