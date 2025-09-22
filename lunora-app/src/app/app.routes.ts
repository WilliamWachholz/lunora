import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';
import { OrderConfirmationComponent } from './shared/components/order-confirmation.component/order-confirmation.component';
import { OrderListComponent } from './shared/components/order-list.component/order-list.component';

export  const routes: Routes = [
  { path: '', redirectTo: '/products', pathMatch: 'full' },
  { 
    path: 'products', 
    loadChildren: () => import('./features/product.module').then(m => m.ProductsModule)     
  },
  { 
    path: 'cart', 
    loadChildren: () => import('./features/cart.module').then(m => m.CartModule)     
  },
  { 
    path: 'checkout', 
    loadChildren: () => import('./features/checkout.module').then(m => m.CheckoutModule),
    canActivate: [AuthGuard]
  },
  { 
    path: 'auth', 
    loadChildren: () => import('./features/auth.module').then(m => m.AuthModule) 
  },
  { 
    path: 'order-confirmation', 
    component: OrderConfirmationComponent
  },
  { 
    path: 'order-list', 
    component: OrderListComponent
  },
//   { 
//     path: 'admin', 
//     loadChildren: () => import('./features/admin/admin.module').then(m => m.AdminModule),
//     canActivate: [AuthGuard, AdminGuard]
//   },
//   { 
//     path: 'profile', 
//     loadChildren: () => import('./features/user/user.module').then(m => m.UserModule),
//     canActivate: [AuthGuard]
//   },
  { path: '**', redirectTo: '' }
];
