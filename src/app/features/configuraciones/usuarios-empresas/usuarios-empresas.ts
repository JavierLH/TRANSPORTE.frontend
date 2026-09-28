import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { forkJoin, Observable, of } from 'rxjs';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { Usuarios, UsuarioSistemaDTO } from '../../../core/services/usuarios';
import { UsuariosService } from '../../../core/services/UsuariosService';
import { Role } from '../../../core/models/Role';
import { EmpresaAsociada, UsuarioTabla as UsuarioDelBackend } from '../../../core/models/Usuario';

export interface UsuarioTabla {
    idUsuario: number;
    nombreCompleto: string;
    usuario: string;
    // Diccionario dinámico: idEmpresa -> true/false
    accesos: { [idEmpresa: number]: boolean };
    // Se guarda el par empresa/rol tal como vino, para poder editarlo.
    empresasAsociadas: EmpresaAsociada[];
}

/** Una empresa dentro del modal, con su rol elegido. */
export interface AsignacionDeEmpresa {
    idEmpresa: number;
    nombre: string;
    seleccionada: boolean;
    idRol: number | undefined;
    roles: Role[];
}

@Component({
    selector: 'app-usuarios-empresas',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CheckboxModule,
        InputTextModule,
        ButtonModule,
        DialogModule,
        SelectModule,
        ToastModule,
        TooltipModule
    ],
    providers: [MessageService],
    templateUrl: './usuarios-empresas.html',
    styleUrl: './usuarios-empresas.css'
})
export class UsuariosEmpresas implements OnInit {

    private cdr = inject(ChangeDetectorRef);
    private messageService = inject(MessageService);
    private usuariosService = inject(Usuarios);
    private usuariosCrud = inject(UsuariosService);

    public usuariosTabla: UsuarioTabla[] = [];
    public columnasEmpresas: { idEmpresa: number, nombre: string }[] = [];

    /** Los roles de cada empresa, cargados una sola vez. */
    private rolesPorEmpresa: { [idEmpresa: number]: Role[] } = {};

    // ─── Modal ───────────────────────────────────────────────────────

    public mostrarModal = false;
    public tituloFormulario = '';
    public guardando = false;

    /** Sólo tiene valor al editar; en el alta queda indefinido. */
    public formIdUsuario: number | undefined;

    public formNombre = '';
    public formApPaterno = '';
    public formApMaterno = '';
    public formUsuario = '';
    public formContrasena = '';
    public formEsAdministrador = false;

    public asignaciones: AsignacionDeEmpresa[] = [];

    // ─── Modal de contraseña ─────────────────────────────────────────

    public mostrarModalContrasena = false;
    public usuarioDeLaContrasena: UsuarioTabla | undefined;
    public formContrasenaNueva = '';

    ngOnInit(): void {
        this.usuariosService.obtenerTodasLasEmpresas().subscribe({
            next: (empresas) => {
                this.columnasEmpresas = empresas.map(e => ({
                    idEmpresa: e.idEmpresa,
                    nombre: e.nombreEmpresa
                }));

                this.cargarRolesDeLasEmpresas();
                this.cargarUsuariosDesdeBD();
            },
            error: (err) => console.error('Error al cargar las empresas', err)
        });
    }

    /**
     * Los roles se traen por empresa, así que se piden todos de un jalón al
     * inicio y se guardan. Así abrir el modal no dispara cuatro peticiones.
     */
    private cargarRolesDeLasEmpresas(): void {
        const peticiones: Observable<Role[]>[] = this.columnasEmpresas
            .map(col => this.usuariosCrud.obtenerRolesPorEmpresa(col.idEmpresa));

        if (peticiones.length === 0) {
            return;
        }

        forkJoin(peticiones).subscribe({
            next: (respuestas) => {
                respuestas.forEach((roles, indice) => {
                    this.rolesPorEmpresa[this.columnasEmpresas[indice].idEmpresa] = roles;
                });
            },
            error: (err) => console.error('Error al cargar los roles', err)
        });
    }

    public cargarUsuariosDesdeBD(): void {
        this.usuariosService.obtenerTodosLosUsuarios().subscribe({
            next: (data: UsuarioSistemaDTO[]) => {
                this.usuariosTabla = data.map(user => {
                    const mapaDeAccesos: { [idEmpresa: number]: boolean } = {};

                    this.columnasEmpresas.forEach(col => {
                        mapaDeAccesos[col.idEmpresa] = user.empresasAsociadas
                            .some(e => e.idEmpresa === col.idEmpresa);
                    });

                    return {
                        idUsuario: user.idUsuario,
                        nombreCompleto: user.nombreCompleto,
                        usuario: user.usuario,
                        accesos: mapaDeAccesos,
                        empresasAsociadas: user.empresasAsociadas
                    };
                });

                this.cdr.detectChanges();
            },
            error: (err) => console.error('Error al cargar los usuarios', err)
        });
    }

    public guardarDatos(): void {
        const datosParaBackend = this.usuariosTabla.map(user => ({
            idUsuario: user.idUsuario,
            empresasSeleccionadas: this.columnasEmpresas
                .filter(col => user.accesos[col.idEmpresa] === true)
                .map(col => col.idEmpresa)
        }));

        this.usuariosService.guardarPermisos(datosParaBackend).subscribe({
            next: () => this.avisar('success', 'Guardado', 'Los accesos se actualizaron.'),
            error: (err) => {
                console.error('Error al guardar', err);
                this.avisar('error', 'Error al guardar', 'No se pudieron guardar los accesos.');
            }
        });
    }

    // ─── Alta y edición ──────────────────────────────────────────────

    public crearUsuario(): void {
        this.formIdUsuario = undefined;
        this.formNombre = '';
        this.formApPaterno = '';
        this.formApMaterno = '';
        this.formUsuario = '';
        this.formContrasena = '';
        this.formEsAdministrador = false;

        this.asignaciones = this.armarAsignaciones([]);

        this.abrirModal('Crear nuevo usuario');
    }

    public editarUsuario(usuario: UsuarioTabla): void {
        this.formIdUsuario = usuario.idUsuario;

        // El backend manda el nombre ya concatenado, así que se reparte en
        // los tres campos. El resto de las partes se pegan al segundo
        // apellido para no perder nada al guardar.
        const partes = usuario.nombreCompleto.split(' ').filter(p => p.length > 0);
        this.formNombre = partes[0] ?? '';
        this.formApPaterno = partes[1] ?? '';
        this.formApMaterno = partes.slice(2).join(' ');

        this.formUsuario = usuario.usuario;
        this.formContrasena = '';
        this.formEsAdministrador = false;

        this.asignaciones = this.armarAsignaciones(usuario.empresasAsociadas);

        this.abrirModal('Editar usuario');
    }

    /** Una fila por empresa, marcando las que el usuario ya tiene. */
    private armarAsignaciones(actuales: EmpresaAsociada[]): AsignacionDeEmpresa[] {
        return this.columnasEmpresas.map(col => {
            const asignada = actuales.find(a => a.idEmpresa === col.idEmpresa);

            return {
                idEmpresa: col.idEmpresa,
                nombre: col.nombre,
                seleccionada: asignada != null,
                idRol: asignada?.idRol,
                roles: this.rolesPorEmpresa[col.idEmpresa] ?? []
            };
        });
    }

    private abrirModal(titulo: string): void {
        this.tituloFormulario = titulo;
        this.mostrarModal = true;
        this.guardando = false;
        this.cdr.detectChanges();
    }

    public cerrarModal(): void {
        this.mostrarModal = false;
        this.guardando = false;
        this.cdr.detectChanges();
    }

    public guardarUsuario(): void {
        const nombre = this.formNombre.trim();
        const nombreDeUsuario = this.formUsuario.trim();
        const esEdicion = this.formIdUsuario != null;

        if (!nombre || !nombreDeUsuario) {
            this.avisar('warn', 'Atención', 'El nombre y el usuario son obligatorios.');
            return;
        }

        if (!esEdicion && this.formContrasena.length < 8) {
            this.avisar('warn', 'Atención', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        // Una empresa marcada sin rol no se puede guardar: el backend espera
        // el par completo y rechazaría la petición con un 422.
        const sinRol = this.asignaciones.find(a => a.seleccionada && a.idRol == null);

        if (sinRol != null) {
            this.avisar('warn', 'Atención', `Selecciona el rol para ${sinRol.nombre}.`);
            return;
        }

        const empresasAsociadas: EmpresaAsociada[] = this.asignaciones
            .filter(a => a.seleccionada)
            .map(a => ({ idEmpresa: a.idEmpresa, idRol: a.idRol! }));

        this.guardando = true;

        // Se anota el tipo: sin esto el ternario produce una unión de dos
        // Observables distintos y TypeScript no puede llamar .subscribe().
        const peticion: Observable<UsuarioDelBackend | void> = esEdicion
            ? this.usuariosCrud.actualizarUsuario({
                idUsuario: this.formIdUsuario!,
                nombre,
                apPaterno: this.formApPaterno.trim() || null,
                apMaterno: this.formApMaterno.trim() || null,
                usuario: nombreDeUsuario,
                roladministrador: this.formEsAdministrador,
                empresasAsociadas
            })
            : this.usuariosCrud.crearUsuario({
                nombre,
                apPaterno: this.formApPaterno.trim() || null,
                apMaterno: this.formApMaterno.trim() || null,
                usuario: nombreDeUsuario,
                contrasena: this.formContrasena,
                roladministrador: this.formEsAdministrador,
                empresasAsociadas
            });

        peticion.subscribe({
            next: () => {
                this.avisar(
                    'success',
                    esEdicion ? 'Usuario actualizado' : 'Usuario creado',
                    `${nombreDeUsuario} se guardó correctamente.`
                );

                this.cerrarModal();
                this.cargarUsuariosDesdeBD();
            },
            error: (err) => {
                this.guardando = false;
                console.error('Error al guardar el usuario', err);
                this.avisar('error', 'Error al guardar', this.detalleDelError(err, nombreDeUsuario));
            }
        });
    }

    // ─── Cambio de contraseña ────────────────────────────────────────

    public abrirModalContrasena(usuario: UsuarioTabla): void {
        this.usuarioDeLaContrasena = usuario;
        this.formContrasenaNueva = '';
        this.mostrarModalContrasena = true;
        this.cdr.detectChanges();
    }

    public cerrarModalContrasena(): void {
        this.mostrarModalContrasena = false;
        this.guardando = false;
        this.cdr.detectChanges();
    }

    public guardarContrasena(): void {
        if (this.usuarioDeLaContrasena == null) {
            return;
        }

        if (this.formContrasenaNueva.length < 8) {
            this.avisar('warn', 'Atención', 'La contraseña debe tener al menos 8 caracteres.');
            return;
        }

        this.guardando = true;

        // Va sin contrasenaActual: es un administrador reseteando la de otro,
        // no la conoce.
        this.usuariosCrud.cambiarContrasena(this.usuarioDeLaContrasena.idUsuario, {
            contrasenaActual: null,
            contrasenaNueva: this.formContrasenaNueva
        }).subscribe({
            next: () => {
                this.avisar('success', 'Contraseña actualizada', 'La contraseña se cambió correctamente.');
                this.cerrarModalContrasena();
            },
            error: (err) => {
                this.guardando = false;
                console.error('Error al cambiar la contraseña', err);
                this.avisar('error', 'Error', 'No se pudo cambiar la contraseña.');
            }
        });
    }

    private detalleDelError(err: any, nombreDeUsuario: string): string {
        // 409: el backend rechaza nombres de acceso repetidos.
        if (err?.status === 409) {
            return `Ya existe un usuario llamado ${nombreDeUsuario}.`;
        }

        if (err?.status === 422) {
            return err?.error?.mensaje ?? 'Los datos del usuario no son válidos.';
        }

        return 'No se pudo guardar el usuario.';
    }

    private avisar(severity: string, summary: string, detail: string): void {
        this.messageService.add({ severity, summary, detail });
    }

}
