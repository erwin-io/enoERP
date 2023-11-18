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

export const routes: Routes = [
  {
    path: '',
    component: IncomingInventoryRequestComponent,
    pathMatch: 'full',
    data: { title: "Incoming Inventory Request" }
  },
  {
    path: ':inventoryRequestCode',
    component: IncomingInventoryRequestDetailsComponent,
    data: { title: "Incoming Inventory Request", details: true }
  },
  {
    path: ':inventoryRequestCode/edit',
    component: IncomingInventoryRequestDetailsComponent,
    data: { title: "Incoming Inventory Request", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    IncomingInventoryRequestComponent,
    IncomingInventoryRequestDetailsComponent,
    IncomingInventoryRequestFormComponent,
    IncomingInventoryRequestItemComponent
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
