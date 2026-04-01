import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact, Phone } from '../models/contact.model';
import { StorageService } from './storage.service';

const STORAGE_KEY = 'contacts';

type ContactInput = {
  firstName: string;
  lastName: string;
  email: string;
  phones: Omit<Phone, 'id'>[];
};

@Injectable({ providedIn: 'root' })
export class ContactService {

  private readonly http = inject(HttpClient);
  private readonly storage = inject(StorageService);
  private readonly contactsSubject = new BehaviorSubject<Contact[]>([]);

  readonly contacts$: Observable<Contact[]> = this.contactsSubject.asObservable();

  loadContacts(): void {
    const stored = this.storage.get<Contact[]>(STORAGE_KEY);
    if (stored) {
      this.contactsSubject.next(stored);
      return;
    }
    this.http.get<Contact[]>('assets/data/contacts.json').subscribe(data => {
      this.storage.set(STORAGE_KEY, data);
      this.contactsSubject.next(data);
    });
  }

  getById(id: number): Contact | undefined {
    return this.contactsSubject.getValue().find(c => c.id === id);
  }

  create(input: ContactInput): void {
    const contacts = this.contactsSubject.getValue();
    const maxId = contacts.reduce((max, c) => Math.max(max, c.id), 0);
    const newContact: Contact = {
      ...input,
      id: maxId + 1,
      phones: this.assignPhoneIds(input.phones)
    };
    this.save([...contacts, newContact]);
  }

  update(id: number, changes: ContactInput): void {
    const contacts = this.contactsSubject.getValue().map(c =>
      c.id === id ? { ...c, ...changes, phones: this.assignPhoneIds(changes.phones) } : c
    );
    this.save(contacts);
  }

  delete(id: number): void {
    const contacts = this.contactsSubject.getValue().filter(c => c.id !== id);
    this.save(contacts);
  }

  private assignPhoneIds(phones: Omit<Phone, 'id'>[]): Phone[] {
    return phones.map((p, i) => ({ ...p, id: i + 1 }));
  }

  private save(contacts: Contact[]): void {
    this.storage.set(STORAGE_KEY, contacts);
    this.contactsSubject.next(contacts);
  }
}
