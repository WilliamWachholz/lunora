import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; 
import { LoadingSpinnerComponent } from './components/loading-spinner.component/loading-spinner.component';
import { PricePipe } from './pipes/price.pipe'; 
import { ToastrModule } from 'ngx-toastr';

@NgModule({ 
  imports: [
    CommonModule,
    RouterModule,    
    LoadingSpinnerComponent,
    PricePipe,
    ToastrModule
    //MaterialModule
  ],
  exports: [
    LoadingSpinnerComponent,
    PricePipe,
    ToastrModule
    //MaterialModule
  ]
})
export class SharedModule { }