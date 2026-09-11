import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { APITarifario } from "../APITarifario";
import { Destino, DestinoNuevo, Estado, Origen } from "../models/Tarifario";

@Injectable({ providedIn: 'root' })
export class TarifarioService {

  private http = inject(HttpClient);

  // ─── Estados ───────────────────────────────────────────────────────

  /** Catálogo para el selector del alta de destino. */
  obtenerEstados(): Observable<Estado[]> {
    return this.http.get<Estado[]>(APITarifario.obtenerEstados());
  }

  // ─── Destinos ──────────────────────────────────────────────────────

  /** Cada destino viene con el nombre de su estado ya resuelto. */
  obtenerDestinos(): Observable<Destino[]> {
    return this.http.get<Destino[]>(APITarifario.obtenerDestinos());
  }

  obtenerDestinoPorId(idCiudad: number): Observable<Destino> {
    return this.http.get<Destino>(APITarifario.obtenerDestinoPorId(idCiudad));
  }

  crearDestino(destino: DestinoNuevo): Observable<DestinoNuevo> {
    return this.http.post<DestinoNuevo>(APITarifario.crearDestino(), destino);
  }

  actualizarDestino(destino: DestinoNuevo): Observable<void> {
    return this.http.put<void>(
      APITarifario.actualizarDestino(destino.idCiudad!),
      destino
    );
  }

  eliminarDestino(idCiudad: number): Observable<void> {
    return this.http.delete<void>(APITarifario.eliminarDestino(idCiudad));
  }

  // ─── Orígenes ──────────────────────────────────────────────────────

  obtenerOrigenes(): Observable<Origen[]> {
    return this.http.get<Origen[]>(APITarifario.obtenerOrigenes());
  }

  obtenerOrigenPorId(idOrigen: number): Observable<Origen> {
    return this.http.get<Origen>(APITarifario.obtenerOrigenPorId(idOrigen));
  }

  crearOrigen(origen: Origen): Observable<Origen> {
    return this.http.post<Origen>(APITarifario.crearOrigen(), origen);
  }

  actualizarOrigen(origen: Origen): Observable<void> {
    return this.http.put<void>(
      APITarifario.actualizarOrigen(origen.idOrigen!),
      origen
    );
  }

  eliminarOrigen(idOrigen: number): Observable<void> {
    return this.http.delete<void>(APITarifario.eliminarOrigen(idOrigen));
  }

}
