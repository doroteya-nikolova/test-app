import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InactivePillComponent } from './components/inactive-pill.component/inactive-pill.component';
import { PrimaryPillComponent } from './components/primary-pill/primary-pill.component';
import { MaterialModule } from './material/material.module';
import { CustomErrorComponent } from './components/custom-input-error/custom-input-error.component';


export const COMPONENTS = [
  InactivePillComponent,
  PrimaryPillComponent,
  CustomErrorComponent
];

@NgModule({
  imports: [
    CommonModule,
    MaterialModule
  ],
  declarations: [...COMPONENTS],
  exports: [...COMPONENTS, MaterialModule],
})
export class SharedModule { }
