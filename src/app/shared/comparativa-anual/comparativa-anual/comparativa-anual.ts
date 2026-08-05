import { Component, Input, OnChanges, SimpleChanges, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser, NgClass } from '@angular/common';
import { ChartModule } from 'primeng/chart';

const COLORES_POR_DEFECTO = [
  '--p-cyan-500',
  '--p-orange-500',
  '--p-green-500',
  '--p-purple-500',
  '--p-red-500',
  '--p-blue-500',
  '--p-yellow-500',
];

@Component({
  selector: 'app-comparativa-anual',
  standalone: true,
  imports: [ChartModule, NgClass],
  templateUrl: './comparativa-anual.html',
  styleUrl: './comparativa-anual.css',
})
export class ComparativaAnual implements OnChanges {

  @Input() empresa = '';
  @Input() anioInicial : any;
  @Input() anioFinal : any;
  @Input() colores: string[] = COLORES_POR_DEFECTO;
  @Input() datosPorAnio: { [anio: number]: number[] } = {};
  @Input() nombre_empresa : any;

  @Input() temaEmpresa: 'karve' | 'vikingo' | 'drakkar' | 'letca' = 'vikingo';

  platformId = inject(PLATFORM_ID);

  data: any;
  options: any;

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['datosPorAnio']) {
      this.construirGrafico();
    }

    if(this.nombre_empresa === 'Vikingo'){

      

    }else if(this.nombre_empresa === 'Drakkar'){



    }else if(this.nombre_empresa === 'Karve'){



    }else if(this.nombre_empresa === 'Letca'){



    }

  }

  construirGrafico(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--p-text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--p-text-muted-color');
    const surfaceBorder = documentStyle.getPropertyValue('--p-content-border-color');

    const anios = Object.keys(this.datosPorAnio).map(Number);

    const datasets = anios.map((anio, index) => {
      const color = documentStyle.getPropertyValue(this.colores[index % this.colores.length]);
      return {
        label: `Métricas ${anio}`,
        backgroundColor: color,
        borderColor: color,
        data: this.datosPorAnio[anio]
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
