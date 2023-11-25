import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsReceiptComponent } from './goods-receipt.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { GoodsReceiptFormComponent } from './goods-receipt-form/goods-receipt-form.component';
import { GoodsReceiptDetailsComponent } from './goods-receipt-details/goods-receipt-details.component';
import { GoodsReceiptItemComponent } from './goods-receipt-items/goods-receipt-items.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/goods-receipt/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: GoodsReceiptComponent,
    data: { title: "Goods Receipt", tab: 0 }
  },
  {
    path: 'completed',
    pathMatch: 'full',
    component: GoodsReceiptComponent,
    data: { title: "Goods Receipt", tab: 1 }
  },
  {
    path: 'rejected',
    pathMatch: 'full',
    component: GoodsReceiptComponent,
    data: { title: "Goods Receipt", tab: 2 }
  },
  {
    path: 'cancelled',
    pathMatch: 'full',
    component: GoodsReceiptComponent,
    data: { title: "Goods Receipt", tab: 3 }
  },
  {
    path: 'new',
    component: GoodsReceiptDetailsComponent,
    data: { title: "Goods Receipt", details: true, isNew: true}
  },
  {
    path: ':goodsReceiptCode/details',
    component: GoodsReceiptDetailsComponent,
    data: { title: "Goods Receipt", details: true }
  },
  {
    path: ':goodsReceiptCode/edit',
    component: GoodsReceiptDetailsComponent,
    data: { title: "Goods Receipt", details: true, edit: true }
  }
];


@NgModule({
  declarations: [
    GoodsReceiptComponent,
    GoodsReceiptDetailsComponent,
    GoodsReceiptFormComponent,
    GoodsReceiptItemComponent,
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
export class GoodsReceiptModule { }
