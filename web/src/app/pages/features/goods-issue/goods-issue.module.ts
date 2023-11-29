import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoodsIssueComponent } from './goods-issue.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { GoodsIssueFormComponent } from './goods-issue-form/goods-issue-form.component';
import { GoodsIssueDetailsComponent } from './goods-issue-details/goods-issue-details.component';
import { GoodsIssueItemComponent } from './goods-issue-items/goods-issue-items.component';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: '/goods-issue/pending'
  },
  {
    path: 'pending',
    pathMatch: 'full',
    component: GoodsIssueComponent,
    data: { title: "Goods Issue", tab: 0 }
  },
  {
    path: 'completed',
    pathMatch: 'full',
    component: GoodsIssueComponent,
    data: { title: "Goods Issue", tab: 1 }
  },
  {
    path: 'rejected',
    pathMatch: 'full',
    component: GoodsIssueComponent,
    data: { title: "Goods Issue", tab: 2 }
  },
  {
    path: 'cancelled',
    pathMatch: 'full',
    component: GoodsIssueComponent,
    data: { title: "Goods Issue", tab: 3 }
  },
  {
    path: 'new',
    component: GoodsIssueDetailsComponent,
    data: { title: "Goods Issue", details: true, isNew: true}
  },
  {
    path: ':goodsIssueCode/details',
    component: GoodsIssueDetailsComponent,
    data: { title: "Goods Issue", details: true }
  },
  {
    path: ':goodsIssueCode/edit',
    component: GoodsIssueDetailsComponent,
    data: { title: "Goods Issue", details: true, edit: true }
  }
];


@NgModule({
  declarations: [
    GoodsIssueComponent,
    GoodsIssueDetailsComponent,
    GoodsIssueFormComponent,
    GoodsIssueItemComponent,
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
export class GoodsIssueModule { }
