import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdjustmentConfirmationComponent } from './adjustment-confirmation.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { AdjustmentConfirmationFormComponent } from './adjustment-confirmation-form/adjustment-confirmation-form.component';
import { AdjustmentConfirmationDetailsComponent } from './adjustment-confirmation-details/adjustment-confirmation-details.component';
import { AdjustmentConfirmationItemComponent } from './adjustment-confirmation-items/adjustment-confirmation-items.component';
import { AdjustmentConfirmationClosedComponent } from './adjustment-confirmation-closed/adjustment-confirmation-closed.component';
// import { AdjustmentConfirmationClosedComponent } from './inventory-adjustment-report-closed/inventory-adjustment-report-closed.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/adjustment-confirmation/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: AdjustmentConfirmationComponent,
    data: { title: "Adjustment Confirmation", tab: 0 }
  },
  {
    path: 'reviewed',
    pathMatch: 'full',
    component: AdjustmentConfirmationComponent,
    data: { title: "Adjustment Confirmation", tab: 1 }
  },
  {
    path: 'completed',
    pathMatch: 'full',
    component: AdjustmentConfirmationComponent,
    data: { title: "Adjustment Confirmation", tab: 2 }
  },
  {
    path: 'closed-report',
    pathMatch: 'full',
    redirectTo: '/adjustment-confirmation/closed-report/closed'
  },
  {
    path: 'closed-report/closed',
    pathMatch: 'full',
    component: AdjustmentConfirmationClosedComponent,
    data: { title: "Closed Report", tab: 0 }
  },
  {
    path: 'closed-report/rejected',
    pathMatch: 'full',
    component: AdjustmentConfirmationClosedComponent,
    data: { title: "Closed Report", tab: 1 }
  },
  {
    path: 'new',
    component: AdjustmentConfirmationDetailsComponent,
    data: { title: "Adjustment Confirmation", details: true, isNew: true}
  },
  {
    path: 'new/:inventoryRequestCode',
    component: AdjustmentConfirmationDetailsComponent,
    data: { title: "Adjustment Confirmation", details: true, isNew: true}
  },
  {
    path: ':inventoryAdjustmentReportCode/details',
    component: AdjustmentConfirmationDetailsComponent,
    data: { title: "Adjustment Confirmation", details: true }
  },
  {
    path: ':inventoryAdjustmentReportCode/edit',
    component: AdjustmentConfirmationDetailsComponent,
    data: { title: "Adjustment Confirmation", details: true, edit: true }
  },
  {
    path: 'closed-report/:inventoryAdjustmentReportCode/details',
    component: AdjustmentConfirmationDetailsComponent,
    data: { title: "Adjustment Confirmation", details: true }
  },
];


@NgModule({
  declarations: [
    AdjustmentConfirmationComponent,
    AdjustmentConfirmationDetailsComponent,
    AdjustmentConfirmationFormComponent,
    AdjustmentConfirmationItemComponent,
    AdjustmentConfirmationClosedComponent,
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
export class AdjustmentConfirmationModule { }
