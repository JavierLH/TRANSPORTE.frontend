import { Component, Input, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { PizarraService, AcumuladoPorMercancia } from '../../../core/services/PizarraService';

@Component({
  selector: 'app-mercancias-comparativa-anual',
  standalone: true,
  imports: [ChartModule, NgClass, NgIf],
  templateUrl: './mercancias-comparativa-anual.html',
  styleUrl: './mercancias-comparativa-anual.css',
})
export class MercanciasComparativaAnual implements OnInit, OnChanges {

  @Input() empresa = '';
  @Input() temaEmpresa: 'karve' | 'vikingo' | 'drakkar' | 'letca' = 'vikingo';
  @Input() mostrarEncabezado: boolean = true;

  /**
   * Alto del área de la gráfica. Cualquier unidad CSS válida: '14rem', '250px',
   * '30vh'. Se aplica como estilo en línea, así que gana sobre el CSS.
   */
  @Input() alturaGrafica = '17rem';

  /** Sin año se usa el actual, que es el caso de uso por ahora. */
  @Input() anio: number | undefined;

  /** Prefijos del número de viaje que acotan la empresa. Vikingo: 31 a 34. */
  @Input() prefijos: string[] = [];

  /** Un color por mercancía, en el mismo orden en que las devuelve el backend. */
  @Input() coloresPorDefecto: string[] = [
    '--p-red-500',
    '--p-orange-400',
    '--p-rose-600',
    '--p-amber-300',
    '--p-red-800',
  ];

  private pizarraService = inject(PizarraService);
  platformId = inject(PLATFORM_ID);

  data: any;
  options: any;

  // Arranca en true: la petición sale en ngOnInit, así que la tarjeta nunca
  // debe verse vacía antes de la primera respuesta.
  cargando = true;

  private mercancias: AcumuladoPorMercancia = {};

  /**
   * Sin carga en curso y sin un solo viaje en el año.
   * Se revisa la suma y no la longitud porque el backend siempre devuelve las
   * cinco mercancías con sus 12 meses: un año sin movimiento llega como puros
   * ceros, no como objeto vacío.
   */
  get sinDatos(): boolean {
    if (this.cargando) {
      return false;
    }

    const total = Object.values(this.mercancias)
      .flat()
      .reduce((suma, valor) => suma + (valor ?? 0), 0);

    return total === 0;
  }

  ngOnInit(): void {
    this.cargarDatos();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // El año y los prefijos cambian QUÉ se pide, así que obligan a recargar.
    // Los colores sólo repintan lo que ya está en memoria.
    const cambioAnio = changes['anio'] && !changes['anio'].firstChange;

    // Los prefijos se comparan por contenido, no por referencia: un arreglo
    // literal en la plantilla se recrea en cada ciclo de detección de cambios,
    // y compararlo por referencia dispararía una petición HTTP en cada uno.
    const cambioPrefijos =
      changes['prefijos'] &&
      !changes['prefijos'].firstChange &&
      (changes['prefijos'].previousValue ?? []).join(',') !== (changes['prefijos'].currentValue ?? []).join(',');

    if (cambioAnio || cambioPrefijos) {
      this.cargarDatos();
      return;
    }

    if (changes['coloresPorDefecto'] && !changes['coloresPorDefecto'].firstChange) {
      this.construirGrafico();
    }
  }

  cargarDatos(): void {
    this.cargando = true;

    // Una sola petición trae las cinco mercancías.
    this.pizarraService.obtenerMercancias(this.anio, this.prefijos).subscribe({
      next: (mercancias) => {
        this.mercancias = mercancias ?? {};

        this.cargando = false;
        this.construirGrafico();
      },
      error: (err) => {
        console.error('Error al cargar las mercancías', err);
        this.cargando = false;
      }
    });
  }

  /**
   * "PELIGROSOREFRIGERADO" en la leyenda no se lee. Lo que no esté aquí se
   * muestra tal cual, así que una mercancía nueva no rompe nada.
   */
  private etiquetasDeMercancias: Record<string, string> = {
    GENERAL: 'General',
    PELIGROSOREFRIGERADO: 'Peligroso refrigerado',
    REFRIGERADO: 'Refrigerado',
    PELIGROSO: 'Peligroso',
    COMPLEMENTO: 'Complemento',
  };

  /**
   * Acepta tanto una variable CSS ('--p-red-500') como un color literal
   * ('#e01219'). Si la variable no existe en el tema, getPropertyValue devuelve
   * cadena vacía y Chart.js caería a su color por defecto sin avisar, así que
   * en ese caso se regresa el valor tal cual.
   */
  private resolverColor(valor: string, documentStyle: CSSStyleDeclaration): string {
    if (!valor) {
      return '';
    }

    if (!valor.startsWith('--')) {
      return valor;
    }

    const resuelto = documentStyle.getPropertyValue(valor).trim();

    return resuelto !== '' ? resuelto : valor;
  }

  construirGrafico(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    // El orden lo marca el backend, que siempre devuelve las cinco llaves.
    const datasets = Object.keys(this.mercancias).map((mercancia, indice) => {
      const color = this.resolverColor(
        this.coloresPorDefecto[indice % this.coloresPorDefecto.length],
        documentStyle
      );

      return {
        label: this.etiquetasDeMercancias[mercancia] ?? mercancia,
        backgroundColor: color,
        borderColor: color,
        data: this.mercancias[mercancia]
      };
    });

    this.data = {
      labels: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      datasets
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.5,
      plugins: {
        legend: { labels: { color: textColor } }
      },
      scales: {
        x: {
          ticks: { color: textColorSecondary, font: { weight: 500 } },
          grid: { color: surfaceBorder, drawBorder: false }
        },
        y: {
          ticks: { color: textColorSecondary },
          grid: { color: surfaceBorder, drawBorder: true }
        }
      }
    };
  }
}
