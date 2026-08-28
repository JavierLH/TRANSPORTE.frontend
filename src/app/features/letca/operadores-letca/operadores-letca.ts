import { Component, OnInit, inject } from '@angular/core';
import { Observable } from 'rxjs';
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
import OperadorService from '../../../core/services/OperadorServices';
import { Operador, OPERADOR_ACTIVO, OPERADOR_INACTIVO } from '../../../core/models/Operador';

@Component({
  selector: 'app-operadores-letca',
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
  templateUrl: './operadores-letca.html',
  styleUrl: './operadores-letca.css',
})
export class OperadoresLetca implements OnInit {
  private readonly idEmpresa = 4;
  private messageService = inject(MessageService);

  operadorService: OperadorService = inject(OperadorService);

  tablaOperadores: Operador[] = [];
  cargando = false;
  guardando = false;

  mostrarDialog = false;
  operadorSeleccionado: Operador | null = null;

  formNombre = '';
  formActivo = true;
  formIdOperador: number | undefined;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.operadorService.obtenerOperadoresPorEmpresa(this.idEmpresa).subscribe({
      next: (data) => {
        this.tablaOperadores = data;
        this.cargando = false;
      },
      error: (error) => {
        console.log('Error ', error);
        this.cargando = false;
      }
    });
  }

  nuevoOperador(): void {
    this.operadorSeleccionado = null;
    this.formIdOperador = undefined;
    this.formNombre = '';
    this.formActivo = true;
    this.mostrarDialog = true;
  }

  editarOperador(operador: Operador): void {
    this.operadorSeleccionado = operador;
    this.formIdOperador = operador.idOperador ?? undefined;
    this.formNombre = operador.nombreOperador ?? '';
    this.formActivo = operador.estatus === OPERADOR_ACTIVO;
    this.mostrarDialog = true;
  }

  cerrarDialog(): void {
    this.mostrarDialog = false;
    this.operadorSeleccionado = null;
    this.guardando = false;
  }

  guardarOperador(): void {
    if (!this.formNombre.trim()) {
      this.avisar('warn', 'Atención', 'El nombre del operador es obligatorio.');
      return;
    }

    this.guardando = true;

    const esEdicion = this.operadorSeleccionado !== null;

    const operador: Operador = {
      // En el alta se manda 0: IdOperador tiene llave primaria pero no es
      // IDENTITY, y el backend le calcula el siguiente valor.
      idOperador: this.formIdOperador ?? 0,
      nombreOperador: this.formNombre.trim(),
      estatus: this.formActivo ? OPERADOR_ACTIVO : OPERADOR_INACTIVO,
      idEmpresa: this.idEmpresa
    };

    // Se anota el tipo a propósito: sin esto el ternario produce
    // Observable<void> | Observable<Operador> —una unión de dos Observables—
    // y TypeScript no puede llamar .subscribe() sobre eso (TS2349).
    const peticion: Observable<Operador | void> = esEdicion
      ? this.operadorService.actualizarOperador(operador)
      : this.operadorService.agregarNuevoOperador(operador);

    peticion.subscribe({
      next: () => {
        this.avisar(
          'success',
          esEdicion ? 'Operador actualizado' : 'Operador creado',
          `${operador.nombreOperador} se guardó correctamente.`
        );

        this.cerrarDialog();
        this.cargarDatos();
      },
      error: (error) => {
        this.guardando = false;

        // 409: el backend rechaza nombres repetidos dentro de la misma empresa.
        const detalle = error?.status === 409
          ? 'Ya existe un operador con ese nombre en la empresa.'
          : 'No se pudo guardar el operador.';

        this.avisar('error', 'Error al guardar', detalle);
      }
    });
  }

  private avisar(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }
}
