import { Component, inject, OnInit } from '@angular/core';
import { ComparativaAnual } from "../../../../../shared/comparativa-anual/comparativa-anual/comparativa-anual";
import { PizarraService } from '../../../../../core/services/PizarraService';

@Component({
  selector: 'app-analiticas-dashboard-vk',
  imports: [ComparativaAnual],
  templateUrl: './analiticas-dashboard-vk.html',
  styleUrl: './analiticas-dashboard-vk.css',
})
export class AnaliticasDashboardVK implements OnInit{

  Empresa : string = 'Vikingo'

  private pizarraService = inject(PizarraService);
  datosPorAnio: { [anio: number]: number[] } = {};

  /*ngOnInit(): void {
    this.pizarraService.obtenerAcumuladoRangoVikingo(2021, new Date().getFullYear())
      .subscribe((datos) => this.datosPorAnio = datos);
  }*/

  ngOnInit(): void {
    this.pizarraService
      .obtenerAcumuladoRangoPorCodigos(2026, 2026, ['30','31'])
      .subscribe((datos) => this.datosPorAnio = datos);
  }

}
