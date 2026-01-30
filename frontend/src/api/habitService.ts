import type { 
    Habit,
    HabitCreateDTO, 
    HabitUpdateDTO, 
    HabitCompletion 
} from '../types/habit.types';

import type { ApiError } from '../types/api.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

//MODO DESARROLLO - Cambiar a false cuando el backend esté listo
const USE_MOCK_DATA = true;

// Datos de prueba
let mockHabits: Habit[] = [
  {
    id: 1,
    user_id: 1,
    title: "Hacer ejercicio",
    description: "30 minutos de cardio",
    category: "health",
    is_public: true,
    track_time: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 2,
    user_id: 1,
    title: "Leer 20 páginas",
    description: "Antes de dormir",
    category: "study",
    is_public: false,
    track_time: false,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  },
  {
    id: 3,
    user_id: 1,
    title: "Meditar",
    category: "health",
    is_public: true,
    track_time: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  }
];

// simular delay
const mockDelay = (ms: number = 300) => 
  new Promise(resolve => setTimeout(resolve, ms));



class ApiErrorClass extends Error {
    code?: string;
    details?: Record<string, string[]>

    constructor(
      message: string,
      code?: string,
      details?: Record<string, string[]>
    ) {
      super(message);
      this.name = 'ApiError';
      this.code = 'ApiError';
      this.details = details;
    }
}

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const error: ApiError = await response.json().catch(() => ({
        message: 'Error en la petición'
      }));
      throw new ApiErrorClass(
        error.message || 'Error en la petición',
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
      if (USE_MOCK_DATA) {
        console.log('🔧 Usando datos mock');
        await mockDelay();
        return [...mockHabits];
      }
      const response = await fetch(`${API_URL}/habits`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<Habit[]>(response);
    },
  
    getById: async (id: number): Promise<Habit> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const habit = mockHabits.find(h => h.id === id);
        if (!habit) throw new ApiErrorClass('Hábito no encontrado');
        return habit;
      }
      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'GET',
        headers: getHeaders()
      });
      return handleResponse<Habit>(response);
    },
  
    create: async (habitData: HabitCreateDTO): Promise<Habit> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const newHabit: Habit = {
          id: Math.max(...mockHabits.map(h => h.id), 0) + 1,
          user_id: 1,
          title: habitData.title,
          description: habitData.description,
          category: habitData.category,
          is_public: habitData.is_public,
          track_time: habitData.track_time,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        };
        mockHabits.push(newHabit);
        console.log('✅ Hábito creado (mock):', newHabit);
        return newHabit;
      }
      const response = await fetch(`${API_URL}/habits`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(habitData)
      });
      return handleResponse<Habit>(response);
    },
  
    update: async (id: number, habitData: HabitUpdateDTO): Promise<Habit> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const index = mockHabits.findIndex(h => h.id === id);
        if (index === -1) throw new ApiErrorClass('Hábito no encontrado');
        
        mockHabits[index] = {
          ...mockHabits[index],
          ...habitData,
          updated_at: new Date().toISOString()
        };
        console.log('✅ Hábito actualizado (mock):', mockHabits[index]);
        return mockHabits[index];
      }

      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(habitData)
      });
      return handleResponse<Habit>(response);
    },
  
    delete: async (id: number): Promise<void> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const index = mockHabits.findIndex(h => h.id === id);
        if (index === -1) throw new ApiErrorClass('Hábito no encontrado');
        mockHabits.splice(index, 1);
        console.log('🗑️ Hábito eliminado (mock), ID:', id);
        return;
      }

      const response = await fetch(`${API_URL}/habits/${id}`, {
        method: 'DELETE',
        headers: getHeaders()
      });
      if (!response.ok) {
        throw new ApiErrorClass('Error al eliminar hábito');
      }
    },
  
    complete: async (id: number, timeSpent?: number): Promise<HabitCompletion> => {
      if (USE_MOCK_DATA) {
        await mockDelay();
        const completion: HabitCompletion = {
          id: Date.now(),
          habit_id: id,
          completed_at: new Date().toISOString(),
          time_spent: timeSpent
        };
        console.log('✅ Hábito completado (mock):', completion);
        return completion;
      }
      
      const response = await fetch(`${API_URL}/habits/${id}/complete`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ time_spent: timeSpent })
      });
      return handleResponse<HabitCompletion>(response);
    }
};
  
export default habitService;