import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import ClienteService from '../../../core/services/ClienteServices';
import { Cliente } from '../../../core/models/CatalogosViajeDtos';

@Component({
  selector: 'app-clientes-karve',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    DialogModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './clientes-karve.html',
  styleUrl: './clientes-karve.css',
})
export class ClientesKarve implements OnInit {
  private readonly idEmpresa = 1;
  private messageService = inject(MessageService);

  clienteService: ClienteService = inject(ClienteService);

  tablaClientes: Cliente[] = [];
  cargando = false;

  mostrarDialog = false;
  clienteSeleccionado: Cliente | null = null;

  formNombre = '';
  formIdCliente : number | undefined;

  private seGuardaElCliente : boolean | undefined;

  ngOnInit(): void {
    this.cargarDatos();
  }

  cargarDatos(): void {
    this.cargando = true;

    this.clienteService.obtenerClientesPorEmpresa(this.idEmpresa).subscribe(
      {
        next : (data) => {
          this.tablaClientes = data;
          this.cargando = false;
        },
        error: (error) => {
          console.log('Error ',error);
          this.cargando = false;
        }
      }
    );

  }

  nuevoCliente(): void {
    this.clienteSeleccionado = null;
    this.formIdCliente = undefined;
    this.formNombre = '';
    this.mostrarDialog = true;
    this.seGuardaElCliente = true;
  }

  editarCliente(cliente: Cliente): void {
    this.formIdCliente = cliente.idCliente ?? undefined;
    this.clienteSeleccionado = cliente;
    this.formNombre = cliente.nombreCliente ?? '';
    this.mostrarDialog = true;
    this.seGuardaElCliente = false;
  }

  cerrarDialog(): void {
    this.mostrarDialog = false;
    this.clienteSeleccionado = null;
  }

  guardarCliente(): void {
    const creandoCliente : Cliente = {
      // 0 en el alta: IdCliente es IDENTITY y no admite null en el backend.
      idCliente: this.formIdCliente ?? 0,
      nombreCliente : this.formNombre,
      idEmpresa : this.idEmpresa
    };

    if(this.seGuardaElCliente){
      this.clienteService.agregarNuevoCliente(creandoCliente).subscribe(
        {
          next : (req) => {
            this.imprimirMensaje(
              'success',
              'Cliente creado',
              `${this.formNombre} se guardó correctamente.`
              );

            this.cargarDatos();
          },
          error : (error) => {
            this.imprimirMensaje(
              'error',
              'Error al guardar',
              `${this.formNombre} Error al guardar cliente`
              );

            this.cargarDatos();
          }
        }
      );

    } else {

      this.clienteService.actualizarCliente(creandoCliente).subscribe(
        {
          next : (data) => {
            this.imprimirMensaje(
              'success',
              'Cliente actualizado',
              `${this.formNombre} se guardó correctamente.`
              );

            this.cargarDatos();
          },
          error : (error) => {
            this.imprimirMensaje(
              'error',
              'Error al guardar',
              `${this.formNombre} Error al guardar cliente`
              );

            this.cargarDatos();
          }
        }
      );

    }

    this.seGuardaElCliente = undefined;
    this.cerrarDialog();

  }

  imprimirMensaje (severety : string, summary : string, detail: string) {
      this.messageService.add({
      severity: severety,
      summary: summary,
      detail: detail,
    });
  }

}
