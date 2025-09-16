
export interface ReservationData {
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  guests: number;
  observations?: string;
}

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  subject: string;
  message: string;
}

export interface SitioImage {
  src: string;
  alt: string;
  category: 'exterior' | 'rooms' | 'pool' | 'nature' | 'common' | 'leisure' | 'interior';
}
