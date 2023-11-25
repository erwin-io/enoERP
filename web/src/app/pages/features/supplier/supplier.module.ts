import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SupplierComponent } from './supplier.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { SupplierFormComponent } from './supplier-form/supplier-form.component';
import { SupplierDetailsComponent } from './supplier-details/supplier-details.component';

export const routes: Routes = [
  {
    path: '',
    component: SupplierComponent,
    pathMatch: 'full',
    data: { title: "Supplier" }
  },
  {
    path: 'add',
    component: SupplierDetailsComponent,
    data: { title: "New Supplier", details: true, isNew: true}
  },
  {
    path: ':supplierCode',
    component: SupplierDetailsComponent,
    data: { title: "Supplier", details: true }
  },
  {
    path: ':supplierCode/edit',
    component: SupplierDetailsComponent,
    data: { title: "Supplier", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    SupplierComponent,
    SupplierDetailsComponent,
    SupplierFormComponent
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule
  ]
})
export class SupplierModule { }
