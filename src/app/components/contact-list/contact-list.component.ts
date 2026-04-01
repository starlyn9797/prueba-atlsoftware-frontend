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
  templateUrl: './contact-list.component.html',
  styleUrl: './contact-list.component.css'
})
export class ContactListComponent implements OnInit {
  private readonly contactService = inject(ContactService);
  private readonly router = inject(Router);
  private readonly searchSubject = new BehaviorSubject<string>('');

  searchTerm = '';
  showDeleteDialog = false;
  private deleteTargetId: number | null = null;

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
    if (this.deleteTargetId === null) return;
    this.contactService.delete(this.deleteTargetId);
    this.showDeleteDialog = false;
    this.deleteTargetId = null;
  }
}
