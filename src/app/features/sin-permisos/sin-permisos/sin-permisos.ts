import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'app-sin-permisos',
  standalone: true,
  imports: [CommonModule, ButtonModule, CardModule],
  templateUrl: './sin-permisos.html'
})
export class SinPermisos {

  private route = inject(ActivatedRoute);
  private router = inject(Router);

  public rutaIntentada = this.route.snapshot.queryParamMap.get('ruta');

  public regresar(): void {
    this.router.navigate(['/']);
  }
}
