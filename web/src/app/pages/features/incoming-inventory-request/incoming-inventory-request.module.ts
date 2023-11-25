import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncomingInventoryRequestComponent } from './incoming-inventory-request.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { IncomingInventoryRequestDetailsComponent } from './incoming-inventory-request-details/incoming-inventory-request-details.component';
import { IncomingInventoryRequestFormComponent } from './incoming-inventory-request-form/incoming-inventory-request-form.component';
import { IncomingInventoryRequestItemComponent } from './incoming-inventory-request-items/incoming-inventory-request-items.component';
import { IncomingInventoryRequestClosedComponent } from './incoming-inventory-request-closed/incoming-inventory-request-closed.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/incoming-inventory-request/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: IncomingInventoryRequestComponent,
    data: { title: "Incoming Inventory Request", tab: 0 }
  },
  {
    path: 'processing',
    pathMatch: 'full',
    component: IncomingInventoryRequestComponent,
    data: { title: "Incoming Inventory Request", tab: 1 }
  },
  {
    path: 'in-transit',
    pathMatch: 'full',
    component: IncomingInventoryRequestComponent,
    data: { title: "Incoming Inventory Request", tab: 2 }
  },
  {
    path: 'closed-request',
    pathMatch: 'full',
    redirectTo: '/incoming-inventory-request/closed-request/completed'
  },
  {
    path: 'closed-request/completed',
    pathMatch: 'full',
    component: IncomingInventoryRequestClosedComponent,
    data: { title: "Closed Request", tab: 0 }
  },
  {
    path: 'closed-request/rejected',
    pathMatch: 'full',
    component: IncomingInventoryRequestClosedComponent,
    data: { title: "Closed Request", tab: 1 }
  },
  {
    path: 'closed-request/cancelled',
    pathMatch: 'full',
    component: IncomingInventoryRequestClosedComponent,
    data: { title: "Closed Request", tab: 2 }
  },
  {
    path: ':inventoryRequestCode/details',
    component: IncomingInventoryRequestDetailsComponent,
    data: { title: "Incoming Inventory Request", details: true }
  },
  {
    path: ':inventoryRequestCode/edit',
    component: IncomingInventoryRequestDetailsComponent,
    data: { title: "Incoming Inventory Request", details: true, edit: true }
  },
  {
    path: 'closed-request/:inventoryRequestCode/details',
    component: IncomingInventoryRequestDetailsComponent,
    data: { title: "Incoming Inventory Request", details: true }
  },
];


@NgModule({
  declarations: [
    IncomingInventoryRequestComponent,
    IncomingInventoryRequestDetailsComponent,
    IncomingInventoryRequestFormComponent,
    IncomingInventoryRequestItemComponent,
    IncomingInventoryRequestClosedComponent
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
export class IncomingInventoryRequestModule { }
