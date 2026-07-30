export interface UsuarioSistemaDTO {
    idUsuario: number;
    nombre: string;
    apPaterno?: string;
    apMaterno?: string;
    usuario: string;
    contrasena: string;
    esAdministrador: boolean;
}
