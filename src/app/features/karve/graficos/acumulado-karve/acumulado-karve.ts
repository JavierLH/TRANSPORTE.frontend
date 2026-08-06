import { Component, inject, OnInit } from '@angular/core';
import { ComparativaAnual } from "../../../../shared/comparativa-anual/comparativa-anual/comparativa-anual";
import { PizarraService } from '../../../../core/services/PizarraService';

@Component({
  selector: 'app-acumulado-karve',
  imports: [ComparativaAnual],
  templateUrl: './acumulado-karve.html',
  styleUrl: './acumulado-karve.css',
})
export class AcumuladoKarve implements OnInit{

    Empresa : string = 'Vikingo'

    private pizarraService = inject(PizarraService);
    datosPorAnio: { [anio: number]: number[] } = {};

    ngOnInit(): void {
      this.pizarraService
        .obtenerAcumuladoRangoPorCodigos(2025, 2026, ['10','11','12'])
        .subscribe((datos) => this.datosPorAnio = datos);
    }

}
