export interface User {
    id: string;
    email: string;
    username: string;
    created_at: string;
}

// tipos para login de usuario
export interface LoginCredentials {
    email: string;
    password: string;
}
  
// tipos para registro de usuario //
export interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string
}

// envio de datos al backend para registro de usuario
export interface RegisterPayload {
    username: string;
    email: string;
    password: string;
}

// respuesta del backend para login y registro 
export interface AuthResponse {
    token: string;
    token_type: string;
    user: User;
}

// tipo para validacion de formulario de registro //

// estados de validacion 
export type AsyncStatus = 'idle' | 'checking' | 'available' | 'taken';
