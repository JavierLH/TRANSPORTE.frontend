import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Observable } from 'rxjs';
import { LoginResponse, Usuario } from '../models/usuarioRolesFunciones';
import { API } from '../API';
import { UsuarioCredenciales } from '../models/UsuarioCredenciales';
import { UsuarioPorEmpresa } from '../models/UsuarioPorEmpresa';
import { Role } from '../models/Role';
import { Permiso } from '../models/Permiso';
import { Funcion } from '../models/Funcion';
import { RolPermiso } from '../models/RolPermiso';

export interface EmpresaAsociada {
    idEmpresa: number;
    idRol: number;
}

export interface UsuarioSistemaDTO {
    idUsuario: number;
    nombreCompleto: string;
    usuario: string;
    empresasAsociadas: EmpresaAsociada[];
}

@Injectable({
  providedIn: 'root',
})
export class Usuarios {


  constructor(private http: HttpClient){ }


  public IniciarSesion(usuarioCrendeciales: UsuarioCredenciales) : Observable<LoginResponse> {
    return this.http.post<LoginResponse>(
      API.IniciarSesionEnSistema(),
      usuarioCrendeciales
    );
  }


  public obtenerRolesYFuncionesDelCliente( idUsuario: number ) : Observable<Usuario>{

    console.log(API.obtenerUsuarioPorID(idUsuario));

    return this.http.get<Usuario>(API.obtenerUsuarioPorID(idUsuario));
  }

  public obtenerTodosLosUsuarios(): Observable<UsuarioSistemaDTO[]> {
      return this.http.get<UsuarioSistemaDTO[]>(API.obtenerTodosLosUsuarios());
  }

  public obtenerTodasLasEmpresas(): Observable<any[]> {
      return this.http.get<any[]>(API.obtenerTodasLasEmpresas());
  }

  public guardarPermisos(datos: any[]): Observable<any> {
      // Usar la ruta centralizada que configuramos en API.ts
      return this.http.post(API.actualizarPermisos(), datos);
  }

  public obtenerUsuariosPorEmpresa(idEmpresa: number): Observable<UsuarioPorEmpresa[]> {
      return this.http.get<UsuarioPorEmpresa[]>(API.obtenerUsuariosPorEmpresa(idEmpresa));
  }

  public obtenerRolesPorEmpresa(idEmpresa: number): Observable<Role[]> {
      return this.http.get<Role[]>(API.obtenerRolesPorEmpresa(idEmpresa));
  }

  public actualizarRolUsuario(idEmpresa: number, idUsuario: number, idRol: number): Observable<any> {
    return this.http.put(API.actualizarRolUsuario(idEmpresa, idUsuario), { idRol });
  }

  public obtenerPermisosConRuta(): Observable<Permiso[]> {
      return this.http.get<Permiso[]>(API.obtenerPermisosConRuta());
  }

  public obtenerFunciones(): Observable<Funcion[]> {
      return this.http.get<Funcion[]>(API.obtenerFunciones());
  }

  public obtenerPermisosDeRol(idRol: number): Observable<RolPermiso[]> {
      return this.http.get<RolPermiso[]>(API.obtenerPermisosDeRol(idRol));
  }

  public guardarPermisosDeRol(idRol: number, permisos: { idPermiso: number; idFuncion: number }[]): Observable<any> {
      return this.http.put(API.guardarPermisosDeRol(idRol), { permisos });
  }

}
