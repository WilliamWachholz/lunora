import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ProductListComponent } from '../shared/components/product-list.component/product-list.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailsComponent } from '../shared/components/product-details.component/product-details.component';

@NgModule({
  declarations: [
     
  ],
  imports: [
    ProductListComponent,
    ProductDetailsComponent,
    CommonModule,
    RouterModule.forChild([
      { path: '', component: ProductListComponent },
      { path: ':id', component: ProductDetailsComponent }
    ]),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class ProductsModule { }