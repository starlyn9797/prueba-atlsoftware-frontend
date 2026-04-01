import { Component, input, output } from '@angular/core';
import { Contact, PhoneLabel, PHONE_LABELS } from '../../models/contact.model';

const ICON_MAP = new Map(PHONE_LABELS.map(l => [l.value, l.icon]));

@Component({
  selector: 'app-contact-card',
  templateUrl: './contact-card.component.html',
  styleUrl: './contact-card.component.css'
})
export class ContactCardComponent {
  readonly contact = input.required<Contact>();
  readonly edit = output<number>();
  readonly delete = output<number>();

  initials(): string {
    const c = this.contact();
    return ((c.firstName?.[0] ?? '') + (c.lastName?.[0] ?? '')).toUpperCase();
  }

  labelIcon(label: PhoneLabel): string {
    return ICON_MAP.get(label) ?? '📞';
  }
}
