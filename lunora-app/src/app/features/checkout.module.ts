import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared/shared.module';
import { CheckoutComponent } from '../shared/components/checkout.component/checkout.component';

@NgModule({
  declarations: [

  ],
  imports: [    
    CommonModule,
    CheckoutComponent,
    RouterModule.forChild([{ path: '', component: CheckoutComponent }]),
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ]
})
export class CheckoutModule { }