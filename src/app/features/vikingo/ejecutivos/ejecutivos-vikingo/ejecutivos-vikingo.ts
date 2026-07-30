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

// TODO: reemplazar por el DTO real cuando exista el endpoint de ejecutivos (con "habilitado" incluido)
interface EjecutivoVikingo {
  idEjecutivo: number;
  nombreEjecutivo: string;
  habilitado: boolean;
}

@Component({
  selector: 'app-ejecutivos-vikingo',
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
  templateUrl: './ejecutivos-vikingo.html',
  styleUrl: './ejecutivos-vikingo.css',
})
export class EjecutivosVikingo implements OnInit {
  private readonly idEmpresa = 2;
  private messageService = inject(MessageService);
  // private ejecutivosService = inject(EjecutivosService); // TODO: crear el service real

  ejecutivos: EjecutivoVikingo[] = [];
  cargando = false;

  mostrarDialog = false;
  ejecutivoSeleccionado: EjecutivoVikingo | null = null;

  formNombre = '';
  formHabilitado = true;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    // TODO: reemplazar por la llamada real al service
    // this.ejecutivosService.obtenerPorEmpresa(this.idEmpresa).subscribe({
    //   next: (ejecutivos) => { this.ejecutivos = ejecutivos; this.cargando = false; },
    //   error: (err) => { ...manejo de error... this.cargando = false; },
    // });
    this.cargando = false;
  }

  nuevoEjecutivo(): void {
    this.ejecutivoSeleccionado = null;
    this.formNombre = '';
    this.formHabilitado = true;
    this.mostrarDialog = true;
  }

  editarEjecutivo(ejecutivo: EjecutivoVikingo): void {
    this.ejecutivoSeleccionado = ejecutivo;
    this.formNombre = ejecutivo.nombreEjecutivo;
    this.formHabilitado = ejecutivo.habilitado;
    this.mostrarDialog = true;
  }

  cerrarDialog(): void {
    this.mostrarDialog = false;
    this.ejecutivoSeleccionado = null;
  }

  guardarEjecutivo(): void {
    // TODO: distinguir alta (POST) vs edición (PUT) según this.ejecutivoSeleccionado
    // this.ejecutivosService.guardar(...).subscribe({
    //   next: () => { ...actualizar this.ejecutivos... this.cerrarDialog(); },
    //   error: (err) => { ...toast de error... },
    // });

    this.messageService.add({
      severity: 'success',
      summary: this.ejecutivoSeleccionado ? 'Ejecutivo actualizado' : 'Ejecutivo creado',
      detail: `${this.formNombre} se guardó correctamente.`,
    });

    this.cerrarDialog();
  }
}
