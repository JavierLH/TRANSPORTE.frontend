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
import { Cliente, ClienteMaestro } from '../../../core/models/CatalogosViajeDtos';

@Component({
  selector: 'app-clientes-drakkar',
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
  templateUrl: './clientes-drakkar.html',
  styleUrl: './clientes-drakkar.css',
})
export class ClientesDrakkar implements OnInit {
  private readonly idEmpresa = 3;
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

  // ─── Anexar desde el catálogo maestro ────────────────────────────

  mostrarDialogAnexar = false;
  maestrosDisponibles: ClienteMaestro[] = [];
  cargandoMaestros = false;

  /** Renglón que se está anexando, para mostrar su botón cargando. */
  anexandoId: number | null = null;

  abrirAnexar(): void {
    this.maestrosDisponibles = [];
    this.mostrarDialogAnexar = true;
    this.cargandoMaestros = true;

    // Se consulta cada vez que se abre: si otro usuario anexó un cliente
    // mientras tanto, ya no debe aparecer en la lista.
    this.clienteService.obtenerMaestrosDisponibles(this.idEmpresa).subscribe({
      next: (maestros) => {
        this.maestrosDisponibles = maestros;
        this.cargandoMaestros = false;
      },
      error: (error) => {
        console.error('Error al cargar el catálogo maestro', error);
        this.cargandoMaestros = false;
        this.imprimirMensaje('error', 'Error', 'No se pudo cargar el catálogo maestro.');
      }
    });
  }

  cerrarAnexar(): void {
    this.mostrarDialogAnexar = false;
  }

  anexarCliente(maestro: ClienteMaestro): void {
    this.anexandoId = maestro.idClienteMaestro;

    this.clienteService.anexarCliente(maestro.idClienteMaestro, this.idEmpresa).subscribe({
      next: (cliente) => {
        this.anexandoId = null;

        // Sale de la tabla en cuanto se anexa, igual que los que ya estaban:
        // así no se puede anexar dos veces y el modal sigue abierto por si se
        // quieren anexar varios seguidos.
        this.maestrosDisponibles = this.maestrosDisponibles
          .filter(m => m.idClienteMaestro !== maestro.idClienteMaestro);

        this.imprimirMensaje('success', 'Cliente anexado', `${cliente.nombreCliente} se anexó a la empresa.`);
        this.cargarDatos();
      },
      error: (error) => {
        this.anexandoId = null;
        // 409: otro usuario lo anexó mientras tanto.
        this.imprimirMensaje('error', 'No se pudo anexar', error?.error?.mensaje ?? 'Error al anexar el cliente.');
      }
    });
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

    console.log(creandoCliente);

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
            console.log(error);

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
