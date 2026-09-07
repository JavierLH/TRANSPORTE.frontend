import { Component, inject } from '@angular/core';
import { ComparativaAnual } from "../../../../shared/comparativa-anual/comparativa-anual/comparativa-anual";
import { ContenedoresComparativaAnual } from "../../../../shared/comparativa-contenedores/contenedores-comparativa-anual/contenedores-comparativa-anual";
import { MercanciasComparativaAnual } from "../../../../shared/comparativa-mercancias/mercancias-comparativa-anual/mercancias-comparativa-anual";
import { PizarraService } from '../../../../core/services/PizarraService';

@Component({
  selector: 'app-dashboard-analiticas-drakkar',
  imports: [ComparativaAnual, ContenedoresComparativaAnual, MercanciasComparativaAnual],
  templateUrl: './dashboard-analiticas-drakkar.html',
  styleUrl: './dashboard-analiticas-drakkar.css',
})
export class DashboardAnaliticasDrakkar {
  Empresa : string = 'Drakkar'

  private pizarraService = inject(PizarraService);
  datosPorAnio: { [anio: number]: number[] } = {};
  cargando = true;

  ngOnInit(): void {
      this.pizarraService
        .obtenerAcumuladoRangoPorCodigos(2026, 2026, ['40','41'])
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
