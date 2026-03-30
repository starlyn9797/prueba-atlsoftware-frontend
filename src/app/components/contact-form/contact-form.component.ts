import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { PhoneFieldComponent } from '../phone-field/phone-field.component';
import { ContactService } from '../../services/contact.service';

@Component({
  selector: 'app-contact-form',
  imports: [ReactiveFormsModule, PhoneFieldComponent],
  template: `
    <div class="form-container">
      <h2>{{ isEditMode ? 'Editar' : 'Nuevo' }} Contacto</h2>
      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="field">
          <label for="firstName">Nombre</label>
          <input id="firstName" formControlName="firstName" placeholder="Nombre">
          @if (showError('firstName')) {
            <span class="error">Mínimo 2 caracteres</span>
          }
        </div>
        <div class="field">
          <label for="lastName">Apellido</label>
          <input id="lastName" formControlName="lastName" placeholder="Apellido">
          @if (showError('lastName')) {
            <span class="error">Mínimo 2 caracteres</span>
          }
        </div>
        <div class="field">
          <label for="email">Email</label>
          <input id="email" formControlName="email" placeholder="correo@ejemplo.com" type="email">
          @if (showError('email')) {
            <span class="error">Email inválido</span>
          }
        </div>

        <div class="phones-section">
          <div class="phones-header">
            <label>Teléfonos</label>
            <button type="button" class="btn-add-phone" (click)="addPhone()">+ Agregar</button>
          </div>
          @for (phone of phonesArray.controls; track $index) {
            <app-phone-field
              [phoneGroup]="asFormGroup(phone)"
              [index]="$index"
              (remove)="removePhone($event)"
            />
          }
          @if (phonesArray.length === 0) {
            <p class="no-phones">Sin teléfonos agregados</p>
          }
        </div>

        <div class="actions">
          <button type="button" class="btn-cancel" (click)="onCancel()">Cancelar</button>
          <button type="submit" class="btn-save" [disabled]="form.invalid">Guardar</button>
        </div>
      </form>
    </div>
  `,
  styles: `
    .form-container {
      max-width: 560px;
      margin: 0 auto;
      animation: fadeIn 0.3s ease;
    }
    h2 {
      font-size: 1.25rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    form {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .field {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;
    }
    label {
      font-size: 0.8125rem;
      font-weight: 500;
      color: var(--text-secondary);
    }
    input {
      width: 100%;
    }
    .error {
      color: var(--danger);
      font-size: 0.75rem;
    }
    .phones-section {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      padding: 1rem;
      background: var(--bg-secondary);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
    }
    .phones-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .btn-add-phone {
      padding: 0.375rem 0.75rem;
      font-size: 0.8125rem;
      font-weight: 500;
      background: hsla(250, 80%, 65%, 0.15);
      color: var(--accent);
      border-radius: var(--radius-sm);
    }
    .btn-add-phone:hover {
      background: hsla(250, 80%, 65%, 0.3);
    }
    .no-phones {
      color: var(--text-muted);
      font-size: 0.8125rem;
      text-align: center;
      padding: 0.5rem;
    }
    .actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      margin-top: 0.5rem;
    }
    .actions button {
      padding: 0.625rem 1.5rem;
      border-radius: var(--radius-sm);
      font-size: 0.875rem;
      font-weight: 500;
    }
    .btn-cancel {
      background: var(--bg-tertiary);
      color: var(--text-secondary);
    }
    .btn-cancel:hover {
      background: var(--border-color);
    }
    .btn-save {
      background: var(--accent-gradient);
      color: white;
    }
    .btn-save:hover {
      opacity: 0.9;
    }
    .btn-save:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
  `
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

  addPhone(phoneNumber = '', label = 'mobile'): void {
    this.phonesArray.push(this.fb.group({
      phoneNumber: [phoneNumber, Validators.required],
      label: [label]
    }));
  }

  removePhone(index: number): void {
    this.phonesArray.removeAt(index);
  }

  asFormGroup(control: any): FormGroup {
    return control as FormGroup;
  }

  showError(field: string): boolean {
    const ctrl = this.form.get(field);
    return !!ctrl && ctrl.invalid && ctrl.touched;
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const value = this.form.getRawValue();
    const phones = value.phones.map((p: any, i: number) => ({
      id: i + 1,
      phoneNumber: p.phoneNumber,
      label: p.label
    }));
    if (this.isEditMode) {
      this.contactService.update(this.contactId, { ...value, phones });
    } else {
      this.contactService.create({ ...value, phones });
    }
    this.router.navigate(['/']);
  }

  onCancel(): void {
    this.router.navigate(['/']);
  }
}
