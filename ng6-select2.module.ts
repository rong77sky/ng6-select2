import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Select2Component} from './select2/select2.component';
export { Select2Component } from './select2/select2.component';
export { Select2OptionData } from './select2/select2.interface';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [Select2Component],
  exports: [Select2Component]
})
export class Ng6Select2Module { }
