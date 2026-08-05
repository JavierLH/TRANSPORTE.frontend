import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import Convenio from "../models/Convenio";
import { API } from "../API";

@Injectable({
  providedIn: 'root',
})
export class ConvenioServices{

  constructor(private http: HttpClient) {  }

  obtenerTodosLosConvenios(noConvenio: number) : Observable<Convenio[]> {
    return this.http.get<Convenio[]>(API.obtenerTodosLosConvenios(noConvenio));
  }

  crearNuevoConvenio(convenio: Convenio): Observable<Convenio> {
    return this.http.post<Convenio>(API.crearNuevoConvenio(), convenio);
  }

}
