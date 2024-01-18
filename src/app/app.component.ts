import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  headerMenu = [
    {
      path: '/ngrx-forms',
      label: 'Ngrx-forms',
    },
    {
      path: '/form-services',
      label: 'Form Services',
    },
    {
      path: '/signals',
      label: 'Signals',
    },
  ];
}
