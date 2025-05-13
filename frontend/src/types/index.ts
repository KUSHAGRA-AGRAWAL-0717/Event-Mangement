
export interface Event {
  id: number;
  title: string;
  description: string;
  date: string;
  location: string;
  time?: string;
  organizer?: string;
  max_participants?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Participant {
  id: number;
  event_id: number;
  name: string;
  email: string;
  phone?: string;
  created_at?: string;
  updated_at?: string;
}

export interface EventFormData {
  title: string;
  description: string;
  date: string;
  location: string;
  time?: string;
  organizer?: string;
  max_participants?: number;
}

export interface ParticipantFormData {
  event_id: number;
  name: string;
  email: string;
  phone?: string;
}
