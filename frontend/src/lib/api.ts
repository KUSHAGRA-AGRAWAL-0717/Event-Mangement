
const API_URL = 'http://localhost:5000/api';

// Event API calls
export const fetchEvents = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/events`);
    if (!response.ok) {
      throw new Error('Failed to fetch events');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching events:', error);
    throw error;
  }
};

export const fetchEventById = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch event');
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};

export const createEvent = async (eventData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to create event');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating event:', error);
    throw error;
  }
};

export const updateEvent = async (id: number, eventData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });
    if (!response.ok) {
      throw new Error('Failed to update event');
    }
    return response.json();
  } catch (error) {
    console.error(`Error updating event ${id}:`, error);
    throw error;
  }
};

export const deleteEvent = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/events/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete event');
    }
  } catch (error) {
    console.error(`Error deleting event ${id}:`, error);
    throw error;
  }
};

// Participant API calls
export const fetchParticipants = async (): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/participants`);
    if (!response.ok) {
      throw new Error('Failed to fetch participants');
    }
    return response.json();
  } catch (error) {
    console.error('Error fetching participants:', error);
    throw error;
  }
};

export const fetchParticipantsByEventId = async (eventId: number): Promise<any[]> => {
  try {
    const response = await fetch(`${API_URL}/events/${eventId}/participants`);
    if (!response.ok) {
      throw new Error(`Failed to fetch participants for event ${eventId}`);
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching participants for event ${eventId}:`, error);
    throw error;
  }
};

export const fetchParticipantById = async (id: number): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/participants/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch participant');
    }
    return response.json();
  } catch (error) {
    console.error(`Error fetching participant ${id}:`, error);
    throw error;
  }
};

export const createParticipant = async (participantData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/participants`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(participantData),
    });
    if (!response.ok) {
      throw new Error('Failed to create participant');
    }
    return response.json();
  } catch (error) {
    console.error('Error creating participant:', error);
    throw error;
  }
};

export const updateParticipant = async (id: number, participantData: any): Promise<any> => {
  try {
    const response = await fetch(`${API_URL}/participants/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(participantData),
    });
    if (!response.ok) {
      throw new Error('Failed to update participant');
    }
    return response.json();
  } catch (error) {
    console.error(`Error updating participant ${id}:`, error);
    throw error;
  }
};

export const deleteParticipant = async (id: number): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}/participants/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete participant');
    }
  } catch (error) {
    console.error(`Error deleting participant ${id}:`, error);
    throw error;
  }
};
