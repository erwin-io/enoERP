import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WarehouseInventoryComponent } from './warehouse-inventory.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
export const routes: Routes = [
  {
    path: '',
    component: WarehouseInventoryComponent,
    pathMatch: 'full',
    data: { title: "Warehouse Inventory" }
  }
];


@NgModule({
  declarations: [
    WarehouseInventoryComponent
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
export class WarehouseInventoryModule { }
