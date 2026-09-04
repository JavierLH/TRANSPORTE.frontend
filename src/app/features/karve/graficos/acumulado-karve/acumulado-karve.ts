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
    cargando = true;

    ngOnInit(): void {
      this.pizarraService
        .obtenerAcumuladoRangoPorCodigos(2025, 2026, ['10','11','12'])
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
