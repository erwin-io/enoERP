import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryRequestComponent } from './inventory-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { InventoryRequestFormComponent } from './inventory-request-form/inventory-request-form.component';
import { InventoryRequestDetailsComponent } from './inventory-request-details/inventory-request-details.component';
import { InventoryRequestItemComponent } from './inventory-request-items/inventory-request-items.component';

export const routes: Routes = [
  {
    path: '',
    component: InventoryRequestComponent,
    pathMatch: 'full',
    data: { title: "Inventory Request" }
  },
  {
    path: 'new',
    component: InventoryRequestDetailsComponent,
    data: { title: "Add Inventory Request", details: true, isNew: true}
  },
  {
    path: ':inventoryRequestCode',
    component: InventoryRequestDetailsComponent,
    data: { title: "Inventory Request", details: true }
  },
  {
    path: ':inventoryRequestCode/edit',
    component: InventoryRequestDetailsComponent,
    data: { title: "Inventory Request", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    InventoryRequestComponent,
    InventoryRequestDetailsComponent,
    InventoryRequestFormComponent,
    InventoryRequestItemComponent
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
export class InventoryRequestModule { }
