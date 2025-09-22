import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CartComponent } from '../shared/components/cart.component/cart.component';

@NgModule({
  declarations: [

  ],
  imports: [    
    CommonModule,
    CartComponent,
    RouterModule.forChild([{ path: '', component: CartComponent }]),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CartModule { }