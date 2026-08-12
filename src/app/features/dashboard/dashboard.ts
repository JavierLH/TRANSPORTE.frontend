import { Component, OnInit } from '@angular/core';
import {  TablaDashboardComponent } from '../../shared/tabla-dashboard/tabla-dashboard';
import { MegaMenu } from "../../shared/mega-menu/mega-menu";
import { Usuarios } from '../../core/services/usuarios';
import { NavMenu } from '../navmenu/navmenu';
import { RouterOutlet } from '@angular/router';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-dashboard',
  imports: [TablaDashboardComponent, MegaMenu, NavMenu, RouterOutlet, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit{

  tema : string = 'tema-vikingo';

  constructor(private usuarioService: Usuarios){

    /*const credenciales: UsuarioCredenciales = {
      Username: 'TRAFICO1',
      Password: '123'
    };

    this.usuarioService.IniciarSesion(credenciales).subscribe({
      next: (respuesta: LoginResponse) => {
            console.log('Login Exitoso:', respuesta.exito);
            console.log('JWT Token recibido:', respuesta.token);

            localStorage.setItem('token', respuesta.token);

            const datosDelUsuario: Usuario = respuesta.informacionAdicional;
            console.log('Datos del usuario con sus roles:', datosDelUsuario);

          },
          error: (err) => {
            console.error('Error en el inicio de sesión:', err);
          }
    });*/

  }

  ngOnInit(): void {

    console.log();

  }



}
