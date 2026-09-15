import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Button } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TarifarioService } from '../../../../core/services/TarifarioService';
import { Destino, Estado, Origen } from '../../../../core/models/Tarifario';
import { InputText } from 'primeng/inputtext';

/** Las cuatro mercancías que se cotizan. */
const MERCANCIAS = ['GENERAL', 'DGR', 'REEFER', 'DGR & REEFER'];

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
    InputText
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

  /** Lo único que se comparte entre las cuatro mercancías. */
  public formPrecioLitroDiesel = 0;

  /** Un bloque por mercancía; se arma en blanco al abrir el modal. */
  public bloques: BloqueMercancia[] = [];

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
    this.formIdCiudad = undefined;

    this.destinosFiltrados = this.todosLosDestinos
      .filter(destino => destino.idEstado === this.formIdEstado);
  }

  // ─── Modal ───────────────────────────────────────────────────────

  public abrirModal(): void {
    this.formIdOrigen = undefined;
    this.formIdEstado = undefined;
    this.formIdCiudad = undefined;
    this.formPrecioLitroDiesel = 0;
    this.destinosFiltrados = [];

    this.bloques = MERCANCIAS.map(mercancia => this.bloqueEnBlanco(mercancia));

    this.mostrarModal = true;
    this.cdr.detectChanges();
  }

  public cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  private bloqueEnBlanco(mercancia: string): BloqueMercancia {
    return {
      mercancia,
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

  public guardar(): void {
    // Mockup: todavía no hay endpoint donde persistir el tarifario.
    this.messageService.add({
      severity: 'info',
      summary: 'Pendiente',
      detail: 'Falta el endpoint para guardar el tarifario.'
    });
  }

}
