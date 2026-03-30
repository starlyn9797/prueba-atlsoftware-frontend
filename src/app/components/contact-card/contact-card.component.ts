import { Component, input, output } from '@angular/core';
import { Contact } from '../../models/contact.model';

@Component({
  selector: 'app-contact-card',
  template: `
    <div class="card">
      <div class="avatar">{{ initials() }}</div>
      <div class="info">
        <h3>{{ contact().firstName }} {{ contact().lastName }}</h3>
        <p class="email">{{ contact().email }}</p>
        <div class="phones">
          @for (phone of contact().phones; track phone.id) {
            <span class="phone-badge" [attr.data-label]="phone.label">
              {{ labelIcon(phone.label) }} {{ phone.phoneNumber }}
            </span>
          }
        </div>
      </div>
      <div class="actions">
        <button class="btn-edit" (click)="edit.emit(contact().id)" title="Editar">✎</button>
        <button class="btn-delete" (click)="delete.emit(contact().id)" title="Eliminar">🗑</button>
      </div>
    </div>
  `,
  styles: `
    .card {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 1rem 1.25rem;
      background: var(--bg-glass);
      border: 1px solid var(--border-glass);
      border-radius: var(--radius-md);
      backdrop-filter: blur(12px);
      transition: border-color var(--transition), transform var(--transition);
      animation: fadeIn 0.3s ease both;
    }
    .card:hover {
      border-color: var(--accent);
      transform: translateY(-2px);
    }
    .avatar {
      width: 44px;
      height: 44px;
      border-radius: 50%;
      background: var(--accent-gradient);
      display: grid;
      place-items: center;
      font-weight: 700;
      font-size: 0.875rem;
      color: white;
      flex-shrink: 0;
    }
    .info {
      flex: 1;
      min-width: 0;
    }
    h3 {
      font-size: 0.9375rem;
      font-weight: 600;
    }
    .email {
      color: var(--text-secondary);
      font-size: 0.8125rem;
    }
    .phones {
      display: flex;
      flex-wrap: wrap;
      gap: 0.375rem;
      margin-top: 0.375rem;
    }
    .phone-badge {
      font-size: 0.75rem;
      padding: 0.125rem 0.5rem;
      background: var(--bg-tertiary);
      border-radius: var(--radius-sm);
      color: var(--text-secondary);
    }
    .actions {
      display: flex;
      gap: 0.375rem;
      flex-shrink: 0;
    }
    .actions button {
      width: 34px;
      height: 34px;
      border-radius: var(--radius-sm);
      display: grid;
      place-items: center;
      font-size: 0.875rem;
    }
    .btn-edit {
      background: hsla(250, 80%, 65%, 0.15);
      color: var(--accent);
    }
    .btn-edit:hover {
      background: hsla(250, 80%, 65%, 0.3);
    }
    .btn-delete {
      background: hsla(0, 70%, 55%, 0.15);
      color: var(--danger);
    }
    .btn-delete:hover {
      background: hsla(0, 70%, 55%, 0.3);
    }
  `
})
export class ContactCardComponent {
  readonly contact = input.required<Contact>();
  readonly edit = output<number>();
  readonly delete = output<number>();

  initials(): string {
    const c = this.contact();
    return (c.firstName[0] + c.lastName[0]).toUpperCase();
  }

  labelIcon(label: string): string {
    const icons: Record<string, string> = { mobile: '📱', work: '💼', home: '🏠' };
    return icons[label] ?? '📞';
  }
}
