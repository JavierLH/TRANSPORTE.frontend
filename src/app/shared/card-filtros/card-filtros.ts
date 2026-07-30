import { Component, Inject, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Select, SelectModule } from "primeng/select";
import { EstatusViaje, FiltroDeBusqueda, Origen } from '../../core/models/CatalogosFiltrosDtos';
import { Cliente, Ejecutivo } from '../../core/models/CatalogosViajeDtos';
import { CatalogosViajeService } from '../../core/services/CatalogosViajesService';
import { DatePickerModule } from 'primeng/datepicker';

interface City {
    name: string;
    code: string;
}

@Component({
  selector: 'app-card-filtros',
  imports: [Select, SelectModule, FormsModule, DatePickerModule],
  templateUrl: './card-filtros.html',
  styleUrl: './card-filtros.css',
})
export class CardFiltros implements OnInit{
    @Input() nombreEmpresa : any;
    recursoImagen: string = '';

      origenes: Origen[] = [];
      estatusViajes: EstatusViaje[] = [];
      clientes: Cliente[] = [];
      ejecutivos: Ejecutivo[] = [];

      selectedOrigen: Origen | undefined;
      selectedEstatus: EstatusViaje | undefined;
      selectedCliente: Cliente | undefined;
      selectedEjecutivo: Ejecutivo | undefined;

      rangeDates: Date[] | undefined;

    constructor(private catalogosViajesService: CatalogosViajeService) {}

    ngOnInit() {
        if (this.nombreEmpresa === 'Vikingo') {
          this.recursoImagen = 'Recurso 3@4x.png';
          this.catalogosViajesService.obtenerCatalagosPorEmpresa(/* idEmpresa Vikingo */ 2)
            .subscribe((filtros: FiltroDeBusqueda) => this.llenarFiltros(filtros));
        } else if (this.nombreEmpresa === 'Karve') {
          this.recursoImagen = 'Recurso 5@4x.png';
          this.catalogosViajesService.obtenerCatalagosPorEmpresa(/* idEmpresa Karve */ 1)
            .subscribe((filtros: FiltroDeBusqueda) => this.llenarFiltros(filtros));
        }else if (this.nombreEmpresa === 'Letca') {
          this.recursoImagen = 'letscargo (1).png';
          this.catalogosViajesService.obtenerCatalagosPorEmpresa(/* idEmpresa Letca */ 4)
            .subscribe((filtros: FiltroDeBusqueda) => this.llenarFiltros(filtros));
        }else if(this.nombreEmpresa === 'Drakkar'){
          this.recursoImagen = 'Recurso 4@4x.png';
          this.catalogosViajesService.obtenerCatalagosPorEmpresa(/* idEmpresa Letca */ 3)
            .subscribe((filtros: FiltroDeBusqueda) => this.llenarFiltros(filtros));
        }
      }

    private llenarFiltros(filtros: FiltroDeBusqueda) {

      this.origenes = filtros.origenesDestinos;
      this.estatusViajes = filtros.estatusViajes;
      this.clientes = filtros.cliente;
      this.ejecutivos = filtros.ejecutivos;
    }



}
