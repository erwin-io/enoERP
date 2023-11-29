import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventoryAdjustmentReportComponent } from './inventory-adjustment-report.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { InventoryAdjustmentReportFormComponent } from './inventory-adjustment-report-form/inventory-adjustment-report-form.component';
import { InventoryAdjustmentReportDetailsComponent } from './inventory-adjustment-report-details/inventory-adjustment-report-details.component';
import { InventoryAdjustmentReportItemComponent } from './inventory-adjustment-report-items/inventory-adjustment-report-items.component';
import { InventoryAdjustmentReportClosedComponent } from './inventory-adjustment-report-closed/inventory-adjustment-report-closed.component';
import { InventoryAdjustmentReportRequestSelectComponent } from './inventory-adjustment-report-details/inventory-adjustment-report-request-select/inventory-adjustment-report-request-select.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/inventory-adjustment-report/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: InventoryAdjustmentReportComponent,
    data: { title: "Inventory Adjustment Report", tab: 0 }
  },
  {
    path: 'reviewed',
    pathMatch: 'full',
    component: InventoryAdjustmentReportComponent,
    data: { title: "Inventory Adjustment Report", tab: 1 }
  },
  {
    path: 'completed',
    pathMatch: 'full',
    component: InventoryAdjustmentReportComponent,
    data: { title: "Inventory Adjustment Report", tab: 2 }
  },
  {
    path: 'closed-report',
    pathMatch: 'full',
    redirectTo: '/inventory-adjustment-report/closed-report/closed'
  },
  {
    path: 'closed-report/closed',
    pathMatch: 'full',
    component: InventoryAdjustmentReportClosedComponent,
    data: { title: "Closed Report", tab: 0 }
  },
  {
    path: 'closed-report/rejected',
    pathMatch: 'full',
    component: InventoryAdjustmentReportClosedComponent,
    data: { title: "Closed Report", tab: 1 }
  },
  {
    path: 'closed-report/cancelled',
    pathMatch: 'full',
    component: InventoryAdjustmentReportClosedComponent,
    data: { title: "Closed Report", tab: 2 }
  },
  {
    path: 'new',
    component: InventoryAdjustmentReportDetailsComponent,
    data: { title: "Inventory Adjustment Report", details: true, isNew: true}
  },
  {
    path: 'new/:inventoryRequestCode',
    component: InventoryAdjustmentReportDetailsComponent,
    data: { title: "Inventory Adjustment Report", details: true, isNew: true}
  },
  {
    path: ':inventoryAdjustmentReportCode/details',
    component: InventoryAdjustmentReportDetailsComponent,
    data: { title: "Inventory Adjustment Report", details: true }
  },
  {
    path: ':inventoryAdjustmentReportCode/edit',
    component: InventoryAdjustmentReportDetailsComponent,
    data: { title: "Inventory Adjustment Report", details: true, edit: true }
  },
  {
    path: 'closed-report/:inventoryAdjustmentReportCode/details',
    component: InventoryAdjustmentReportDetailsComponent,
    data: { title: "Inventory Adjustment Report", details: true }
  },
];


@NgModule({
  declarations: [
    InventoryAdjustmentReportComponent,
    InventoryAdjustmentReportDetailsComponent,
    InventoryAdjustmentReportFormComponent,
    InventoryAdjustmentReportItemComponent,
    InventoryAdjustmentReportClosedComponent,
    InventoryAdjustmentReportRequestSelectComponent
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
export class InventoryAdjustmentReportModule { }
