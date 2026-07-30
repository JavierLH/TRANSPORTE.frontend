import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Usuarios, UsuarioSistemaDTO } from '../../../core/services/usuarios';

export interface UsuarioTabla {
    idUsuario: number;
    nombreCompleto: string;
    // Diccionario dinámico: idEmpresa -> true/false
    // Ejemplo: { 1: true, 2: false, 3: true, 4: false }
    accesos: { [idEmpresa: number]: boolean };
}

@Component({
    selector: 'app-usuarios-empresas',
    template: `
        <div class="card">
            <p-table
                #dt
                [value]="usuariosTabla"
                [globalFilterFields]="['nombreCompleto']"
                [tableStyle]="{ 'min-width': '50rem' }"
                [paginator]="true"
                [rows]="5"
                [rowsPerPageOptions]="[5, 10, 20]">

                <!-- CABECERA DE CONTROLES -->
                <ng-template pTemplate="caption">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <button
                            pButton
                            type="button"
                            label="Guardar Cambios"
                            icon="pi pi-save"
                            class="p-button-success"
                            (click)="guardarDatos()">
                        </button>

                        <span class="p-input-icon-left">
                            <i class="pi pi-search"></i>
                            <input pInputText type="text" (input)="dt.filterGlobal($any($event.target).value, 'contains')" placeholder="Buscar por usuario..." />
                        </span>
                    </div>
                </ng-template>

                <!-- CABECERAS DE COLUMNAS (DINÁMICAS) -->
                <ng-template pTemplate="header">
                    <tr>
                        <th style="width: 20%;">Nombre</th>
                        <!-- Iteramos sobre nuestro catálogo de empresas para crear los <th> -->
                        <th *ngFor="let col of columnasEmpresas" style="width: 20%; text-align: center;">
                            {{ col.nombre }}
                        </th>
                    </tr>
                </ng-template>

                <!-- CUERPO DE LA TABLA (DINÁMICO) -->
                <ng-template pTemplate="body" let-usuario>
                    <tr>
                        <td style="font-weight: bold;">{{ usuario.nombreCompleto }}</td>
                        <!-- Iteramos nuevamente para crear un checkbox por cada empresa -->
                        <td *ngFor="let col of columnasEmpresas" style="text-align: center;">
                            <!-- Mapeo bidireccional usando el diccionario y el ID de la empresa -->
                            <p-checkbox [(ngModel)]="usuario.accesos[col.idEmpresa]" [binary]="true"></p-checkbox>
                        </td>
                    </tr>
                </ng-template>

            </p-table>
        </div>
    `,
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        TableModule,
        CheckboxModule,
        InputTextModule,
        ButtonModule
    ]
})
export class UsuariosEmpresas implements OnInit {

    usuariosTabla: UsuarioTabla[] = [];
    private usuariosService = inject(Usuarios);



    columnasEmpresas: { idEmpresa: number, nombre: string }[] = [];

   ngOnInit() {
    // 1. Cargamos el catálogo de empresas primero
    this.usuariosService.obtenerTodasLasEmpresas().subscribe(empresas => {
        // Mapeamos los campos reales de tu entidad Empresa (ej: idEmpresa, nombreEmpresa)
        this.columnasEmpresas = empresas.map(e => ({
            idEmpresa: e.idEmpresa,
            nombre: e.nombreEmpresa
        }));

        // 2. Una vez que tenemos las columnas, cargamos los usuarios
        this.cargarUsuariosDesdeBD();
    });
}

    cargarUsuariosDesdeBD() {
        this.usuariosService.obtenerTodosLosUsuarios().subscribe({
            next: (data: UsuarioSistemaDTO[]) => {

                // Transformamos la respuesta del backend para que la tabla la entienda
                this.usuariosTabla = data.map(user => {

                    // Inicializamos el diccionario de accesos vacío
                    const mapaDeAccesos: { [idEmpresa: number]: boolean } = {};

                    // Recorremos las columnas y verificamos si el usuario tiene ese idEmpresa
                    this.columnasEmpresas.forEach(col => {
                        // .some() busca si existe el ID en el JSON que mandó el backend. Si sí, devuelve true.
                        const tieneAcceso = user.empresasAsociadas.some(e => e.idEmpresa === col.idEmpresa);
                        mapaDeAccesos[col.idEmpresa] = tieneAcceso;
                    });

                    return {
                        idUsuario: user.idUsuario,
                        nombreCompleto: user.nombreCompleto,
                        accesos: mapaDeAccesos
                    };
                });
            },
            error: (err) => {
                console.error("Error al cargar los usuarios:", err);
            }
        });
    }

guardarDatos() {
    const datosParaBackend = this.usuariosTabla.map(user => ({
        idUsuario: user.idUsuario,
        empresasSeleccionadas: this.columnasEmpresas
            .filter(col => user.accesos[col.idEmpresa] === true)
            .map(col => col.idEmpresa)
    }));

    console.log(datosParaBackend);

    this.usuariosService.guardarPermisos(datosParaBackend).subscribe({
        next: () => {
            alert('¡Cambios guardados exitosamente!');
        },
        error: (err) => {
            console.error('Error al guardar:', err);
            alert('Ocurrió un error al guardar los permisos');
        }
    });
}
}
