import { Component, Input, OnInit, OnChanges, SimpleChanges, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgClass, NgIf } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { forkJoin } from 'rxjs';
import { PizarraService, AcumuladoPorAnio } from '../../../core/services/PizarraService';

@Component({
  selector: 'app-contenedores-comparativa-anual',
  standalone: true,
  imports: [ChartModule, NgClass, NgIf],
  templateUrl: './contenedores-comparativa-anual.html',
  styleUrl: './contenedores-comparativa-anual.css',
})
export class ContenedoresComparativaAnual implements OnInit, OnChanges {

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

  /** Dos colores: el primero para SENCILLO, el segundo para FULL. */
  @Input() coloresPorDefecto: string[] = ['--p-sky-500', '--p-red-500'];

  private pizarraService = inject(PizarraService);
  platformId = inject(PLATFORM_ID);

  data: any;
  options: any;

  // Arranca en true: la petición sale en ngOnInit, así que la tarjeta nunca
  // debe verse vacía antes de la primera respuesta.
  cargando = true;

  private sencilloPorMes: number[] = [];
  private fullPorMes: number[] = [];

  /**
   * Sin carga en curso y sin un solo contenedor en el año.
   * Se revisa la suma y no la longitud porque el backend siempre devuelve los
   * 12 meses: un año sin movimiento llega como doce ceros, no como arreglo vacío.
   */
  get sinDatos(): boolean {
    if (this.cargando) {
      return false;
    }

    const total = [...this.sencilloPorMes, ...this.fullPorMes]
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

    // Las dos peticiones van en paralelo: son independientes y la gráfica
    // necesita ambas para pintarse completa.
    forkJoin({
      sencillo: this.pizarraService.obtenerContenedoresSencillo(this.anio, this.prefijos),
      full: this.pizarraService.obtenerContenedoresFull(this.anio, this.prefijos)
    }).subscribe({
      next: ({ sencillo, full }) => {
        this.sencilloPorMes = this.extraerMeses(sencillo);
        this.fullPorMes = this.extraerMeses(full);

        this.cargando = false;
        this.construirGrafico();
      },
      error: (err) => {
        console.error('Error al cargar los contenedores', err);
        this.cargando = false;
      }
    });
  }

  /**
   * El backend devuelve { anio: [12 valores] }. Como aquí sólo se pide un año,
   * se toma la primera (y única) entrada.
   */
  private extraerMeses(respuesta: AcumuladoPorAnio): number[] {
    const anios = Object.keys(respuesta ?? {});

    return anios.length > 0 ? respuesta[Number(anios[0])] ?? [] : [];
  }

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

    const colorSencillo = this.resolverColor(this.coloresPorDefecto[0], documentStyle);
    const colorFull = this.resolverColor(this.coloresPorDefecto[1], documentStyle);

    this.data = {
      labels: [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
      ],
      datasets: [
        {
          label: 'Sencillo',
          backgroundColor: colorSencillo,
          borderColor: colorSencillo,
          data: this.sencilloPorMes
        },
        {
          label: 'Full',
          backgroundColor: colorFull,
          borderColor: colorFull,
          data: this.fullPorMes
        }
      ]
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
