import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APIUsuarios } from "../APIUsuarios";
import { Role } from "../models/Role";
import {
  CambioDeContrasena,
  EmpresaCatalogo,
  UsuarioEdicion,
  UsuarioNuevo,
  UsuarioTabla
} from "../models/Usuario";

@Injectable({ providedIn: 'root' })
export class UsuariosService {

  private http = inject(HttpClient);

  // ─── Usuarios ──────────────────────────────────────────────────────

  obtenerTodos(): Observable<UsuarioTabla[]> {
    return this.http.get<UsuarioTabla[]>(APIUsuarios.obtenerTodos());
  }

  crearUsuario(usuario: UsuarioNuevo): Observable<UsuarioTabla> {
    return this.http.post<UsuarioTabla>(APIUsuarios.crearUsuario(), usuario);
  }

  actualizarUsuario(usuario: UsuarioEdicion): Observable<void> {
    return this.http.put<void>(
      APIUsuarios.actualizarUsuario(usuario.idUsuario),
      usuario
    );
  }

  cambiarContrasena(idUsuario: number, cambio: CambioDeContrasena): Observable<void> {
    return this.http.put<void>(
      APIUsuarios.cambiarContrasena(idUsuario),
      cambio
    );
  }

  eliminarUsuario(idUsuario: number): Observable<void> {
    return this.http.delete<void>(APIUsuarios.eliminarUsuario(idUsuario));
  }

  // ─── Catálogos ─────────────────────────────────────────────────────

  obtenerEmpresas(): Observable<EmpresaCatalogo[]> {
    return this.http.get<EmpresaCatalogo[]>(APIUsuarios.obtenerEmpresas());
  }

  obtenerRolesPorEmpresa(idEmpresa: number): Observable<Role[]> {
    return this.http.get<Role[]>(APIUsuarios.obtenerRolesPorEmpresa(idEmpresa));
  }

}
