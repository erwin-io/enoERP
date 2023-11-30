import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesInvoiceComponent } from './sales-invoice.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { SalesInvoiceFormComponent } from './sales-invoice-form/sales-invoice-form.component';
import { SalesInvoiceDetailsComponent } from './sales-invoice-details/sales-invoice-details.component';
import { SalesInvoiceItemComponent } from './sales-invoice-items/sales-invoice-items.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: SalesInvoiceComponent,
    data: { title: "Sales Invoice" }
  },
  {
    path: 'void',
    pathMatch: 'full',
    component: SalesInvoiceComponent,
    data: { title: "Sales Invoice", showVoid: true }
  },
  {
    path: 'new',
    component: SalesInvoiceDetailsComponent,
    data: { title: "Sales Invoice", details: true, isNew: true}
  },
  {
    path: ':salesInvoiceCode/details',
    component: SalesInvoiceDetailsComponent,
    data: { title: "Sales Invoice", details: true }
  }
];


@NgModule({
  declarations: [
    SalesInvoiceComponent,
    SalesInvoiceDetailsComponent,
    SalesInvoiceFormComponent,
    SalesInvoiceItemComponent,
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
export class SalesInvoiceModule { }
