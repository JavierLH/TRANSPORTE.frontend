import { Component, inject, OnInit } from '@angular/core';
import { ComparativaAnual } from "../../../../shared/comparativa-anual/comparativa-anual/comparativa-anual";
import { ChartModule } from 'primeng/chart';
import { PizarraService } from '../../../../core/services/PizarraService';

@Component({
  selector: 'app-acumulados-drakkar',
  imports: [ChartModule, ComparativaAnual],
  templateUrl: './acumulados-drakkar.html',
  styleUrl: './acumulados-drakkar.css',
})
export class AcumuladosDrakkar implements OnInit{
    Empresa : string = 'Vikingo'

    private pizarraService = inject(PizarraService);
    datosPorAnio: { [anio: number]: number[] } = {};

    /*ngOnInit(): void {
      this.pizarraService.obtenerAcumuladoRangoVikingo(2021, new Date().getFullYear())
        .subscribe((datos) => this.datosPorAnio = datos);
    }*/

    ngOnInit(): void {
      this.pizarraService
        .obtenerAcumuladoRangoPorCodigos(2022, 2026, ['40','41'])
        .subscribe((datos) => this.datosPorAnio = datos);
    }

}
