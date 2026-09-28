import { environment } from "../environments/enviroments";

export const APIUsuarios = {

  // ─── Usuarios ──────────────────────────────────────────────────────

  obtenerTodos: (): string =>
    `${environment.host}/UsuariosSistema/todos`,

  crearUsuario: (): string =>
    `${environment.host}/UsuariosSistema/registrar`,

  actualizarUsuario: (idUsuario: number): string =>
    `${environment.host}/UsuariosSistema/${idUsuario}`,

  // La contraseña va aparte: así una edición de datos no puede tocar el hash.
  cambiarContrasena: (idUsuario: number): string =>
    `${environment.host}/UsuariosSistema/${idUsuario}/contrasena`,

  eliminarUsuario: (idUsuario: number): string =>
    `${environment.host}/UsuariosSistema/${idUsuario}`,

  // ─── Catálogos que necesita el alta ────────────────────────────────

  obtenerEmpresas: (): string =>
    `${environment.host}/Empresas`,

  obtenerRolesPorEmpresa: (idEmpresa: number): string =>
    `${environment.host}/Empresas/${idEmpresa}/roles`,

};
