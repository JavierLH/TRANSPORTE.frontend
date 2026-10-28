import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router'; // 👈 1. Importamos el Router de Angular
import { DividerModule } from 'primeng/divider';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { CommonModule } from '@angular/common';
import { Usuarios } from '../../core/services/usuarios';
import { UsuarioCredenciales } from '../../core/models/UsuarioCredenciales';
import { LoginResponse, Usuario } from '../../core/models/usuarioRolesFunciones';

/** Las empresas del grupo, sólo para la franja de logos del pie. */
interface Empresa {
    name: string;
    url : string;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ButtonModule, DividerModule, InputTextModule, ReactiveFormsModule, SelectModule, CommonModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login implements OnInit {

    empresas!: Empresa[];
    loginForm!: FormGroup;

    mensajeError: string | null = null;
    mensajeExito: string | null = null;

    /** Evita el doble envío mientras la petición está en vuelo. */
    cargando = false;

    mostrarContrasena = false;

    constructor(
      private usuarioService: Usuarios,
      private fb: FormBuilder,
      private router: Router
    ) {
      this.crearFormulario();
    }

    ngOnInit() {
        this.empresas = [
            { name: 'Vikingo', url: 'Recurso 3@4x.png' },
            { name: 'Karve',   url: 'Recurso 5@4x.png' },
            { name: 'Drakkar', url: 'Recurso 4@4x.png' },
            { name: 'Letca',   url: 'letscargo.png' }
        ];
    }

    crearFormulario() {
      this.loginForm = this.fb.group({
        usuario: ['', [Validators.required]],
        contrasena: ['', [Validators.required]]
      });
    }

    iniciarSesion(): void {
      this.mensajeError = null;
      this.mensajeExito = null;

      if (this.loginForm.invalid) {
        this.mensajeError = "Por favor, completa todos los campos obligatorios.";
        return;
      }

      const credenciales: UsuarioCredenciales = {
        Username: this.loginForm.value.usuario,
        Password: this.loginForm.value.contrasena
      };

      this.cargando = true;

      this.usuarioService.IniciarSesion(credenciales).subscribe({
        next: (respuesta: LoginResponse) => {
          // En el caso exitoso no se apaga: la pantalla está por cambiar y
          // reactivar el botón sólo invitaría a un segundo envío.
          if (respuesta.exito) {
            this.mensajeExito = '¡Inicio de sesión correcto! Redirigiendo...';

            localStorage.setItem('token', respuesta.token);
            const datosDelUsuario: Usuario = respuesta.informacionAdicional;

            localStorage.setItem('usuario', JSON.stringify(datosDelUsuario));

            setTimeout(() => {
              this.router.navigate(['/']);
            }, 400);

          } else {
            this.mensajeError = 'El inicio de sesión no fue válido.';
            this.cargando = false;
          }
        },
        error: (err) => {
          this.cargando = false;

          if (err.error && err.error.mensaje) {
            this.mensajeError = err.error.mensaje;
          } else {
            this.mensajeError = 'No se pudo conectar con el servidor. Inténtalo más tarde.';
          }
          console.error('Error completo:', err);
        }
      });
    }
}
