// hooks/useForm.ts
import { useState, type ChangeEvent } from 'react';
import type { ValidationErrors } from '../utils/validators';

interface UseFormReturn<T> {
  values: T;
  errors: ValidationErrors<T>;
  touched: Partial<Record<keyof T, boolean>>;
  handleChange: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handleSubmit: (onSubmit: (values: T) => void | Promise<void>) => (e?: React.FormEvent) => void;
  reset: () => void;
  setFieldValue: (name: keyof T, value: any) => void;
  setFieldError: (name: keyof T, error: string) => void;
  validate: () => ValidationErrors<T>;
}

type ValidatorFunction<T> = (values: T) => ValidationErrors<T>;

export const useForm = <T extends Record<string, any>>(
  initialValues: T,
  validationFn?: ValidatorFunction<T>
): UseFormReturn<T> => {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<ValidationErrors<T>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    const newValue = type === 'checkbox' ? checked : value;
    
    setValues(prev => ({
      ...prev,
      [name]: newValue
    }));

    if (errors[name as keyof T]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  const handleBlur = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name } = e.target;
    setTouched(prev => ({
      ...prev,
      [name]: true
    }));

    if (validationFn) {
      const fieldErrors = validationFn({ [name]: values[name as keyof T] } as T);
      if (fieldErrors[name as keyof T]) {
        setErrors(prev => ({
          ...prev,
          [name]: fieldErrors[name as keyof T]
        }));
      }
    }
  };

  const validate = (): ValidationErrors<T> => {
    if (!validationFn) return {};
    const validationErrors = validationFn(values);
    setErrors(validationErrors);
    return validationErrors;
  };

  const handleSubmit = (onSubmit: (values: T) => void | Promise<void>) => {
    return (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      
      const validationErrors = validate();
      
      if (Object.keys(validationErrors).length === 0) {
        onSubmit(values);
      }
    };
  };

  const reset = () => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
  };

  const setFieldValue = (name: keyof T, value: any) => {
    setValues(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const setFieldError = (name: keyof T, error: string) => {
    setErrors(prev => ({
      ...prev,
      [name]: error
    }));
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    reset,
    setFieldValue,
    setFieldError,
    validate
  };
};