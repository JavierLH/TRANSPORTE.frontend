import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { authGuard, permisoRutaGuard, publicGuard } from './security/Guards';
import { Dashboard } from './features/dashboard/dashboard';
import { ProgramacionViajesKarve } from './features/karve/programacion-viajes-karve/programacion-viajes-karve';
import { ProgramacionViajesVikingo } from './features/vikingo/programacion-viajes-vikingo/programacion-viajes-vikingo/programacion-viajes-vikingo';
import { UsuariosEmpresas } from './features/configuraciones/usuarios-empresas/usuarios-empresas';
import { Drakkar } from './features/configuraciones/permisos/drakkar/drakkar';
import { KarvePermisos } from './features/configuraciones/permisos/karve/karve-permisos/karve-permisos';
import { LetcaPermisos } from './features/configuraciones/permisos/letca/letca-permisos/letca-permisos';
import { VikingoPermisos } from './features/configuraciones/permisos/vikingo/vikingo-permisos/vikingo-permisos';
import { VikingoRoles } from './features/configuraciones/roles/vikingo/vikingo-roles/vikingo-roles';
import { KarveRoles } from './features/configuraciones/roles/karve/karve-roles/karve-roles';
import { LetcaRoles } from './features/configuraciones/roles/letca/letca-roles/letca-roles';
import { DrakkarRoles } from './features/configuraciones/roles/drakkar/drakkar-roles/drakkar-roles';
import { ProgramacionViajesLetca } from './features/letca/programacion-viajes-letca/programacion-viajes-letca';
import { ProgramacionViajesDrakkar } from './features/drakkar/programacion-viajes-drakkar/programacion-viajes-drakkar';
import { EjecutivosVikingo } from './features/vikingo/ejecutivos/ejecutivos-vikingo/ejecutivos-vikingo';
import { AcumuladoGraficoBarra } from './features/vikingo/graficos/acumulado/acumulado-grafico-barra/acumulado-grafico-barra';
import { AcumuladosDrakkar } from './features/drakkar/graficos/acumulados-drakkar/acumulados-drakkar';
import { AcumuladoKarve } from './features/karve/graficos/acumulado-karve/acumulado-karve';
import { SinPermisos } from './features/sin-permisos/sin-permisos/sin-permisos';
import { EjecutivosKarve } from './features/karve/ejecutivos-karve/ejecutivos-karve';
import { EjecutivosLetca } from './features/letca/ejecutivos-letca/ejecutivos-letca';
import { EjecutivosDrakkar } from './features/drakkar/ejecutivos/ejecutivos-drakkar/ejecutivos-drakkar';
import { ClientesVikingo } from './features/vikingo/clientes-vikingo/clientes-vikingo';
import { ClientesKarve } from './features/karve/clientes-karve/clientes-karve';
import { ClientesLetca } from './features/letca/clientes-letca/clientes-letca';
import { ClientesDrakkar } from './features/drakkar/clientes-drakkar/clientes-drakkar';
import { OperadoresVikingo } from './features/vikingo/operadores-vikingo/operadores-vikingo';
import { OperadoresKarve } from './features/karve/operadores-karve/operadores-karve';
import { OperadoresLetca } from './features/letca/operadores-letca/operadores-letca';
import { OperadoresDrakkar } from './features/drakkar/operadores-drakkar/operadores-drakkar';
import { AnaliticasDashboardVK } from './features/vikingo/reportes_analiticas/dashboard/analiticas-dashboard-vk/analiticas-dashboard-vk';
import { DashboardAnaliticasDrakkar } from './features/drakkar/Reportes_analiticas_drakkar/dashboard-analiticas-drakkar/dashboard-analiticas-drakkar';

export const routes: Routes = [
  {
    path: 'login',
    component: Login,
    canActivate: [publicGuard]
  },
  {
    path: '',
    component: Dashboard,
    canActivate: [authGuard],
    children: [

      // ─── Tráfico / Programación de viajes ──────────────────────────

      {
        path: 'siil/vikingo/trafico/programaciondeviajes',
        component: ProgramacionViajesVikingo,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/vikingo/trafico/programaciondeviajes', brand: 'vikingo' }
      },
      {
        path: 'siil/letca/trafico/programaciondeviajes',
        component: ProgramacionViajesLetca,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/letca/trafico/programaciondeviajes', brand: 'letca' }
      },
      {
        path: 'siil/drakkar/trafico/programaciondeviajes',
        component: ProgramacionViajesDrakkar,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/drakkar/trafico/programaciondeviajes', brand: 'drakkar' }
      },

      // ─── Catálogos ─────────────────────────────────────────────────
      {
        path: 'siil/vikingo/trafico/catalogo/ejecutivos',
        component: EjecutivosVikingo,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/vikingo/trafico/catalogo/ejecutivos', brand: 'vikingo' }
      },

      // ─── Dashboards ────────────────────────────────────────────────
      {
        path: 'siil/vikingo/dashboard',
        component: AcumuladoGraficoBarra,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/vikingo/dashboard', brand: 'vikingo' }
      },
      {
        path: 'siil/drakkar/dashboard',
        component: AcumuladosDrakkar,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/drakkar/dashboard', brand: 'drakkar' }
      },
      {
        path: 'siil/karve/dashboard',
        component: AcumuladoKarve,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/karve/dashboard', brand: 'karve' }
      },

      // ─── Configuraciones / Permisos ────────────────────────────────
      {
        path: 'siil/configuraciones/permisos/vikingo',
        component: VikingoPermisos,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/vikingo', brand: 'vikingo' }
      },
      {
        path: 'siil/configuraciones/permisos/karve',
        component: KarvePermisos,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/karve', brand: 'karve' }
      },
      {
        path: 'siil/configuraciones/permisos/letca',
        component: LetcaPermisos,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/letca', brand: 'letca' }
      },
      {
        path: 'siil/configuraciones/permisos/drakkar',
        component: Drakkar,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/drakkar', brand: 'drakkar' }
      },

      // ─── Configuraciones / Roles ───────────────────────────────────
      {
        path: 'siil/configuraciones/roles/vikingo',
        component: VikingoRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/roles/vikingo', brand: 'vikingo' }
      },
      {
        path: 'siil/configuraciones/roles/karve',
        component: KarveRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/roles/karve', brand: 'karve' }
      },
      {
        path: 'siil/configuraciones/roles/letca',
        component: LetcaRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/letca', brand: 'letca' }
      },
      {
        path: 'siil/configuraciones/roles/drakkar',
        component: DrakkarRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/roles/vikingo', brand: 'drakkar' }
      },

      // ─── Configuraciones / Transversal ─────────────────────────────
      // Sin `brand`: conserva la empresa desde la que se entró.
      {
        path: 'siil/configuraciones/usuariosEmpresas',
        component: UsuariosEmpresas,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/usuariosEmpresas' }
      },

      {
        path: 'siil/karve/trafico/programaciondeviajes',
        component: ProgramacionViajesKarve,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/karve/trafico/programaciondeviajes', brand: 'karve' }
      },

      {
        path: 'siil/karve/trafico/catalogo/ejecutivos',
        component: EjecutivosKarve,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/karve/trafico/catalogo/ejecutivos', brand: 'karve' }
      },

      {
        path: 'siil/letca/trafico/catalogo/ejecutivos',
        component: EjecutivosLetca,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/letca/trafico/catalogo/ejecutivos', brand: 'letca' }
      },

      {
        path: 'siil/drakkar/trafico/catalogo/ejecutivos',
        component: EjecutivosDrakkar,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/drakkar/trafico/catalogo/ejecutivos', brand: 'drakkar' }
      },



      // ─── Catálogo general / Clientes ───────────────────────────────
      {
        path: 'siil/vikingo/trafico/catalogo/clientesfactura',
        component: ClientesVikingo,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/vikingo/trafico/catalogo/clientesfactura', brand: 'vikingo' }
      },

      {
        path: 'siil/karve/trafico/catalogo/clientesfactura',
        component: ClientesKarve,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/karve/trafico/catalogo/clientesfactura', brand: 'karve' }
      },

      {
        path: 'siil/letca/trafico/catalogo/clientesfactura',
        component: ClientesLetca,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/letca/trafico/catalogo/clientesfactura', brand: 'letca' }
      },

      {
        path: 'siil/drakkar/trafico/catalogo/clientesfactura',
        component: ClientesDrakkar,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/drakkar/trafico/catalogo/clientesfactura', brand: 'drakkar' }
      },

      // ─── Catálogos / Operadores ────────────────────────────────────
      {
        path: 'siil/vikingo/trafico/catalogo/operadores',
        component: OperadoresVikingo,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/vikingo/trafico/catalogo/operadores', brand: 'vikingo' }
      },

      {
        path: 'siil/karve/trafico/catalogo/operadores',
        component: OperadoresKarve,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/karve/trafico/catalogo/operadores', brand: 'karve' }
      },

      {
        path: 'siil/letca/trafico/catalogo/operadores',
        component: OperadoresLetca,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/letca/trafico/catalogo/operadores', brand: 'letca' }
      },

      {
        path: 'siil/drakkar/trafico/catalogo/operadores',
        component: OperadoresDrakkar,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/drakkar/trafico/catalogo/operadores', brand: 'drakkar' }
      },

      {
        path: 'siil/vikingo/reportes_analiticas/dashboard',
        component: AnaliticasDashboardVK,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/vikingo/reportes_analiticas/dashboard', brand: 'vikingo' }
      },

      {
        path: 'siil/drakkar/reportes_analiticas/dashboard',
        component: DashboardAnaliticasDrakkar,
        canActivate: [authGuard, permisoRutaGuard],
        data: { rutaModulo: 'siil/drakkar/reportes_analiticas/dashboard', brand: 'drakkar' }
      },

      {
        path: 'siil/sin-permisos',
        component: SinPermisos,
        canActivate: [authGuard]
      },

    ]

  },
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];
