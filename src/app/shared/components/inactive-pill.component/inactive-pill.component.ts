import { Component, Input } from '@angular/core';

export type HaloInActivePillColor = 'primary' | 'danger';

@Component({
  selector: 'halo-inactive-pill',
  templateUrl: './inactive-pill.component.html',
  styleUrls: ['./inactive-pill.component.scss'],
})
export class InactivePillComponent {
  @Input()
  haloPillColor: HaloInActivePillColor = 'primary';
}
