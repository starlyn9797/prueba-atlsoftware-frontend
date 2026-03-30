export interface Phone {
  id: number;
  phoneNumber: string;
  label: 'mobile' | 'work' | 'home';
}

export interface Contact {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phones: Phone[];
}
