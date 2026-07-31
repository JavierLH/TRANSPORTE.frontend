export interface Permiso {
    idPermiso: number;
    nombrePermiso: string;
    rutaModulo: string | null;
    rutaImagen: string ;
    padre: number | null;
    funciones: string[];
    hijos: Permiso[];
}

export interface Rol {
    idRol: number;
    nombreRol: string;
    descripcion: string;
    permisos: Permiso[];
}

export interface UsuarioEmpresaRol {
    idUsuario: number;
    idEmpresa: number;
    idRol: number;
    rol: Rol;
}

export interface Usuario {
    idUsuario: number;
    nombre: string;
    apellidoPaterno: string;
    apellidoMaterno: string;
    usuario: string;
    contrasena: string | null;
    usuarioEmpresaRols: UsuarioEmpresaRol[];
}

export interface LoginResponse {
    username: string;
    exito: boolean;
    idUsuario: number;
    nombre: string;
    apPaterno: string;
    apMaterno: string;
    token: string;
    informacionAdicional: Usuario; // <--- Aquí vinculamos tu interfaz Usuario
}
