// Aqui van las llamadas a la API de autenticación
// src/services/authService.ts

import type { RegisterPayload, LoginCredentials, AuthResponse } from '../types/auth.types';


const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000'; // URL de la API

/**
class ApiErrorClass extends Error { // clase de error personalizada para distingir errores de la API de otros errores
  code?: string;
  details?: Record<string, string[]>

  constructor(
    message: string,
    code?: string,
    details?: Record<string, string[]>
  ) {
    super(message);
    this.name = 'ApiError';
    this.code = code ?? 'ApiError';
    this.details = details;
  }
}
*/

const handleResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ // si response.json() falla se activa el catch, se puede mejorar para obtener la inforacion de ese fallo
      details: 'Error en la petición'
    }));
    throw new Error(
      typeof error.detail === 'string'
        ? error.detail
        : Array.isArray(error.detail)
        ? error.detail.map((e: any) => e.msg).join('; ')
        : 'Error en la petición'
    );
  }
  return response.json();
};


export const authService = {
  // Login
  login: async (dataLogin: LoginCredentials): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dataLogin),
    });
    
    return handleResponse<AuthResponse>(response);
  },

  // Register
  register: async (data: RegisterPayload): Promise<AuthResponse> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    
    return handleResponse<AuthResponse>(response);
  },

  // Validacion de formulario de registro //
  checkUsernameAvailability: async (username: string): Promise<{available: boolean}>=> {
    const response = await fetch(`${API_URL}/auth/check-username/${encodeURIComponent(username)}`)
    return handleResponse<{available: boolean}>(response);
  },

  checkEmailAvailability: async (email: string): Promise<{available: boolean}>=> {
    const response = await fetch(`${API_URL}/auth/check-email/${encodeURIComponent(email)}`)
    return handleResponse<{available: boolean}>(response);
  }
};
