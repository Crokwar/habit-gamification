import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';
import type { HabitFormData } from '../types/habit.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

export const validateEmail = (email: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return ERROR_MESSAGES.REQUIRED_FIELD;
    if (!emailRegex.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
    return '';
};

export const validatePassword = (password: string): string => {
    if (!password) return ERROR_MESSAGES.REQUIRED_FIELD;
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }
    return '';
};

export const validateHabitTitle = (title: string): string => {
    if (!title || !title.trim()) return ERROR_MESSAGES.REQUIRED_FIELD;
    if (title.length < VALIDATION_RULES.HABIT_TITLE_MIN_LENGTH) {
      return ERROR_MESSAGES.TITLE_TOO_SHORT;
    }
    if (title.length > VALIDATION_RULES.HABIT_TITLE_MAX_LENGTH) {
      return `El título no puede exceder ${VALIDATION_RULES.HABIT_TITLE_MAX_LENGTH} caracteres`;
    }
    return '';
};

export const validateHabitDescription = (description: string): string => {
    if (!description) return '';
    if (description.length > VALIDATION_RULES.HABIT_DESCRIPTION_MAX_LENGTH) {
      return ERROR_MESSAGES.DESCRIPTION_TOO_LONG;
    }
    return '';
};

export const validateHabitForm = (formData: HabitFormData): ValidationErrors<HabitFormData> => {
    const errors: ValidationErrors<HabitFormData> = {};
    
    const titleError = validateHabitTitle(formData.title);
    if (titleError) errors.title = titleError;
    
    const descriptionError = validateHabitDescription(formData.description);
    if (descriptionError) errors.description = descriptionError;
    
    return errors;
};
