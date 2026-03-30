import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ContactCardComponent } from '../contact-card/contact-card.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/contact.model';
import { Observable, map, combineLatest, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-contact-list',
  imports: [AsyncPipe, FormsModule, ContactCardComponent, ConfirmDialogComponent],
  template: `
    <div class="list-container">
      <div class="header">
        <h2>Contactos</h2>
        <button class="btn-add" (click)="onCreate()">+ Nuevo Contacto</button>
      </div>

      <input
        class="search"
        placeholder="Buscar por nombre o email..."
        [ngModel]="searchTerm"
        (ngModelChange)="onSearch($event)"
      >

      @if (filteredContacts$ | async; as contacts) {
        @if (contacts.length === 0) {
          <p class="empty">No se encontraron contactos</p>
        } @else {
          <div class="grid">
            @for (contact of contacts; track contact.id) {
              <app-contact-card
                [contact]="contact"
                (edit)="onEdit($event)"
                (delete)="onDeleteRequest($event)"
              />
            }
          </div>
        }
      }
    </div>

    <app-confirm-dialog
      [visible]="showDeleteDialog"
      title="Eliminar Contacto"
      message="¿Estás seguro de que deseas eliminar este contacto? Esta acción no se puede deshacer."
      (confirm)="onDeleteConfirm()"
      (cancel)="showDeleteDialog = false"
    />
  `,
  styles: `
    .list-container {
      animation: fadeIn 0.3s ease;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.25rem;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
    }
    .btn-add {
      padding: 0.5rem 1.25rem;
      background: var(--accent-gradient);
      color: white;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
    }
    .btn-add:hover {
      opacity: 0.9;
    }
    .search {
      width: 100%;
      margin-bottom: 1.25rem;
    }
    .grid {
      display: flex;
      flex-direction: column;
      gap: 0.625rem;
    }
    .empty {
      text-align: center;
      color: var(--text-muted);
      padding: 3rem 0;
      font-size: 0.875rem;
    }
  `
})
export class ContactListComponent implements OnInit {
  private readonly contactService = inject(ContactService);
  private readonly router = inject(Router);
  private readonly searchSubject = new BehaviorSubject<string>('');

  searchTerm = '';
  showDeleteDialog = false;
  private deleteTargetId = 0;

  filteredContacts$!: Observable<Contact[]>;

  ngOnInit(): void {
    this.contactService.loadContacts();
    this.filteredContacts$ = combineLatest([
      this.contactService.contacts$,
      this.searchSubject
    ]).pipe(
      map(([contacts, term]) => {
        if (!term.trim()) return contacts;
        const lower = term.toLowerCase();
        return contacts.filter(c =>
          c.firstName.toLowerCase().includes(lower) ||
          c.lastName.toLowerCase().includes(lower) ||
          c.email.toLowerCase().includes(lower)
        );
      })
    );
  }

  onSearch(term: string): void {
    this.searchTerm = term;
    this.searchSubject.next(term);
  }

  onCreate(): void {
    this.router.navigate(['/create']);
  }

  onEdit(id: number): void {
    this.router.navigate(['/edit', id]);
  }

  onDeleteRequest(id: number): void {
    this.deleteTargetId = id;
    this.showDeleteDialog = true;
  }

  onDeleteConfirm(): void {
    this.contactService.delete(this.deleteTargetId);
    this.showDeleteDialog = false;
  }
}
