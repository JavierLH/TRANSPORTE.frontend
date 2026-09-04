import { Component, inject, OnInit } from '@angular/core';
import { ComparativaAnual } from "../../../../../shared/comparativa-anual/comparativa-anual/comparativa-anual";
import { ContenedoresComparativaAnual } from "../../../../../shared/comparativa-contenedores/contenedores-comparativa-anual/contenedores-comparativa-anual";
import { PizarraService } from '../../../../../core/services/PizarraService';

@Component({
  selector: 'app-analiticas-dashboard-vk',
  imports: [ComparativaAnual, ContenedoresComparativaAnual],
  templateUrl: './analiticas-dashboard-vk.html',
  styleUrl: './analiticas-dashboard-vk.css',
})
export class AnaliticasDashboardVK implements OnInit{

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
      .obtenerAcumuladoRangoPorCodigos(2026, 2026, ['30','31'])
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
