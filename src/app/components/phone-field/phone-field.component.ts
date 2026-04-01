import { Component, input, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup } from '@angular/forms';
import { PHONE_LABELS } from '../../models/contact.model';

@Component({
  selector: 'app-phone-field',
  imports: [ReactiveFormsModule],
  templateUrl: './phone-field.component.html',
  styleUrl: './phone-field.component.css'
})
export class PhoneFieldComponent {
  readonly phoneGroup = input.required<FormGroup>();
  readonly index = input.required<number>();
  readonly remove = output<number>();
  readonly labels = PHONE_LABELS;
}
