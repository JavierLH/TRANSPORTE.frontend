/** Un par empresa/rol asignado a un usuario. */
export interface EmpresaAsociada {
  idEmpresa: number;
  idRol: number;
}

/** Lo que devuelve GET /UsuariosSistema/todos. */
export interface UsuarioTabla {
  idUsuario: number;
  nombreCompleto: string;
  usuario: string;
  empresasAsociadas: EmpresaAsociada[];
}

/**
 * Lo que espera POST /UsuariosSistema/registrar. La contraseña viaja en
 * claro por HTTPS y el backend la encripta antes de guardarla.
 */
export interface UsuarioNuevo {
  nombre: string;
  apPaterno: string | null;
  apMaterno: string | null;
  usuario: string;
  contrasena: string;
  roladministrador: boolean;
  empresasAsociadas: EmpresaAsociada[];
}

/**
 * Lo que espera PUT /UsuariosSistema/{id}. A propósito no lleva contraseña:
 * cambiarla es otra operación, con su propio endpoint.
 */
export interface UsuarioEdicion {
  idUsuario: number;
  nombre: string;
  apPaterno: string | null;
  apMaterno: string | null;
  usuario: string;
  roladministrador: boolean;
  empresasAsociadas: EmpresaAsociada[];
}

/**
 * Lo que espera PUT /UsuariosSistema/{id}/contrasena. `contrasenaActual`
 * sólo se manda cuando el usuario cambia la suya; un administrador que
 * resetea la de otro la deja vacía.
 */
export interface CambioDeContrasena {
  contrasenaActual: string | null;
  contrasenaNueva: string;
}

/** Fila del catálogo de empresas. */
export interface EmpresaCatalogo {
  idEmpresa: number;
  nombreEmpresa: string;
}
