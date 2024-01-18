import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', redirectTo: '/ngrx-forms', pathMatch: 'full' },
  {
    path: 'ngrx-forms',
    loadChildren: () => import('./ngrx-forms/ngrx-forms.module').then(m => m.NgrxFormModule),
  },
  {
    path: 'form-services',
    loadChildren: () => import('./form-service/form-service.module').then(m => m.FormServiceModule),
  },
  {
    path: 'signals',
    loadChildren: () => import('./signals/signals.module').then(m => m.SignalsModule),
  },
  { path: '**', redirectTo: '/ngrx-forms' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
