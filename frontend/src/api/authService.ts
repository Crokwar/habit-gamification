// Aqui van las llamadas a la API de autenticación
// src/services/authService.ts

const API_URL = 'http://localhost:3000/api'; // URL de la API

export const authService = {
  // Login
  login: async ({ email, password }: { email: string; password: string }) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    
    return response.json();
  },

  // Register
  register: async ({ email, password, name }: { email: string; password: string; name: string }) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    
    return response.json();
  },
};