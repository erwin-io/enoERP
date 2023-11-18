import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseComponent } from './warehouse.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { WarehouseFormComponent } from './warehouse-form/warehouse-form.component';
import { WarehouseDetailsComponent } from './warehouse-details/warehouse-details.component';

export const routes: Routes = [
  {
    path: '',
    component: WarehouseComponent,
    pathMatch: 'full',
    data: { title: "Warehouse" }
  },
  {
    path: 'add',
    component: WarehouseDetailsComponent,
    data: { title: "New Warehouse", details: true, isNew: true}
  },
  {
    path: ':warehouseId',
    component: WarehouseDetailsComponent,
    data: { title: "Warehouse", details: true }
  },
  {
    path: ':warehouseId/edit',
    component: WarehouseDetailsComponent,
    data: { title: "Warehouse", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    WarehouseComponent,
    WarehouseDetailsComponent,
    WarehouseFormComponent
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
export class WarehouseModule { }
