export interface UsuarioPorEmpresa {
    idUsuario: number;
    nombre: string;
    apPaterno: string | null;
    apMaterno: string | null;
    usuario: string;
    roladministrador: boolean;
    idRol: number;
    nombreRol: string | null;
}
