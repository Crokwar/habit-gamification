import { useState, useEffect } from 'react';
import { useForm } from './useForm';
import { useDebounce } from './useDebounce';
import { validateRegisterForm, validateEmail, validateUsername } from '@/utils/validators'; 
import { DEBOUNCE_DELAY } from '../utils/constants';
import { authService } from '@/api/authService';
import type { RegisterFormData, AsyncStatus } from '../types/auth.types';
import { useAuth } from './useAuth';

// hook para manejar el formulario de registro
// incliye las validaciones asyncronas, sincronas y submit

export const useRegisterForm = () => {

    const { register } = useAuth()

    // base sincrona de useForm
    const baseForm = useForm<RegisterFormData>(
        {
            email: '',
            username: '',
            password: '',
            confirmPassword: '',
        },
        validateRegisterForm
    )

    // estados para validacion asincrona
    const [usernameStatus, setUsernameStatus] = useState<AsyncStatus>('idle');
    const [emailStatus, setEmailStatus] = useState<AsyncStatus>('idle');
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // debounsing
    const debouncedUsername = useDebounce(baseForm.values.username, DEBOUNCE_DELAY);
    const debouncedEmail = useDebounce(baseForm.values.email, DEBOUNCE_DELAY);

    // validacion asincrona username
    useEffect( () => {
        const checkUsername = async () => {
            // si esta vacio o corto no validar
            if (debouncedUsername.length < 3) {
                setUsernameStatus('idle')
                return;
            }

            // validar formato primero
            const formatError = validateUsername(debouncedUsername);
            if (formatError) {
                setUsernameStatus('idle');
                return;
            }

            // Validación asíncrona (llamada a API)
            setUsernameStatus('checking');

            try {
                const data  = await authService.checkUsernameAvailability(debouncedUsername);
                
                if (data.available) {
                  setUsernameStatus('available');
                } else {
                  setUsernameStatus('taken');
                  baseForm.setFieldError('username', 'Usuario no disponible');
                }
              } catch (error) {
                console.error('Error checking username:', error);
                setUsernameStatus('idle');
            }

        };
        checkUsername();
    }, [debouncedUsername]);


    // validacion asincrona email
    useEffect(() => {
        const checkEmail = async () => {
          // Si está vacío, no validar
          if (!debouncedEmail) {
            setEmailStatus('idle');
            return;
          }
    
          // Validar formato primero
          const formatError = validateEmail(debouncedEmail);
          if (formatError) {
            setEmailStatus('idle');
            return;
          }
    
          // Validación asíncrona
          setEmailStatus('checking');
          
          try {
            const  data  = await authService.checkEmailAvailability(debouncedEmail);
            
            if (data.available) {
              setEmailStatus('available');
            } else {
              setEmailStatus('taken');
              baseForm.setFieldError('email', 'Email ya registrado');
            }
          } catch (error) {
            console.error('Error checking email:', error);
            setEmailStatus('idle');
          }
        };
    
        checkEmail();
    }, [debouncedEmail]); // Solo depende del email debounced


    // Habilitar submit
    const canSubmit = (): boolean => {
        // Verificar que no haya errores de validación síncrona
        const hasNoSyncErrors = Object.keys(baseForm.errors).length === 0;
        
        // Verificar que todos los campos estén llenos
        const allFieldsFilled = 
            baseForm.values.email !== '' &&
            baseForm.values.username !== '' &&
            baseForm.values.password !== '' &&
            baseForm.values.confirmPassword !== '';
        
        // Verificar que las validaciones async estén completas y sean válidas
        const asyncValidationsOk = 
            usernameStatus === 'available' &&
            emailStatus === 'available';
        
        // No permitir submit mientras está enviando
        const notSubmitting = !isSubmitting;
        
        return hasNoSyncErrors && allFieldsFilled && asyncValidationsOk && notSubmitting;
    };

    // Funcion del submit - para registro
    const handleRegister = async () => {
        // Verificar que se puede enviar
        if (!canSubmit()) {
          console.warn('Formulario inválido, no se puede enviar');
          return { success: false, error: 'Formulario inválido' };
        }
    
        // Marcar como enviando
        setIsSubmitting(true);
    
        try {
          // Llamar a la API
          const response = await register(
            baseForm.values.email.trim().toLowerCase(),
            baseForm.values.username.trim(),
            baseForm.values.password,
          );
    
          // Reset del formulario en caso de éxito
          baseForm.reset();
          setUsernameStatus('idle');
          setEmailStatus('idle');
    
          return { 
            success: true, 
            data: response
          };
          
        } catch (error: any) {
          console.error('Error en registro:', error);
          
          const message = error.message || 'Error al registrar';
            
          // 409 Conflict - Email o username ya existe
          if (message.toLowerCase().includes('email')) {
            baseForm.setFieldError('email', 'Email ya registrado');
            setEmailStatus('taken');
          } else if (message.toLowerCase().includes('username')) {
            baseForm.setFieldError('username', 'Usuario no disponible');
            setUsernameStatus('taken');
          } else {
            baseForm.setFieldError('email', message);
          }
    
          return { 
            success: false, 
            error: message 
          };
          
        } finally {
          // Siempre marcar como no enviando
          setIsSubmitting(false);
        }
    };  
    
    return {
        ...baseForm,
        usernameStatus,
        emailStatus,
        isSubmitting,
        canSubmit: canSubmit(),
        handleRegister,
    };
};
