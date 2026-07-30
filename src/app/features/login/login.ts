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

interface Empresa {
    name: string;
    code: string;
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
    empresaSeleccionada!: Empresa;
    loginForm!: FormGroup;

    mensajeError: string | null = null;
    mensajeExito: string | null = null;

    constructor(
      private usuarioService: Usuarios,
      private fb: FormBuilder,
      private router: Router
    ) {
      this.crearFormulario();
    }

    ngOnInit() {
        this.empresas = [
            { name: 'KARVE', code: '10', url: 'Recurso 5@4x.png' },
            { name: 'VIKINGO', code: '30', url: 'Recurso 3@4x.png' },
            { name: 'DRAKKAR', code: '40' , url: 'Recurso 4@4x.png' },
            { name: 'LETCA', code: '50' , url: 'letscargo.png' }
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

      console.log("Iniciando sesión...");

      const credenciales: UsuarioCredenciales = {
        Username: this.loginForm.value.usuario,
        Password: this.loginForm.value.contrasena
      };

      this.usuarioService.IniciarSesion(credenciales).subscribe({
        next: (respuesta: LoginResponse) => {
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
          }
        },
        error: (err) => {

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
