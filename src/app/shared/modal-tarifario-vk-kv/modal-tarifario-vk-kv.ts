import { ChangeDetectorRef, Component, Input, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Dialog } from 'primeng/dialog';
import { Select } from 'primeng/select';
import { InputNumber } from 'primeng/inputnumber';
import { Button } from 'primeng/button';
import { Toast } from 'primeng/toast';
import { Message } from 'primeng/message';
import { ProgressSpinner } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { TarifarioService } from '../../core/services/TarifarioService';
import { Destino, Estado, Origen, RutaTarifario } from '../../core/models/Tarifario';

export interface BloqueMercancia {
  RT : number ,
  KMxL : number ,
  TotalLTS : number  ,
  TotalDiesel: number,
  Casetas: number ,
  KMOperador: number,
  CostoFijoOperador: number,
  RecargaDieselRF: number,
  TotalDeCostosDirectos: number,
  TarifaDeseadaCliente: number,
  UtilidadDeseada: number,
  UtilidadPesos: number,
  UtilidadPorcentajes: number,
  TarifaPropuesta: number
};

/**
 * Modal de captura de tarifario compartido entre Vikingo (VK) y KV. Lo único
 * que cambia entre las dos empresas es a quién pertenece la ruta, por eso el
 * componente padre inyecta la empresa con `idEmpresa` y aquí sólo se captura.
 */
@Component({
  selector: 'app-modal-tarifario-vk-kv',
  imports: [
    CommonModule,
    FormsModule,
    Dialog,
    Select,
    InputNumber,
    Button,
    Toast,
    Message,
    ProgressSpinner,
  ],
  providers: [MessageService],
  templateUrl: './modal-tarifario-vk-kv.html',
  styleUrl: './modal-tarifario-vk-kv.css',
})
export class ModalTarifarioVkKv implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private tarifarioService = inject(TarifarioService);

  /**
   * Empresa dueña del tarifario. La fija el padre (VK o KV) y con ella se
   * decide a qué empresa pertenece la ruta que se dé de alta.
   */
  @Input() idEmpresa!: number;

  public mostrarModal = false;

  // ─── Catálogos ───────────────────────────────────────────────────
  public origenes: Origen[] = [];
  public estados: Estado[] = [];
  private todosLosDestinos: Destino[] = [];

  /** Los destinos del estado elegido; alimenta el selector de ciudad. */
  public destinosFiltrados: Destino[] = [];

  // ─── Encabezado del registro ─────────────────────────────────────
  public formIdOrigen: number | undefined;
  public formIdEstado: number | undefined;
  public formIdCiudad: number | undefined;

  // Los dos datos que viven en la ruta, uno por combinación.
  public formPrecioLitroDiesel = 0;
  public formOw = 0;

  // ─── Consulta de la ruta ─────────────────────────────────────────

  /** La ruta que devolvió el backend, o null si todavía no está dada de alta. */
  public rutaExistente: RutaTarifario | null = null;

  public buscandoRuta = false;

  private consultaEnCurso = '';

  public MERCANCIAS = [
    { codigo: 1, nombre: 'GRAL',
      bloqueMercanciaSencillo: {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    },
    bloqueMercanciaFull: {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    }
  },
    { codigo: 2, nombre: 'DGR', bloqueMercanciaSencillo: {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    },
    bloqueMercanciaFull: {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    }
  },
    { codigo: 3, nombre: 'REEFER', bloqueMercanciaSencillo: {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    },
    bloqueMercanciaFull : {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    }

  },
  { codigo: 4, nombre: 'DGR&REEFER', bloqueMercanciaSencillo: {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    },
    bloqueMercanciaFull : {
        RT : 0 ,
        KMxL : 0 ,
        TotalLTS : 0  ,
        TotalDiesel: 0,
        Casetas: 0 ,
        KMOperador: 0,
        CostoFijoOperador: 0,
        RecargaDieselRF: 0,
        TotalDeCostosDirectos: 0,
        TarifaDeseadaCliente: 0,
        UtilidadDeseada: 0,
        UtilidadPesos: 0,
        UtilidadPorcentajes: 0,
        TarifaPropuesta: 0
    }
  },
  ];

  ngOnInit(): void {
    this.cargarCatalogos();
  }

  private cargarCatalogos(): void {
    this.tarifarioService.obtenerOrigenes().subscribe({
      next: (origenes) => (this.origenes = origenes),
      error: (err) => console.error('Error al cargar los orígenes', err)
    });

    this.tarifarioService.obtenerEstados().subscribe({
      next: (estados) => (this.estados = estados),
      error: (err) => console.error('Error al cargar los estados', err)
    });

    // Se traen todos y se filtran en memoria: el catálogo es chico y así
    // cambiar de estado no dispara una petición por cada selección.
    this.tarifarioService.obtenerDestinos().subscribe({
      next: (destinos) => (this.todosLosDestinos = destinos),
      error: (err) => console.error('Error al cargar los destinos', err)
    });

  }



  public abrirModal(): void {
    this.formIdOrigen = undefined;
    this.formIdEstado = undefined;
    this.formIdCiudad = undefined;
    this.formPrecioLitroDiesel = 0;
    this.formOw = 0;
    this.destinosFiltrados = [];

    this.rutaExistente = null;
    this.buscandoRuta = false;
    this.consultaEnCurso = '';

    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  public cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  public alCambiarEstado(): void {
    // Cambiar de estado invalida el destino elegido, y con él la consulta.
    this.formIdCiudad = undefined;

    this.destinosFiltrados = this.todosLosDestinos
      .filter(destino => destino.idEstado === this.formIdEstado);

    this.verificarRuta();
  }

  /**
   * Consulta si la combinación origen + estado + destino ya está en el
   * tarifario. Se dispara con cada cambio de los tres selectores y no hace
   * nada mientras falte alguno.
   *
   * De momento sólo resuelve el encabezado (precarga diésel y OW). El manejo
   * de los bloques por mercancía se agrega en el siguiente paso.
   */
  public verificarRuta(): void {
    this.rutaExistente = null;

    if (this.formIdOrigen == null || this.formIdEstado == null || this.formIdCiudad == null) {
      this.consultaEnCurso = '';
      this.buscandoRuta = false;
      return;
    }

    const clave = `${this.formIdOrigen}-${this.formIdEstado}-${this.formIdCiudad}`;

    this.consultaEnCurso = clave;
    this.buscandoRuta = true;

    this.tarifarioService
      .buscarRutaPorEmpresa(this.formIdOrigen, this.formIdEstado, this.formIdCiudad, this.idEmpresa)
      .subscribe({
        next: (respuesta) => {
          // Llegó tarde: el usuario ya cambió la selección.
          if (this.consultaEnCurso !== clave) {
            return;
          }

          this.buscandoRuta = false;

          if (respuesta.existe && respuesta.ruta != null) {
            this.rutaExistente = respuesta.ruta;

            // La ruta ya tiene diésel y OW capturados: se precargan para no
            // volver a escribirlos.
            this.formPrecioLitroDiesel = respuesta.ruta.ltDieselPrecio;
            this.formOw = respuesta.ruta.ow;
          }

          this.cdr.detectChanges();
        },
        error: (err) => {
          if (this.consultaEnCurso !== clave) {
            return;
          }

          this.buscandoRuta = false;
          console.error('Error al consultar la ruta', err);

          // 422: el backend rechaza un destino que no pertenece al estado.
          const detalle = err?.status === 422
            ? 'La combinación de estado y destino no es válida.'
            : 'No se pudo consultar si la ruta ya existe.';

          this.messageService.add({
            severity: 'error',
            summary: 'Error al consultar',
            detail: detalle
          });

          this.cdr.detectChanges();
        }
      });
  }

public guardarDatos(): void {
  if (this.formIdOrigen == null || this.formIdEstado == null || this.formIdCiudad == null) {
    this.messageService.add({
      severity: 'warn',
      summary: 'Atención',
      detail: 'Selecciona el origen, el estado y el destino.'
    });
    return;
  }

  const eraExistente = this.rutaExistente != null;

  this.tarifarioService.guardarRutaPorEmpresa({
    idOrigen: this.formIdOrigen,
    idEstado: this.formIdEstado,
    idCiudad: this.formIdCiudad,
    idEmpresa: this.idEmpresa,           // el @Input del modal
    ltDieselPrecio: this.formPrecioLitroDiesel,
    ow: this.formOw,
    renglones: []                        // por ahora sólo el encabezado
  }).subscribe({
    next: (ruta) => {
      // Queda marcada como existente: un segundo guardado ya actualiza.
      this.rutaExistente = ruta;

      this.messageService.add({
        severity: 'success',
        summary: eraExistente ? 'Ruta actualizada' : 'Ruta registrada',
        detail: `${ruta.origen} → ${ruta.destino} se guardó correctamente.`
      });

      this.cdr.detectChanges();
    },
    error: (err) => {
      console.error('Error al guardar la ruta', err);

      const detalle = err?.status === 422
        ? err?.error?.mensaje ?? 'Los datos de la ruta no son válidos.'
        : 'No se pudo guardar la ruta.';

      this.messageService.add({
        severity: 'error',
        summary: 'Error al guardar',
        detail: detalle
      });

      this.cdr.detectChanges();
    }
  });
}

}
