export type PhoneLabel = 'mobile' | 'work' | 'home';

export const PHONE_LABELS: readonly { value: PhoneLabel; text: string; icon: string }[] = [
  { value: 'mobile', text: 'Móvil', icon: '📱' },
  { value: 'work', text: 'Trabajo', icon: '💼' },
  { value: 'home', text: 'Casa', icon: '🏠' }
];

export interface Phone {
  id: number;
  phoneNumber: string;
  label: PhoneLabel;
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phones: Phone[];
}
