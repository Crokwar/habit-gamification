// hooks/useHabits.ts
import { useState, useEffect } from 'react';
import habitService from '../api/habitService';
import type { Habit, HabitCreateDTO, HabitUpdateDTO } from '../types/habit.types';
import type { ServiceResponse } from '../types/api.types';

interface UseHabitsReturn {
  habits: Habit[];
  loading: boolean;
  error: string | null;
  createHabit: (habitData: HabitCreateDTO) => Promise<ServiceResponse<Habit>>;
  updateHabit: (id: number, habitData: HabitUpdateDTO) => Promise<ServiceResponse<Habit>>;
  deleteHabit: (id: number) => Promise<ServiceResponse<void>>;
  completeHabit: (id: number, timeSpent?: number) => Promise<ServiceResponse<any>>;
  refreshHabits: () => Promise<void>;
}

export const useHabits = (): UseHabitsReturn => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async (): Promise<void> => {
    try {
      setLoading(true);
      setError(null);
      const data = await habitService.getAll();
      setHabits(data);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error desconocido';
      setError(errorMessage);
      console.error('Error fetching habits:', err);
    } finally {
      setLoading(false);
    }
  };

  const createHabit = async (habitData: HabitCreateDTO): Promise<ServiceResponse<Habit>> => {
    try {
      const newHabit = await habitService.create(habitData);
      setHabits(prev => [...prev, newHabit]);
      return { success: true, data: newHabit };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear hábito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateHabit = async (
    id: number, 
    habitData: HabitUpdateDTO
  ): Promise<ServiceResponse<Habit>> => {
    try {
      const updatedHabit = await habitService.update(id, habitData);
      setHabits(prev => 
        prev.map(habit => habit.id === id ? updatedHabit : habit)
      );
      return { success: true, data: updatedHabit };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar hábito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteHabit = async (id: number): Promise<ServiceResponse<void>> => {
    try {
      await habitService.delete(id);
      setHabits(prev => prev.filter(habit => habit.id !== id));
      return { success: true };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar hábito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const completeHabit = async (
    id: number, 
    timeSpent?: number
  ): Promise<ServiceResponse<any>> => {
    try {
      const result = await habitService.complete(id, timeSpent);
      await fetchHabits();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al completar hábito';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const refreshHabits = async (): Promise<void> => {
    await fetchHabits();
  };

  return {
    habits,
    loading,
    error,
    createHabit,
    updateHabit,
    deleteHabit,
    completeHabit,
    refreshHabits
  };
};