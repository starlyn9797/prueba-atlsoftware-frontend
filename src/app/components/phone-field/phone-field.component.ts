import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-phone-field',
  imports: [ReactiveFormsModule],
  template: `
    <div class="phone-row" [formGroup]="phoneGroup()">
      <input formControlName="phoneNumber" placeholder="+1234567890" type="tel">
      <select formControlName="label">
        <option value="mobile">Móvil</option>
        <option value="work">Trabajo</option>
        <option value="home">Casa</option>
      </select>
      <button type="button" class="btn-remove" (click)="remove.emit(index())" title="Eliminar teléfono">✕</button>
    </div>
    @if (phoneGroup().get('phoneNumber')?.invalid && phoneGroup().get('phoneNumber')?.touched) {
      <span class="error">Teléfono requerido</span>
    }
  `,
  styles: `
    .phone-row {
      display: flex;
      gap: 0.5rem;
      align-items: center;
    }
    input {
      flex: 1;
    }
    select {
      width: 120px;
    }
    .btn-remove {
      width: 34px;
      height: 34px;
      background: hsla(0, 70%, 55%, 0.15);
      color: var(--danger);
      border-radius: var(--radius-sm);
      font-size: 0.75rem;
      display: grid;
      place-items: center;
      flex-shrink: 0;
    }
    .btn-remove:hover {
      background: hsla(0, 70%, 55%, 0.3);
    }
    .error {
      color: var(--danger);
      font-size: 0.75rem;
      margin-top: 0.125rem;
    }
  `
})
export class PhoneFieldComponent {
  readonly phoneGroup = input.required<FormGroup>();
  readonly index = input.required<number>();
  readonly remove = output<number>();
}
