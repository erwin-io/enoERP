import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRequestRateComponent } from './inventory-request-rate.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { InventoryRequestRateFormComponent } from './inventory-request-rate-form/inventory-request-rate-form.component';
import { InventoryRequestRateDetailsComponent } from './inventory-request-rate-details/inventory-request-rate-details.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryRequestRateComponent,
    pathMatch: 'full',
    data: { title: "Inventory Request Rate" }
  },
  {
    path: 'find/:itemCode',
    component: InventoryRequestRateComponent,
    data: { title: "Inventory Request Rate", find: true }
  },
  {
    path: 'add',
    component: InventoryRequestRateDetailsComponent,
    data: { title: "Inventory Request Rate", details: true, isNew: true}
  },
  {
    path: ':inventoryRequestRateCode',
    component: InventoryRequestRateDetailsComponent,
    data: { title: "Inventory Request Rate", details: true }
  },
  {
    path: ':inventoryRequestRateCode/edit',
    component: InventoryRequestRateDetailsComponent,
    data: { title: "Inventory Request Rate", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    InventoryRequestRateComponent,
    InventoryRequestRateDetailsComponent,
    InventoryRequestRateFormComponent,
  ],
  imports: [
    CommonModule,
    FlexLayoutModule,
    MaterialModule,
    NgxSkeletonLoaderModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule.forChild(routes),
    DataTableModule,
  ]
})
export class InventoryRequestRateModule { }
