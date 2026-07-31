import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { PanelMenuModule } from 'primeng/panelmenu';
import { BadgeModule } from 'primeng/badge';
import { RippleModule } from 'primeng/ripple';
import { AvatarModule } from 'primeng/avatar';
import { CommonModule } from '@angular/common';
import { RouterLink, Router, NavigationEnd } from "@angular/router";
import { filter } from 'rxjs/operators';
import { Usuario, Permiso } from '../../core/models/usuarioRolesFunciones';

@Component({
    selector: 'app-navmenu',
    templateUrl: './navmenu.html',
    styleUrl: './navmenu.css',
    standalone: true,
    imports: [PanelMenuModule, BadgeModule, RippleModule, AvatarModule, CommonModule, RouterLink]
})
export class NavMenu implements OnInit, AfterViewInit {
    items: MenuItem[] = [];
    nombre: string | undefined;

    @ViewChild('scrollContainer') scrollContainer!: ElementRef;

    constructor(private router: Router, private cdr: ChangeDetectorRef) {
      const usuarioRaw = localStorage.getItem('usuario');
      if (usuarioRaw) {
        const usuario = JSON.parse(usuarioRaw) as Usuario;
        this.nombre = usuario.nombre;
      }
    }

    ngOnInit() {
      const usuarioRaw = localStorage.getItem('usuario');

      if (usuarioRaw) {
        const usuario = JSON.parse(usuarioRaw) as Usuario;

        if (usuario.usuarioEmpresaRols && usuario.usuarioEmpresaRols.length > 0) {
          const permisosDelBackend = usuario.usuarioEmpresaRols[0].rol.permisos;
          this.items = this.mapearPermisosAMenuItems(permisosDelBackend);

          this.marcarRutaActivaYExpandir(this.items, this.router.url);
          this.cdr.detectChanges();

        }
      }

      this.router.events.pipe(
        filter(event => event instanceof NavigationEnd)
      ).subscribe((event: any) => {

        this.limpiarEstilosActivos(this.items);


        this.marcarRutaActivaYExpandir(this.items, event.urlAfterRedirects);

        this.cdr.detectChanges();
      });
    }

    ngAfterViewInit() {
      const savedScroll = sessionStorage.getItem('menuScrollPos');
      if (savedScroll && this.scrollContainer) {
        setTimeout(() => {
          this.scrollContainer.nativeElement.scrollTop = parseInt(savedScroll, 10);
        }, 50);
      }
    }

    onScroll(event: Event) {
      const target = event.target as HTMLElement;
      sessionStorage.setItem('menuScrollPos', target.scrollTop.toString());
    }

    private mapearPermisosAMenuItems(permisos: Permiso[]): MenuItem[] {
      return permisos.map(permiso => {
        const menuItem: MenuItem = {
          label: permiso.nombrePermiso,
          icon : permiso.rutaImagen || 'pi pi-folder'
        };

        if (permiso.rutaModulo && permiso.rutaModulo !== 'null') {
          menuItem.routerLink = ['/' + permiso.rutaModulo];
          console.log(permiso);
          menuItem.icon = permiso.rutaImagen;
        }

        if (permiso.hijos && permiso.hijos.length > 0) {
          this.removerHijosDuplicados(permiso.hijos);
          menuItem.items = this.mapearPermisosAMenuItems(permiso.hijos);
        }

        return menuItem;
      });
    }

    private removerHijosDuplicados(hijos: Permiso[]): void {
      const vistos = new Set();
      for (let i = hijos.length - 1; i >= 0; i--) {
        if (vistos.has(hijos[i].idPermiso)) {
          hijos.splice(i, 1);
        } else {
          vistos.add(hijos[i].idPermiso);
        }
      }
    }

    private limpiarEstilosActivos(items: MenuItem[]) {
      for (const item of items) {
        if (item.styleClass) {
          item.styleClass = item.styleClass.replace('menu-activo', '').trim();
        }
        if (item.items && item.items.length > 0) {
          this.limpiarEstilosActivos(item.items);
        }
      }
    }

    private marcarRutaActivaYExpandir(items: MenuItem[], url: string): boolean {
      let matchEncontrado = false;
      const urlLimpia = url.split('?')[0].split('#')[0];

      for (const item of items) {

        let esRutaExacta = false;
        if (item.routerLink) {
          const ruta = item.routerLink[0];
          if (urlLimpia === ruta || urlLimpia.startsWith(ruta + '/')) {
            esRutaExacta = true;
          }
        }

        let hijoCoincide = false;
        if (item.items && item.items.length > 0) {
          hijoCoincide = this.marcarRutaActivaYExpandir(item.items, urlLimpia);
        }

        if (esRutaExacta || hijoCoincide) {
          item.expanded = true;
          item.styleClass = (item.styleClass ? item.styleClass + ' ' : '') + 'menu-activo';
          matchEncontrado = true;
        }
      }

      return matchEncontrado;

    }
}
