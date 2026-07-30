import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API } from '../API';
import { CatalogosViaje } from '../models/CatalogosViajeDtos';
import { FiltroDeBusqueda } from '../models/CatalogosFiltrosDtos';

@Injectable({
  providedIn: 'root',
})
export class CatalogosViajeService {

  constructor(private http: HttpClient) { }

  public obtenerCatalogosViaje(idEmpresa: number): Observable<CatalogosViaje> {
    return this.http.get<CatalogosViaje>(
      API.obtenerCatalogosViajeEmpresa(idEmpresa)
    );
  }

  public obtenerCatalagosPorEmpresa(idEmpresa: number): Observable<FiltroDeBusqueda> {
    return this.http.get<FiltroDeBusqueda>(
      API.obtenerCatalagosPorEmpresa(idEmpresa)
    );
  }

}
