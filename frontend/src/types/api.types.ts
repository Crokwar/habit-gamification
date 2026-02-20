
export interface ApiResponse<T> { // tipo para respuestas del backend
    data: T;
    message?: string;
    success: boolean;
}

/**export interface ApiError { // tipo para errores del backend (no se usa aun)
    message: string;
    code?: string;
    details?: Record<string, string[]>;
}*/

export interface PaginatedResponse <T> { // futuro: endpoints paginados (rankings, historial ...)
    data: T[];
    // ...
}

export interface ServiceResponse<T> { // response service front
    success: boolean;
    data?: T;
    error?: string;
}

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';

export interface RequestConfig { // estructura de una peticion
    method: HttpMethod;
    headers?: HeadersInit;
    body?: string;
}