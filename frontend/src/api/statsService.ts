import type { StatsResponse } from '@/types/stats.types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const getHeaders = (): HeadersInit => {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
};

export const statsService = {
    getStats: async(): Promise<StatsResponse> =>{
        const response = await fetch(`${API_URL}/user/me/stats`,{
            method: 'GET',
            headers: getHeaders()
        });
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({
            message: 'Error en la petición'
            }));
            throw new Error(
            errorData.detail || errorData.message || 'Error en la petición'
            );
        }
        const data = await response.json();
        return data as StatsResponse;
    }
}
