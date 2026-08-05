import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { API } from "../API";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PizarraService {

  constructor(private httpClient: HttpClient) { }

  obtenerViajesVikingo(anioDeseado: number): Observable<[]> {
    return this.httpClient.get<[]>(API.obtenerAcumuladosVikingo(anioDeseado));
  }

  obtenerAcumuladoRangoVikingo(anioInicial: number, anioFinal: number): Observable<{ [anio: number]: number[] }> {
    return this.httpClient.get<{ [anio: number]: number[] }>(
      API.obtenerAcumuladoRangoVikingo(anioInicial, anioFinal)
    );
  }

  obtenerAcumuladoRangoPorCodigos(
    anioInicial: number,
    anioFinal: number,
    codigos: string[]): Observable<{ [anio: number]: number[] }>
    {
      return this.httpClient.get<{ [anio: number]: number[] }>(API.obtenerAcumuladoRangoPorCodigos(anioInicial, anioFinal, codigos));
    }

}
