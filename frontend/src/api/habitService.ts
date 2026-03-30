import type { 
    Habit,
    HabitCreateDTO, 
    HabitUpdateDTO, 
    HabitToday
} from '../types/habit.types';

import type { ApiError } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

class ApiErrorClass extends Error {
    code?: string;
    details?: Record<string, string[]>

    constructor(
      message: string,
      code?: string,
      details?: Record<string, string[]>
    ) {
      super(message); // new Error("detail")
      this.name = 'ApiError';
      this.code = code ?? 'ApiError';
      this.details = details;
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        detail: 'Error en la petición'
      }));
      throw new ApiErrorClass(
        error.detail || 'Error en la petición',
        error.code,
        error.details
      );
    }
    return response.json();
};
  
const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
};
  
const habitService = {
    getAll: async (): Promise<Habit[]> => {
      const response = await fetch(`${API_URL}/habits`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<Habit[]>(response);
    },
  
    getById: async (id: number): Promise<Habit> => {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<Habit>(response);
    },
  
    create: async (habitData: HabitCreateDTO): Promise<Habit> => {
      const response = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(habitData)
      });
      return handleResponse<Habit>(response);
    },
  
    update: async (id: number, habitData: HabitUpdateDTO): Promise<Habit> => {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(habitData)
      });
      return handleResponse<Habit>(response);
    },
  
    delete: async (id: number): Promise<void> => {
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new ApiErrorClass('Error al eliminar hábito');
      }
    },
  
    complete: async (id: number, timeSpent?: number): Promise<HabitToday> => {
      const response = await fetch(`${API_URL}/habits/${id}/complete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ time_spent: timeSpent })
      });
      return handleResponse<HabitToday>(response);
    },

    getToday: async (): Promise<HabitToday[]> => {
      const response = await fetch(`${API_URL}/habits/today`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<HabitToday[]>(response)
    }
};
  
export default habitService;