// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Project import
import { AdminComponent } from './theme/layouts/admin-layout/admin-layout.component';
import { GuestComponent } from './theme/layouts/guest/guest.component';
const routes: Routes = [
  {
    path: '',
    component: AdminComponent,
    children: [
      {
        path: '',
        redirectTo: '/dashboard/default',
        pathMatch: 'full'
      },
      {
        path: 'dashboard/default',
        loadComponent: () => import('./demo/default/dashboard/dashboard.component').then((c) => c.DefaultComponent)
      },
      {
        path: 'typography',
        loadComponent: () => import('./demo/ui-component/typography/typography.component')
      },
      {
        path: 'color',
        loadComponent: () => import('./demo/ui-component/ui-color/ui-color.component')
      },
      {
        path: 'chart',
        loadComponent: () => import('./demo/charts/charts.component').then(m => m.ChartsComponent)
      },
      {
        path: 'revenues',
        loadComponent: () => import('./demo/revenues/revenues.component').then(m => m.RevenuesComponent)
      },

      {
        path: 'finance',
        loadComponent: () => import('./demo/finance/finance.component').then(m => m.FinanceComponent)
      },
      {
        path: 'accounts',
        loadComponent: () => import('./demo/accounts/accounts.component').then(m => m.AccountsComponent)
      },
      {
        path: 'task',
        loadComponent: () => import('./demo/task/task.component').then(m => m.TaskComponent)
      },
      {
        path: 'users',
        loadComponent: () => import('./demo/users/users.component').then(m => m.UsersComponent)
      },
      {
        path: 'confirme-task/:id',
        loadComponent: () => import('./demo/confirme-task/confirme-task.component').then(m => m.ConfirmeTaskComponent)
      },
      {
        path: 'rapports',
        loadComponent: () => import('./demo/rapports/rapports.component').then(m => m.RapportsComponent)
      },
      {
        path: 'create-rapport',
        loadComponent: () => import('./demo/rapports/create-rapport/create-rapport.component').then(m => m.CreateRapportComponent)
      },
      
      {
        path: 'rapports/:id',
        loadComponent: () => import('./demo/rapports/rapport-detail/rapport-detail.component').then(m => m.RapportDetailComponent)
      },
      {
        path: 'agents',
        loadComponent: () => import('./demo/agents/agents-list/agents-list.component').then(m => m.AgentsListComponent)
      },
      {
        path: 'sample-page',
        loadComponent: () => import('./demo/other/sample-page/sample-page.component')
      }
    ]
  },
  {
    path: '',
    component: GuestComponent,
    children: [
      {
        path: 'login',
        loadComponent: () => import('./demo/authentication/login/login.component')
      },
      {
        path: 'register',
        loadComponent: () => import('./demo/authentication/register/register.component')
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
