import { Component, OnInit, inject } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { PizarraService } from '../../../../../core/services/PizarraService';
import { ComparativaAnual } from '../../../../../shared/comparativa-anual/comparativa-anual/comparativa-anual';

@Component({
  selector: 'app-acumulado-grafico-barra',
  imports: [ChartModule, ComparativaAnual],
  templateUrl: './acumulado-grafico-barra.html',
  styleUrl: './acumulado-grafico-barra.css',
})
export class AcumuladoGraficoBarra implements OnInit {

  Empresa : string = 'Vikingo'

  private pizarraService = inject(PizarraService);
  datosPorAnio: { [anio: number]: number[] } = {};
  cargando = true;

  /*ngOnInit(): void {
    this.pizarraService.obtenerAcumuladoRangoVikingo(2021, new Date().getFullYear())
      .subscribe((datos) => this.datosPorAnio = datos);
  }*/

  ngOnInit(): void {
    this.pizarraService
      .obtenerAcumuladoRangoPorCodigos(2022, 2026, ['30','31'])
      .subscribe({
        next: (datos) => {
          this.datosPorAnio = datos;
          this.cargando = false;
        },
        error: (err) => {
          console.error('Error al cargar el acumulado', err);
          this.cargando = false;
        }
      });
  }

}
