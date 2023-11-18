import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from './item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { ItemFormComponent } from './item-form/item-form.component';
import { ItemDetailsComponent } from './item-details/item-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ItemComponent,
    pathMatch: 'full',
    data: { title: "Item" }
  },
  {
    path: 'add',
    component: ItemDetailsComponent,
    data: { title: "New Item", details: true, isNew: true}
  },
  {
    path: ':itemId',
    component: ItemDetailsComponent,
    data: { title: "Item", details: true }
  },
  {
    path: ':itemId/edit',
    component: ItemDetailsComponent,
    data: { title: "Item", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    ItemComponent,
    ItemDetailsComponent,
    ItemFormComponent
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
export class ItemModule { }
