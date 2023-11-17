import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AuthGuard } from './guard/auth.guard';
import { ProfileComponent } from './pages/profile/profile.component';
import { FeaturesComponent } from './pages/features/features.component';
import { AuthComponent } from './auth/auth.component';;
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { NoAccessComponent } from './pages/no-access/no-access.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'auth', pathMatch: 'full', redirectTo: 'auth/login' },

  {
    path: 'profile',
    pathMatch: 'full',
    redirectTo: 'profile/edit-profile',
    title: 'Profile',
  },

  {
    path: '',
    component: FeaturesComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'dashboard',
        canActivate: [AuthGuard],
        data: { title: 'Dashboard' },
        loadChildren: () =>
          import('./pages/features/home/home.module').then(
            (m) => m.HomeModule
          ),
      },
      {
        path: 'item-category',
        canActivate: [AuthGuard],
        data: { title: 'Item Category', group: 'Configuration' },
        loadChildren: () =>
          import('./pages/features/item-category/item-category.module').then(
            (m) => m.ItemCategoryModule
          ),
      },
      {
        path: 'item',
        canActivate: [AuthGuard],
        data: { title: 'Item', group: 'Configuration' },
        loadChildren: () =>
          import('./pages/features/item/item.module').then(
            (m) => m.ItemModule
          ),
      },
      {
        path: 'warehouse',
        canActivate: [AuthGuard],
        data: { title: 'Warehouse', group: 'Configuration' },
        loadChildren: () =>
          import('./pages/features/warehouse/warehouse.module').then(
            (m) => m.WarehouseModule
          ),
      },
      {
        path: 'branch',
        canActivate: [AuthGuard],
        data: { title: 'Branch', group: 'Configuration' },
        loadChildren: () =>
          import('./pages/features/branch/branch.module').then(
            (m) => m.BranchModule
          ),
      },
      {
        path: 'access',
        canActivate: [AuthGuard],
        data: { title: 'Access', group: 'User Management' },
        loadChildren: () =>
          import('./pages/features/access/access.module').then(
            (m) => m.AccessModule
          ),
      },
      {
        path: 'users',
        canActivate: [AuthGuard],
        data: { title: 'Users', group: 'User Management' },
        loadChildren: () =>
          import('./pages/features/users/users.module').then((m) => m.UsersModule),
      },
    ],
  },
  {
    path: 'profile',
    component: ProfileComponent,
    children: [
      {
        path: 'edit-profile',
        loadChildren: () =>
          import('./pages/profile/edit-profile/edit-profile.module').then(
            (m) => m.EditProfileModule
          ),
      },
      {
        path: 'password-and-security',
        loadChildren: () =>
          import(
            './pages/profile/password-and-security/password-and-security.module'
          ).then((m) => m.PasswordAndSecurityModule),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      {
        path: 'login',
        loadChildren: () =>
          import('./auth/login/login.module').then((m) => m.LoginModule),
      },
      {
        path: 'register',
        loadChildren: () =>
          import('./auth/register/register.module').then(
            (m) => m.RegisterModule
          ),
      },
    ],
  },
  {
    path: 'no-access',
    component: NoAccessComponent,
  },
  {
    path: '**',
    component: PageNotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
