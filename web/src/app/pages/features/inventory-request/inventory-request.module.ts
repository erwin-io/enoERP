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
import { InventoryRequestRateSelectComponent } from './inventory-request-items/inventory-request-rate-select/inventory-request-rate-select.component';
import { InventoryRequestClosedComponent } from './inventory-request-closed/inventory-request-closed.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/inventory-request/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: InventoryRequestComponent,
    data: { title: "Inventory Request", tab: 0 }
  },
  {
    path: 'processing',
    pathMatch: 'full',
    component: InventoryRequestComponent,
    data: { title: "Inventory Request", tab: 1 }
  },
  {
    path: 'in-transit',
    pathMatch: 'full',
    component: InventoryRequestComponent,
    data: { title: "Inventory Request", tab: 2 }
  },
  {
    path: 'closed-request',
    pathMatch: 'full',
    redirectTo: '/inventory-request/closed-request/completed'
  },
  {
    path: 'closed-request/completed',
    pathMatch: 'full',
    component: InventoryRequestClosedComponent,
    data: { title: "Closed Request", tab: 0 }
  },
  {
    path: 'closed-request/rejected',
    pathMatch: 'full',
    component: InventoryRequestClosedComponent,
    data: { title: "Closed Request", tab: 1 }
  },
  {
    path: 'closed-request/cancelled',
    pathMatch: 'full',
    component: InventoryRequestClosedComponent,
    data: { title: "Closed Request", tab: 2 }
  },
  {
    path: 'new',
    component: InventoryRequestDetailsComponent,
    data: { title: "Inventory Request", details: true, isNew: true}
  },
  {
    path: ':inventoryRequestCode/details',
    component: InventoryRequestDetailsComponent,
    data: { title: "Inventory Request", details: true }
  },
  {
    path: ':inventoryRequestCode/edit',
    component: InventoryRequestDetailsComponent,
    data: { title: "Inventory Request", details: true, edit: true }
  },
  {
    path: 'closed-request/:inventoryRequestCode/details',
    component: InventoryRequestDetailsComponent,
    data: { title: "Inventory Request", details: true }
  },
];


@NgModule({
  declarations: [
    InventoryRequestComponent,
    InventoryRequestDetailsComponent,
    InventoryRequestFormComponent,
    InventoryRequestItemComponent,
    InventoryRequestRateSelectComponent,
    InventoryRequestClosedComponent
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
