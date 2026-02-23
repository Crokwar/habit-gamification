export type HabitCategory = 'health' | 'finance' | 'personal' | 'work' | 'hobby' | 'study' | 'other';

export interface Habit { //represents a habit in the database, snake_case
    id: number;
    user_id: number;
    title: string;
    description?: string;
    category: HabitCategory;
    is_public: boolean;
    track_time: boolean;
    created_at: string;
    updated_at: string;
}

export interface HabitFormData { //represents a habit in the form
    title: string;
    description: string;
    category: HabitCategory;
    isPublic: boolean;
    trackTime: boolean;
}

export interface HabitCreateDTO { // data transfer object
    title: string;
    description?: string;
    category: HabitCategory;
    is_public: boolean;
    track_time: boolean;
}

export interface HabitUpdateDTO extends Partial<HabitCreateDTO> {} //updates opcionales

export interface HabitCompletion {
    id: number;
    habit_id: number;
    user_id: number;
    completed_at: string;
    time_spent?: number; // minutes
    points_earned: number;  // 1 punto por cada completado pensado por ahora
}

export interface CategoryOption {
    value: HabitCategory;
    label: string;
    color: string;
    borderColor: string;
}