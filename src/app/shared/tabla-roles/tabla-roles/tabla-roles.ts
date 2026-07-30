import { Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { Usuarios } from '../../../core/services/usuarios';
import { Role } from '../../../core/models/Role';
import { Funcion } from '../../../core/models/Funcion';
import { Permiso } from '../../../core/models/Permiso';

interface FilaMatrizPermiso {
  idPermiso: number;
  nombrePermiso: string;
  rutaModulo: string | null;
  funciones: { [idFuncion: number]: boolean };
}

@Component({
  selector: 'app-tabla-roles',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    CheckboxModule,
    ButtonModule,
    DialogModule,
    ToastModule,
    InputTextModule,
  ],
  providers: [MessageService],

  templateUrl: './tabla-roles.html',
  styleUrl: './tabla-roles.css',
})
export class TablaRoles implements OnInit {
  @Input() empresa!: string;
  @Input() idEmpresa!: number;

  private usuariosService = inject(Usuarios);
  private messageService = inject(MessageService);

  roles: Role[] = [];
  permisos: Permiso[] = [];
  funciones: Funcion[] = [];
  cargando = false;

  mostrarDialog = false;
  cargandoMatriz = false;
  guardando = false;
  rolSeleccionado: Role | null = null;
  matrizPermisos: FilaMatrizPermiso[] = [];

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    forkJoin({
      roles: this.usuariosService.obtenerRolesPorEmpresa(this.idEmpresa),
      permisos: this.usuariosService.obtenerPermisosConRuta(),
      funciones: this.usuariosService.obtenerFunciones(),
    }).subscribe({
      next: ({ roles, permisos, funciones }) => {
        this.roles = roles;
        this.permisos = permisos;
        this.funciones = funciones;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar roles/permisos/funciones de KARVE:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los roles y permisos.',
        });
        this.cargando = false;
      },
    });
  }

  verRol(rol: Role): void {
    this.rolSeleccionado = rol;
    this.mostrarDialog = true;
    this.cargandoMatriz = true;

    this.usuariosService.obtenerPermisosDeRol(rol.idRol).subscribe({
      next: (asignados) => {
        const asignadosSet = new Set(asignados.map((a) => `${a.idPermiso}-${a.idFuncion}`));

        this.matrizPermisos = this.permisos.map((permiso) => {
          const funcionesFila: { [idFuncion: number]: boolean } = {};
          this.funciones.forEach((f) => {
            funcionesFila[f.idFuncion] = asignadosSet.has(`${permiso.idPermiso}-${f.idFuncion}`);
          });

          return {
            idPermiso: permiso.idPermiso,
            nombrePermiso: permiso.nombrePermiso,
            rutaModulo: permiso.rutaModulo,
            funciones: funcionesFila,
          };
        });

        this.cargandoMatriz = false;
      },
      error: (err) => {
        console.error('Error al cargar los permisos del rol:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los permisos de este rol.',
        });
        this.cargandoMatriz = false;
      },
    });
  }

  cerrarDialog(): void {
    this.mostrarDialog = false;
    this.rolSeleccionado = null;
    this.matrizPermisos = [];
  }

  guardarPermisos(): void {
    if (!this.rolSeleccionado) {
      return;
    }

    const permisosSeleccionados: { idPermiso: number; idFuncion: number }[] = [];
    this.matrizPermisos.forEach((fila) => {
      this.funciones.forEach((f) => {
        if (fila.funciones[f.idFuncion]) {
          permisosSeleccionados.push({ idPermiso: fila.idPermiso, idFuncion: f.idFuncion });
        }
      });
    });

    this.guardando = true;
    this.usuariosService.guardarPermisosDeRol(this.rolSeleccionado.idRol, permisosSeleccionados).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Permisos actualizados',
          detail: `Los permisos del rol ${this.rolSeleccionado?.nombreRol} se guardaron correctamente.`,
        });
        this.guardando = false;
        this.cerrarDialog();
      },
      error: (err) => {
        console.error('Error al guardar los permisos del rol:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron guardar los permisos del rol.',
        });
        this.guardando = false;
      },
    });
  }


}
