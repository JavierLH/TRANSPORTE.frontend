import { Routes } from '@angular/router';
import { Login } from './features/login/login';
import { authGuard, publicGuard } from './security/Guards';
import { Dashboard } from './features/dashboard/dashboard';
import { DashboardVK } from './features/vikingo/dashboard/dashboardVK';
import { DashboardKarve } from './features/karve/dashboard-karve/dashboard-karve';
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

      {
        path: 'siil/karve/trafico/programaciondeviajes',
        component: ProgramacionViajesKarve,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/karve/trafico/programaciondeviajes' }
      },
      {
        path: 'siil/vikingo/trafico/programaciondeviajes',
        component: ProgramacionViajesVikingo,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/karve/trafico/programaciondeviajes' }
      },
      {
        path: 'siil/configuraciones/usuariosEmpresas',
        component: UsuariosEmpresas,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/usuariosEmpresas' }
      },

      {
        path: 'siil/configuraciones/permisos/drakkar',
        component: Drakkar,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/drakkar' }
      },

      {
        path: 'siil/configuraciones/permisos/karve',
        component: KarvePermisos,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/karve' }
      },
      {
        path: 'siil/configuraciones/permisos/letca',
        component: LetcaPermisos,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/letca' }
      },
      {
        path: 'siil/configuraciones/permisos/vikingo',
        component: VikingoPermisos,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/vikingo' }
      },


      {
        path: 'siil/configuraciones/roles/vikingo',
        component: VikingoRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/roles/vikingo' }
      },
            {
        path: 'siil/configuraciones/roles/karve',
        component: KarveRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/roles/karve' }
      },
            {
        path: 'siil/configuraciones/roles/letca',
        component: LetcaRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/permisos/letca' }
      },
      {
        path: 'siil/configuraciones/roles/drakkar',
        component: DrakkarRoles,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/configuraciones/roles/vikingo' }
      },

      {
        path: 'siil/letca/trafico/programaciondeviajes',
        component: ProgramacionViajesLetca,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/letca/trafico/programaciondeviajes' }
      },
      {
        path: 'siil/drakkar/trafico/programaciondeviajes',
        component: ProgramacionViajesDrakkar,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/drakkar/trafico/programaciondeviajes' }
      },

      {
        path: 'siil/vikingo/trafico/catalogo/ejecutivos',
        component: EjecutivosVikingo,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/vikingo/trafico/catalogo/ejecutivos' }

      },

      {
        path: 'siil/vikingo/dashboard',
        component: AcumuladoGraficoBarra,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/vikingo/dashboard' }
      },

      {
        path: 'siil/drakkar/dashboard',
        component: AcumuladosDrakkar,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/drakkar/dashboard' }

      },
      {
        path: 'siil/karve/dashboard',
        component: AcumuladoKarve,
        canActivate: [authGuard],
        data: { rutaModulo: 'siil/karve/dashboard' }
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
