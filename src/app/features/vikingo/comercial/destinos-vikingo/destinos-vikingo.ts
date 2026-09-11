import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TarifarioService } from '../../../../core/services/TarifarioService';
import { Destino, DestinoNuevo, Estado } from '../../../../core/models/Tarifario';

@Component({
  selector: 'app-destinos-vikingo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    DialogModule,
    InputText,
    SelectModule,
    TableModule,
    ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './destinos-vikingo.html',
  styleUrl: './destinos-vikingo.css',
})
export class DestinosVikingo implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private tarifarioService = inject(TarifarioService);

  public tituloFormulario: string = '';
  public mostrarModal: boolean = false;

  public destinos: Destino[] = [];
  public estados: Estado[] = [];

  public cargando = false;
  public guardando = false;

  /** Id del estado elegido en el selector. */
  public formIdEstado: number | undefined;
  public formDestino = '';

  ngOnInit(): void {
    this.cargarEstados();
    this.cargarDestinos();
  }

  cargarDestinos(): void {
    this.cargando = true;

    this.tarifarioService.obtenerDestinos().subscribe({
      next: (destinos) => {
        this.destinos = destinos;
        this.cargando = false;
      },
      error: (err) => {
        console.error('Error al cargar los destinos', err);
        this.cargando = false;
      }
    });
  }

  /** El catálogo se carga una sola vez: alimenta el selector del modal. */
  private cargarEstados(): void {
    this.tarifarioService.obtenerEstados().subscribe({
      next: (estados) => {
        this.estados = estados;
      },
      error: (err) => {
        console.error('Error al cargar los estados', err);
      }
    });
  }

  public AgregarDestino(): void {
    this.formIdEstado = undefined;
    this.formDestino = '';
    this.abrirModal('Agregar destino');
  }

  abrirModal(titulo: string) {
    this.tituloFormulario = titulo;
    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  cerrarModal() {
    this.mostrarModal = false;
    this.guardando = false;
    this.cdr.detectChanges();
  }

  guardar(): void {
    const nombre = this.formDestino.trim();

    if (this.formIdEstado == null) {
      this.avisar('warn', 'Atención', 'Selecciona el estado al que pertenece el destino.');
      return;
    }

    if (!nombre) {
      this.avisar('warn', 'Atención', 'El nombre del destino es obligatorio.');
      return;
    }

    this.guardando = true;

    // idCiudad va en null: la llave la calcula el backend, porque la columna
    // tiene PRIMARY KEY pero no es IDENTITY.
    const destino: DestinoNuevo = {
      idCiudad: null,
      idEstado: this.formIdEstado,
      destinoEstadoCiudad1: nombre
    };

    this.tarifarioService.crearDestino(destino).subscribe({
      next: () => {
        this.avisar('success', 'Destino creado', `${nombre} se guardó correctamente.`);
        this.cerrarModal();
        this.cargarDestinos();
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error al guardar el destino', err);

        // 409: el backend rechaza nombres repetidos.
        const detalle = err?.status === 409
          ? `Ya existe un destino llamado ${nombre}.`
          : 'No se pudo guardar el destino.';

        this.avisar('error', 'Error al guardar', detalle);
      }
    });
  }

  private avisar(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
  }

}
