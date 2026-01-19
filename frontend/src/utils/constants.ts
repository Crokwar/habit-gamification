import type { CategoryOption } from "@/types/habit.types";

export const HABIT_CATEGORIES: CategoryOption[] = [
    { 
      value: 'health', 
      label: '💪 Salud', 
      color: 'bg-green-100 text-green-700',
      borderColor: 'border-green-500'
    },
    { 
      value: 'study', 
      label: '📚 Estudio', 
      color: 'bg-blue-100 text-blue-700',
      borderColor: 'border-blue-500'
    },
    { 
      value: 'work', 
      label: '💼 Trabajo', 
      color: 'bg-purple-100 text-purple-700',
      borderColor: 'border-purple-500'
    },
    { 
      value: 'hobby', 
      label: '🎨 Hobbies', 
      color: 'bg-pink-100 text-pink-700',
      borderColor: 'border-pink-500'
    },
    { 
      value: 'other', 
      label: '✨ Otro', 
      color: 'bg-gray-100 text-gray-700',
      borderColor: 'border-gray-500'
    }
];
  
export interface UserLevel {
    rank: string;
    minPoints: number;
    color: string;
}
  
export const USER_LEVELS: UserLevel[] = [
    { rank: 'D', minPoints: 0, color: 'text-gray-500' },
    { rank: 'C', minPoints: 100, color: 'text-green-500' },
    { rank: 'B', minPoints: 300, color: 'text-blue-500' },
    { rank: 'A', minPoints: 600, color: 'text-purple-500' },
    { rank: 'S', minPoints: 1000, color: 'text-orange-500' },
    { rank: 'SS', minPoints: 2000, color: 'text-red-500' },
    { rank: 'SS+', minPoints: 5000, color: 'text-yellow-500' }
];

export const POINTS_PER_COMPLETION = 10;
export const STREAK_BONUS_MULTIPLIER = 1.5;

export const VALIDATION_RULES = {
    HABIT_TITLE_MIN_LENGTH: 3,
    HABIT_TITLE_MAX_LENGTH: 100,
    HABIT_DESCRIPTION_MAX_LENGTH: 200,
    PASSWORD_MIN_LENGTH: 8,
    USERNAME_MIN_LENGTH: 3
} as const;

export const ERROR_MESSAGES = {
    REQUIRED_FIELD: 'Este campo es obligatorio',
    INVALID_EMAIL: 'Email inválido',
    PASSWORD_TOO_SHORT: `La contraseña debe tener al menos ${VALIDATION_RULES.PASSWORD_MIN_LENGTH} caracteres`,
    TITLE_TOO_SHORT: `El título debe tener al menos ${VALIDATION_RULES.HABIT_TITLE_MIN_LENGTH} caracteres`,
    DESCRIPTION_TOO_LONG: `La descripción no puede exceder ${VALIDATION_RULES.HABIT_DESCRIPTION_MAX_LENGTH} caracteres`,
    NETWORK_ERROR: 'Error de conexión. Intenta nuevamente.',
    UNAUTHORIZED: 'Sesión expirada. Por favor inicia sesión nuevamente.'
} as const;