import { VALIDATION_RULES, ERROR_MESSAGES } from './constants';
import type { HabitFormData } from '../types/habit.types';
import type { RegisterFormData } from '../types/auth.types';

export type ValidationErrors<T> = Partial<Record<keyof T, string>>;

// Validaciones de autenticacion

export const validateUsername = (username: string): string | undefined => {
  if (!username) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (username.length < VALIDATION_RULES.USERNAME_MIN_LENGTH) {
    return ERROR_MESSAGES.USERNAME_TOO_SHORT;
  }
  const usernameRegex = /^[a-zA-Z0-9_]+$/;
  if (!usernameRegex.test(username)) {
    return ERROR_MESSAGES.INVALID_USERNAME;
  }
}

export const validateEmail = (email: string): string | undefined => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email) return ERROR_MESSAGES.REQUIRED_FIELD;
    if (!emailRegex.test(email)) return ERROR_MESSAGES.INVALID_EMAIL;
};

export const validatePassword = (password: string): string | undefined => {
    if (!password) return ERROR_MESSAGES.REQUIRED_FIELD;
    if (password.length < VALIDATION_RULES.PASSWORD_MIN_LENGTH) {
      return ERROR_MESSAGES.PASSWORD_TOO_SHORT;
    }
    // Validaciones de fortaleza
    if (!/[A-Z]/.test(password)) {
      return ERROR_MESSAGES.PASSWORD_NEEDS_UPPERCASE;
    }
    
    if (!/[a-z]/.test(password)) {
      return ERROR_MESSAGES.PASSWORD_NEEDS_LOWERCASE;
    }
    
    if (!/\d/.test(password)) {
      return ERROR_MESSAGES.PASSWORD_NEEDS_NUMBER;
    }
};

export const validateConfirmPassword = (password: string, confirmPassword: string): string | undefined => {
  if (!confirmPassword) return ERROR_MESSAGES.REQUIRED_FIELD;
  if (confirmPassword !== password) return ERROR_MESSAGES.PASSWORDS_DO_NOT_MATCH;
};

export const validateRegisterForm = (formData: RegisterFormData): ValidationErrors<RegisterFormData> => {
  const errors: ValidationErrors<RegisterFormData> = {};

  //username
  const usernameError = validateUsername(formData.username);
  if (usernameError) errors.username = usernameError;
  //email
  const emailError = validateEmail(formData.email);
  if (emailError) errors.email = emailError;
  //password
  const passwordError = validatePassword(formData.password);
  if (passwordError) errors.password = passwordError;
  //confirmPassword
  const confirmPasswordError = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (confirmPasswordError) errors.confirmPassword = confirmPasswordError;
  return errors;
}

// Validaciones de habitos

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
