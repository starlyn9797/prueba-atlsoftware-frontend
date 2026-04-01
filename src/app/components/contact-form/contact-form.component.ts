import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators, AbstractControl } from '@angular/forms';
import { PhoneFieldComponent } from '../phone-field/phone-field.component';
import { ContactService } from '../../services/contact.service';
import { PhoneLabel, PHONE_LABELS } from '../../models/contact.model';

interface PhoneFormValue {
  phoneNumber: string;
  label: PhoneLabel;
}

interface ContactFormValue {
  firstName: string;
  lastName: string;
  email: string;
  phones: PhoneFormValue[];
}

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, PhoneFieldComponent],
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css'
})
export class ContactFormComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly contactService = inject(ContactService);

  isEditMode = false;
  private contactId = 0;

  form: FormGroup = this.fb.group({
    firstName: ['', [Validators.required, Validators.minLength(2)]],
    lastName: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phones: this.fb.array([])
  });

  get phonesArray(): FormArray {
    return this.form.get('phones') as FormArray;
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.contactId = +id;
      const contact = this.contactService.getById(this.contactId);
      if (contact) {
        this.form.patchValue({
          firstName: contact.firstName,
          lastName: contact.lastName,
          email: contact.email
        });
        contact.phones.forEach(p => this.addPhone(p.phoneNumber, p.label));
      }
    }
  }

  addPhone(phoneNumber = '', label: PhoneLabel = PHONE_LABELS[0].value): void {
    this.phonesArray.push(this.fb.group({
      phoneNumber: [phoneNumber, Validators.required],
      label: [label]
    }));
  }

  removePhone(index: number): void {
    this.phonesArray.removeAt(index);
  }

  asFormGroup(control: AbstractControl): FormGroup {
    return control as FormGroup;
  }

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { firstName, lastName, email, phones } = this.form.getRawValue() as ContactFormValue;
    const contact = { firstName, lastName, email, phones };
    if (this.isEditMode) {
      this.contactService.update(this.contactId, contact);
    } else {
      this.contactService.create(contact);
    }
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
