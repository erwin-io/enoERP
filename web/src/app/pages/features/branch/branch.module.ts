import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BranchComponent } from './branch.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { DataTableModule } from 'src/app/shared/data-table/data-table.module';
import { BranchFormComponent } from './branch-form/branch-form.component';
import { BranchDetailsComponent } from './branch-details/branch-details.component';

export const routes: Routes = [
  {
    path: '',
    component: BranchComponent,
    pathMatch: 'full',
    data: { title: "Branch" }
  },
  {
    path: 'add',
    component: BranchDetailsComponent,
    data: { title: "New Branch", details: true, isNew: true}
  },
  {
    path: ':branchId',
    component: BranchDetailsComponent,
    data: { title: "Branch", details: true }
  },
  {
    path: ':branchId/edit',
    component: BranchDetailsComponent,
    data: { title: "Branch", details: true, edit: true }
  },
];


@NgModule({
  declarations: [
    BranchComponent,
    BranchDetailsComponent,
    BranchFormComponent
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
export class BranchModule { }
