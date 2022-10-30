import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ROUTES } from '@routing/routes';

const CUSTOM_ROUTES: Routes = [
  { path: '', redirectTo: '/tables', pathMatch: 'full' },
];
@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES.concat(CUSTOM_ROUTES)), //, { enableTracing: true }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
