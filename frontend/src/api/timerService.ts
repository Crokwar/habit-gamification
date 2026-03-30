import type { TimerSession, HabitCompletion } from "@/types/habit.types";

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const handleResponse = async <T>(response: Response): Promise<T> => {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({
        message: 'Error en la petición'
      }));
      throw new Error(
        errorData.detail || errorData.message || 'Error en la petición'
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

const timerService = {

    startTimer: async (habit_id: number): Promise<TimerSession> => {
        const response = await fetch(`${API_URL}/habits/${habit_id}/timer/start`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse<TimerSession>(response)
    },

    stopTimer: async (habit_id: number, timer_id: number): Promise<HabitCompletion> => {
        const response = await fetch(`${API_URL}/habits/${habit_id}/timer/${timer_id}/stop`, {
            method: 'POST',
            headers: getHeaders()
        });
        return handleResponse<HabitCompletion>(response)
    },

    cancelTimer: async (habit_id: number, timer_id: number): Promise<void> => {
        const response = await fetch(`${API_URL}/habits/${habit_id}/timer/${timer_id}/cancel`, {
            method: 'DELETE',
            headers: getHeaders()
        });
        if (!response.ok) {
            throw new Error("Error al cancelar el timer / No existe un timer para esta solicitud")
        }
    },

    getActiveTimer: async (habit_id: number): Promise<TimerSession | null> => {
        const response = await fetch(`${API_URL}/habits/${habit_id}/timer`,{
            method: 'GET',
            headers: getHeaders()
        });
        return handleResponse<TimerSession | null>(response)
    }
}

export {timerService};