import { Component, computed } from '@angular/core';
import { injectErrorField } from 'src/app/signals/signals-form';

@Component({
  selector: 'custom-signal-input-error',
  templateUrl: './custom-input-error.component.html'
})
export class CustomErrorComponent {
  private _formField = injectErrorField();
  touchedState = this._formField.touchedState;
  errors = this._formField.errors;

  errorMessages = computed(() =>
    Object.values(this.errors() ?? {}).map(
      (error: any) => error.message ?? 'Field invalid'
    )
  );
}
