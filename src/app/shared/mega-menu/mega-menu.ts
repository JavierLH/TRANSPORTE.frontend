import { Component, OnInit } from '@angular/core';
import { AvatarModule } from 'primeng/avatar';
import { ButtonModule } from 'primeng/button';
import { MegaMenuModule } from 'primeng/megamenu';
import { RippleModule } from 'primeng/ripple';
import { MegaMenuItem } from 'primeng/api';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mega-menu',
  imports: [AvatarModule, ButtonModule, MegaMenuModule, RippleModule, CommonModule],
  templateUrl: './mega-menu.html',
  styleUrl: './mega-menu.css',
})
export class MegaMenu  implements OnInit{

  items!: MegaMenuItem[];

  ngOnInit() {
    this.items = [
      {
        label: 'Company',
        root: true, // Esto activa el *ngIf="item.root" de tu HTML
        items: [
          [
            {
              items: [
                { label: 'About Us', subtext: 'Nuestra historia y valores', icon: 'pi pi-info-circle' },
                { label: 'Careers', subtext: 'Únete a nuestro equipo', icon: 'pi pi-users' },
                { label: 'Newsroom', subtext: 'Noticias y comunicados', icon: 'pi pi-megaphone' }
              ]
            }
          ]
        ]
      },
      {
        label: 'Resources',
        root: true,
        items: [
          [
            {
              items: [
                { label: 'Blog', subtext: 'Artículos y tutoriales', icon: 'pi pi-align-left' },
                { label: 'Community', subtext: 'Foros y discusiones', icon: 'pi pi-comments' }
              ]
            },
            {
              // Este bloque activa el *ngIf="item.image" de tu HTML
              items: [
                {
                  image: 'https://primefaces.org/cdn/primeng/images/demo/megamenu/bg-1.png',
                  label: 'Ver tutoriales',
                  subtext: 'Aprende con nuestros expertos'
                }
              ]
            }
          ]
        ]
      },
      {
        label: 'Contact',
        root: true,
        items: [
          [
            {
              items: [
                { label: 'Support', subtext: 'Abre un ticket', icon: 'pi pi-life-ring' },
                { label: 'Sales', subtext: 'Habla con un asesor', icon: 'pi pi-phone' }
              ]
            }
          ]
        ]
      }
    ];
  }
}
