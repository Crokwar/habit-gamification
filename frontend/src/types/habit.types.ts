export type HabitCategory = 'health' | 'finance' | 'personal' | 'work' | 'other' | 'hobby' | 'study' | 'other';

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

export interface HabitCreatedDTO { // data transfer object
    title: string;
    description?: string;
    category: HabitCategory;
    is_public: boolean;
    track_time: boolean;
}

export interface HabitUpdateDTO extends Partial<HabitCreatedDTO> {} //updates opcionales

export interface HabitCompletion {
    id: number;
    habit_id: number;
    completed_at: string;
    time_spent?: number; // minutes
}

export interface CategoryOption {
    value: HabitCategory;
    label: string;
    color: string;
    borderColor: string;
}