import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { Usuarios } from '../../../../core/services/usuarios';
import { UsuarioPorEmpresa } from '../../../../core/models/UsuarioPorEmpresa';
import { Role } from '../../../../core/models/Role';
import { TablaRoles } from "../../../../shared/tabla-roles/tabla-roles/tabla-roles";

@Component({
  selector: 'app-drakkar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    SelectModule,
    TagModule,
    ToastModule,
    TablaRoles
],
  providers: [MessageService],
  templateUrl: './drakkar.html',
  styleUrl: './drakkar.css',
})
export class Drakkar implements OnInit {

  // ID fijo de la empresa DRAKKAR (ver SiilContext.cs -> new Empresa { IdEmpresa = 3, NombreEmpresa = "DRAKKAR" })
  private readonly idEmpresa = 3;

  private usuariosService = inject(Usuarios);
  private messageService = inject(MessageService);

  usuarios: UsuarioPorEmpresa[] = [];
  catalogoRoles: Role[] = [];
  cargando = false;

  mostrarDialog = false;
  usuarioSeleccionado: UsuarioPorEmpresa | null = null;
  rolSeleccionado: number | null = null;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;
    forkJoin({
      usuarios: this.usuariosService.obtenerUsuariosPorEmpresa(this.idEmpresa),
      roles: this.usuariosService.obtenerRolesPorEmpresa(this.idEmpresa),
    }).subscribe({
      next: ({ usuarios, roles }) => {
        this.usuarios = usuarios;
        this.catalogoRoles = roles;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar los datos de DRAKKAR:', err);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'No se pudieron cargar los usuarios y roles de la empresa.',
        });
        this.cargando = false;
      },
    });
  }

  verUsuario(usuario: UsuarioPorEmpresa): void {
    this.usuarioSeleccionado = usuario;
    this.rolSeleccionado = usuario.idRol;
    this.mostrarDialog = true;
  }

  cerrarDialog(): void {
    this.mostrarDialog = false;
    this.usuarioSeleccionado = null;
    this.rolSeleccionado = null;
  }

guardarRol(): void {
  if (!this.usuarioSeleccionado || !this.rolSeleccionado) {
    return;
  }

  const idUsuario = this.usuarioSeleccionado.idUsuario;
  const idRol = this.rolSeleccionado;
  const nombreUsuario = this.usuarioSeleccionado.usuario;

  this.usuariosService.actualizarRolUsuario(this.idEmpresa, idUsuario, idRol).subscribe({
    next: () => {
      const rol = this.catalogoRoles.find((r) => r.idRol === idRol);
      const usuario = this.usuarios.find((u) => u.idUsuario === idUsuario);
      if (usuario && rol) {
        usuario.idRol = rol.idRol;
        usuario.nombreRol = rol.nombreRol;
      }

      this.messageService.add({
        severity: 'success',
        summary: 'Rol actualizado',
        detail: `El rol de ${nombreUsuario} se actualizó correctamente.`,
      });

      this.cerrarDialog();
    },
    error: (err) => {
      console.error('Error al actualizar el rol:', err);
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'No se pudo actualizar el rol del usuario.',
      });
    },
  });
}
}
