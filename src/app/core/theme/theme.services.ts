import { Injectable, signal, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs';
import { usePreset } from '@primeuix/themes';
import { Brand, BRAND_DEFAULT, BrandKey, BRANDS } from './brands';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly router = inject(Router);
  readonly brand = signal<Brand>(BRANDS[BRAND_DEFAULT]);

  constructor() {
    this.router.events
      .pipe(filter((e): e is NavigationEnd => e instanceof NavigationEnd))
      .subscribe(() => {
        const key = this.leerMarcaDeRuta();
        if (key) this.aplicar(key);
      });
  }

  aplicar(key: BrandKey): void {
    const b = BRANDS[key] ?? BRANDS[BRAND_DEFAULT];
    if (b.key === this.brand().key) return;   // ← evita regenerar el CSS sin necesidad
    this.brand.set(b);
    usePreset(b.preset);
    localStorage.setItem('brand', b.key);
  }

  restaurar(): void {
    this.aplicar((localStorage.getItem('brand') as BrandKey) ?? BRAND_DEFAULT);
  }

  /** Recorre el árbol de rutas y se queda con el `brand` más profundo. */
  private leerMarcaDeRuta(): BrandKey | null {
    let nodo: ActivatedRouteSnapshot | null = this.router.routerState.snapshot.root;
    let marca: BrandKey | null = null;
    while (nodo) {
      const b = nodo.data?.['brand'] as BrandKey | undefined;
      if (b) marca = b;
      nodo = nodo.firstChild;
    }
    return marca;
  }
}
