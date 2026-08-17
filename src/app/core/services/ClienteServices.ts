import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Cliente } from "../models/CatalogosViajeDtos";
import { APIClientes } from "../APIClientes";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export default class ClienteService {

  private http = inject(HttpClient);

  obtenerTodosLosClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(APIClientes.obtenerTodosLosClientes());
  }

  obtenerClientesPorEmpresa(idEmpresa : number) : Observable<Cliente[]> {
    return this.http.get<Cliente[]>(APIClientes.obtenerClientesPorEmpresa(idEmpresa));
  }

  obtenerClientePorId(idCliente : number) : Observable<Cliente> {
    return this.http.get<Cliente>(APIClientes.obtenerClientePorId(idCliente));
  }

  agregarNuevoCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(APIClientes.agregarNuevoCliente(), cliente);
  }

  actualizarCliente(cliente: Cliente): Observable<void> {
    return this.http.put<void>(
      APIClientes.actualizarCliente(cliente.idCliente!),
      cliente
    );
  }

  eliminarCliente(idCliente: number): Observable<void> {
    return this.http.delete<void>(APIClientes.eliminarClientePorId(idCliente));
  }
}
