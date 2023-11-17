import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemCategoryComponent } from './item-category.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { ItemCategoryFormComponent } from './item-category-form/item-category-form.component';
import { ItemCategoryDetailsComponent } from './item-category-details/item-category-details.component';

export const routes: Routes = [
  {
    path: '',
    component: ItemCategoryComponent,
    pathMatch: 'full',
    data: { title: "Item Category" }
  },
  {
    path: 'add',
    component: ItemCategoryDetailsComponent,
    data: { title: "Add Item Category", details: true, isNew: true}
  },
  {
    path: ':itemCategoryId',
    component: ItemCategoryDetailsComponent,
    data: { title: "Item Category", details: true }
  },
  {
    path: ':itemCategoryId/edit',
    component: ItemCategoryDetailsComponent,
    data: { title: "Item Category", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    ItemCategoryComponent,
    ItemCategoryDetailsComponent,
    ItemCategoryFormComponent
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
export class ItemCategoryModule { }
