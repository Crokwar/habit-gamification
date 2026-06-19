export type HabitCategory = 'health' | 'finance' | 'personal' | 'work' | 'hobby' | 'study' | 'other';

export interface Habit { //represents a habit in the database, snake_case - HabitDto
    id: number;
    user_id: number;
    title: string;
    description?: string;
    days_of_week?: number[];
    category: HabitCategory;
    is_public: boolean;
    track_time: boolean;
    created_at: string;
    updated_at: string;
}

export interface HabitFormData { //represents a habit in the form - front
    title: string;
    description: string;
    days_of_week: string[];
    category: HabitCategory;
    isPublic: boolean;
    trackTime: boolean;
}

export interface HabitCreateDTO { // data transfer object - HabitCreateRequest
    title: string;
    description?: string;
    days_of_week: number[];
    category: HabitCategory;
    is_public: boolean;
    track_time: boolean;
}

export interface HabitUpdateDTO extends Partial<HabitCreateDTO> {} //updates opcionales - HabitCompletionDto

export interface HabitCompletion {
    id: number;
    habit_id: number;
    user_id: number;
    completed_at: string;
    time_spent?: number; // minutes
    points_earned: number;  // 10 fácil, 20 medio, 30 difícil (según timer/duración)
}

export type TimerStatus = "running" | "completed" | "canceled" | "expired";

export interface TimerSession {
    id: number;
    user_id: number;
    habit_id: number;
    started_at: string;
    ended_at?: string;
    status: TimerStatus;
    created_at: string;
    updated_at?: string;
}

export interface CategoryOption {
    value: HabitCategory;
    label: string;
    color: string;
    borderColor: string;
}

export interface HabitToday extends Habit{
    is_completed_today: boolean
}