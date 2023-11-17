import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RegisterComponent } from './register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { NgApexchartsModule } from 'ng-apexcharts';
import { MaterialModule } from 'src/app/shared/material/material.module';

export const routes: Routes = [
  {
    path: '',
    component: RegisterComponent,
    pathMatch: 'full'
  }
];


@NgModule({
  declarations: [
    RegisterComponent
  ],
  imports: [
    CommonModule,
    MaterialModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
  ]
})
export class RegisterModule { }
