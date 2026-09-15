import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { TarifarioService } from '../../../../core/services/TarifarioService';
import { Destino, Estado, Origen, RenglonTarifario, RutaTarifario } from '../../../../core/models/Tarifario';

/**
 * Las cuatro mercancías que se cotizan, con el código del catálogo Mercancias
 * de la base. Son fijas: la tabla se siembra con estos mismos códigos.
 */
const MERCANCIAS = [
  { codigo: 1, nombre: 'GRAL' },
  { codigo: 2, nombre: 'DGR' },
  { codigo: 3, nombre: 'REEFER' },
  { codigo: 4, nombre: 'DGR&REEFER' },
];

/** Códigos del catálogo Configuracion. */
const CONFIGURACION_SENCILLO = 1;
const CONFIGURACION_FULL = 2;

/**
 * Todo lo que se captura para una configuración. El único dato que no está
 * aquí es el precio del litro de diesel, que se captura una sola vez en el
 * encabezado y aplica a las cuatro mercancías.
 */
export interface CostosConfiguracion {
  recorridoTotal: number;
  kmPorLitro: number;
  casetas: number;
  kilometrosOperador: number;
  costoFijoOperador: number;
  recargaDieselRf: number;
  tarifaDeseada: number;
  utilidadDeseada: number;
}

/** Un bloque por mercancía: sus dos configuraciones. */
export interface BloqueMercancia {
  codigoMercancia: number;
  mercancia: string;
  sencillo: CostosConfiguracion;
  full: CostosConfiguracion;
}

@Component({
  selector: 'app-tarifario-vikingo',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    Button,
    DialogModule,
    InputNumberModule,
    SelectModule,
    ToastModule,
    MessageModule,
    ProgressSpinnerModule,
],
  providers: [MessageService],
  templateUrl: './tarifario-vikingo.html',
  styleUrl: './tarifario-vikingo.css',
})
export class TarifarioVikingo implements OnInit {

  private cdr = inject(ChangeDetectorRef);
  private messageService = inject(MessageService);
  private tarifarioService = inject(TarifarioService);

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

  // Los dos datos que viven en OrigenesDestinosTarifario, uno por ruta.
  public formPrecioLitroDiesel = 0;
  public formOw = 0;

  /** Un bloque por mercancía; se arma en blanco al abrir el modal. */
  public bloques: BloqueMercancia[] = [];

  /**
   * Marca si lo que hay en los bloques se cargó de una ruta guardada o lo
   * escribió el usuario. Sirve para decidir si se puede limpiar al cambiar de
   * destino: datos de otra ruta se descartan, capturas a mano no.
   */
  private bloquesVienenDeUnaRuta = false;

  // ─── Consulta de la ruta ─────────────────────────────────────────

  /** La ruta que devolvió el backend, o null si todavía no está dada de alta. */
  public rutaExistente: RutaTarifario | null = null;

  public buscandoRuta = false;
  public guardando = false;

  /**
   * Identifica la consulta en vuelo. Si el usuario cambia de destino antes de
   * que llegue la respuesta anterior, esa respuesta ya no aplica y se descarta:
   * sin esto una petición lenta puede pisar los datos de la selección nueva.
   */
  private consultaEnCurso = '';

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
      .buscarRuta(this.formIdOrigen, this.formIdEstado, this.formIdCiudad)
      .subscribe({
        next: (respuesta) => {
          // Llegó tarde: el usuario ya cambió la selección.
          if (this.consultaEnCurso !== clave) {
            return;
          }

          this.buscandoRuta = false;

          if (respuesta.existe && respuesta.ruta != null) {
            this.rutaExistente = respuesta.ruta;

            // La ruta ya tiene diesel y OW capturados: se precargan para no
            // volver a escribirlos.
            this.formPrecioLitroDiesel = respuesta.ruta.ltDieselPrecio;
            this.formOw = respuesta.ruta.ow;

            this.aplicarRenglones(respuesta.ruta.renglones);
          } else if (this.bloquesVienenDeUnaRuta) {
            // Lo que está en pantalla es de otra ruta: se limpia para no
            // guardarlo sobre ésta. Si el usuario lo capturó a mano, se
            // respeta.
            this.limpiarBloques();
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

  // ─── Modal ───────────────────────────────────────────────────────

  public abrirModal(): void {
    this.formIdOrigen = undefined;
    this.formIdEstado = undefined;
    this.formIdCiudad = undefined;
    this.formPrecioLitroDiesel = 0;
    this.formOw = 0;
    this.destinosFiltrados = [];

    this.rutaExistente = null;
    this.buscandoRuta = false;
    this.guardando = false;
    this.consultaEnCurso = '';

    this.limpiarBloques();

    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  public cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  /**
   * Vuelca en los bloques lo que ya estaba guardado para la ruta.
   *
   * Se parte de bloques limpios: si la ruta guardada no tiene renglón para
   * alguna mercancía, ese bloque debe quedar vacío y no con lo que hubiera
   * quedado de la consulta anterior.
   */
  private aplicarRenglones(renglones: RenglonTarifario[]): void {
    this.limpiarBloques();

    renglones.forEach((renglon) => {
      const bloque = this.bloques
        .find(b => b.codigoMercancia === renglon.idMercancia);

      // Una mercancía que ya no está en el catálogo del modal se ignora.
      if (bloque == null) {
        return;
      }

      const costos = renglon.codigoConfiguracion === CONFIGURACION_FULL
        ? bloque.full
        : bloque.sencillo;

      costos.kmPorLitro = renglon.kmxlRendimiento;
      costos.costoFijoOperador = renglon.costoFijoOperador;
      costos.recargaDieselRf = renglon.recargaDieselRf;
      costos.tarifaDeseada = renglon.tarifaDeseadaCliente;
      costos.utilidadDeseada = renglon.utilidadDeseada;
      costos.casetas = renglon.casetas;
      costos.kilometrosOperador = renglon.kmOperador;
    });

    this.bloquesVienenDeUnaRuta = true;
  }

  private limpiarBloques(): void {
    this.bloques = MERCANCIAS.map(mercancia => this.bloqueEnBlanco(mercancia));
    this.bloquesVienenDeUnaRuta = false;
  }

  private bloqueEnBlanco(mercancia: { codigo: number; nombre: string }): BloqueMercancia {
    return {
      codigoMercancia: mercancia.codigo,
      mercancia: mercancia.nombre,
      sencillo: this.costosEnBlanco(),
      full: this.costosEnBlanco()
    };
  }

  private costosEnBlanco(): CostosConfiguracion {
    return {
      recorridoTotal: 0,
      kmPorLitro: 0,
      casetas: 0,
      kilometrosOperador: 0,
      costoFijoOperador: 0,
      recargaDieselRf: 0,
      tarifaDeseada: 0,
      utilidadDeseada: 0
    };
  }

  // ─── Cálculos ────────────────────────────────────────────────────
  //
  // Los campos calculados se muestran como recuadro: se derivan de lo que
  // captura el usuario y no se editan a mano.

  /** Total de litros = recorrido total ÷ rendimiento. */
  public totalLitros(costos: CostosConfiguracion): number {
    if (!costos.kmPorLitro) {
      return 0;
    }

    return costos.recorridoTotal / costos.kmPorLitro;
  }

  /** Total diesel = litros × el precio por litro del encabezado. */
  public totalDiesel(costos: CostosConfiguracion): number {
    return this.totalLitros(costos) * this.formPrecioLitroDiesel;
  }

  /**
   * Diesel + casetas + costo fijo + recarga.
   *
   * Los kilómetros del operador quedan fuera a propósito: son una distancia,
   * no pesos, así que sumarlos aquí daría un total equivocado. Falta definir
   * con qué tarifa por kilómetro se convierten a costo.
   */
  public totalCostosDirectos(costos: CostosConfiguracion): number {
    return this.totalDiesel(costos)
      + costos.casetas
      + costos.costoFijoOperador
      + costos.recargaDieselRf;
  }

  /** Utilidad en pesos = tarifa deseada − costos directos. */
  public utilidadPesos(costos: CostosConfiguracion): number {
    return costos.tarifaDeseada - this.totalCostosDirectos(costos);
  }

  /** Utilidad porcentual sobre la tarifa deseada. */
  public utilidadPorcentaje(costos: CostosConfiguracion): number {
    if (!costos.tarifaDeseada) {
      return 0;
    }

    return (this.utilidadPesos(costos) / costos.tarifaDeseada) * 100;
  }

  /**
   * Tarifa propuesta: el precio que deja exactamente la utilidad deseada.
   * Con 100% o más el divisor sería cero o negativo, así que se corta.
   */
  public tarifaPropuesta(costos: CostosConfiguracion): number {
    if (costos.utilidadDeseada >= 100) {
      return 0;
    }

    return this.totalCostosDirectos(costos) / (1 - costos.utilidadDeseada / 100);
  }

  /**
   * Arma los ocho renglones —cuatro mercancías por dos configuraciones— que
   * acompañan a la ruta.
   */
  private armarRenglones(): RenglonTarifario[] {
    const renglones: RenglonTarifario[] = [];

    this.bloques.forEach((bloque) => {
      renglones.push(this.aRenglon(bloque, bloque.sencillo, CONFIGURACION_SENCILLO));
      renglones.push(this.aRenglon(bloque, bloque.full, CONFIGURACION_FULL));
    });

    return renglones;
  }

  private aRenglon(
    bloque: BloqueMercancia,
    costos: CostosConfiguracion,
    codigoConfiguracion: number
  ): RenglonTarifario {
    return {
      idMercancia: bloque.codigoMercancia,
      codigoConfiguracion,
      kmxlRendimiento: costos.kmPorLitro,
      costoFijoOperador: costos.costoFijoOperador,
      recargaDieselRf: costos.recargaDieselRf,
      tarifaDeseadaCliente: costos.tarifaDeseada,
      utilidadDeseada: costos.utilidadDeseada,
      casetas: costos.casetas,
      kmOperador: costos.kilometrosOperador,

      // La tabla lo tiene, pero el modal todavía no lo captura.
      operadorMonto: 0
    };
  }

  /**
   * Guarda la ruta y sus ocho renglones. El backend decide si la ruta se da
   * de alta o se actualiza, y hace lo mismo renglón por renglón.
   */
  public guardar(): void {
    if (this.formIdOrigen == null || this.formIdEstado == null || this.formIdCiudad == null) {
      this.messageService.add({
        severity: 'warn',
        summary: 'Atención',
        detail: 'Selecciona el origen, el estado y el destino.'
      });
      return;
    }

    const eraExistente = this.rutaExistente != null;

    this.guardando = true;

    this.tarifarioService.guardarRuta({
      idOrigen: this.formIdOrigen,
      idEstado: this.formIdEstado,
      idCiudad: this.formIdCiudad,
      ltDieselPrecio: this.formPrecioLitroDiesel,
      ow: this.formOw,
      renglones: this.armarRenglones()
    }).subscribe({
      next: (ruta) => {
        this.guardando = false;

        // Queda marcada como existente: un segundo guardado ya actualiza.
        this.rutaExistente = ruta;

        // Lo capturado ya pertenece a esta ruta: si se cambia de destino, se
        // puede limpiar sin perder trabajo del usuario.
        this.bloquesVienenDeUnaRuta = true;

        this.messageService.add({
          severity: 'success',
          summary: eraExistente ? 'Ruta actualizada' : 'Ruta registrada',
          detail: `${ruta.origen} → ${ruta.destino} se guardó correctamente.`
        });

        this.cdr.detectChanges();
      },
      error: (err) => {
        this.guardando = false;
        console.error('Error al guardar la ruta', err);

        // 422: el backend valida la combinación y los valores negativos.
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
