import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryMasterlistComponent } from './inventory-masterlist.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
export const routes: Routes = [
  {
    path: '',
    component: InventoryMasterlistComponent,
    pathMatch: 'full',
    data: { title: "Inventory Masterlist" }
  }
];


@NgModule({
  declarations: [
    InventoryMasterlistComponent
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
export class InventoryMasterlistModule { }
