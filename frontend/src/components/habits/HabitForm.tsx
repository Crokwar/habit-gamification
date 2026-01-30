// components/habits/HabitForm.tsx
import { X, Clock, Globe } from 'lucide-react';
import { useForm } from '../../hooks/useForm';
import { validateHabitForm } from '../../utils/validators';
import { HABIT_CATEGORIES } from '../../utils/constants';
import type { HabitFormData, HabitCreateDTO } from '../../types/habit.types';
import type { ServiceResponse } from '../../types/api.types';

interface HabitFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: HabitCreateDTO) => Promise<ServiceResponse<any>>;
  initialData?: HabitFormData | null;
}

export default function HabitForm({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData = null 
}: HabitFormProps) {
  const {
    values,
    errors,
    handleChange,
    handleSubmit,
    reset
  } = useForm<HabitFormData>(
    initialData || {
      title: '',
      description: '',
      isPublic: false,
      trackTime: false,
      category: 'health'
    },
    validateHabitForm
  );

  const handleFormSubmit = async (formValues: HabitFormData) => {
    // Convertir camelCase a snake_case para el backend
    const dto: HabitCreateDTO = {
      title: formValues.title,
      description: formValues.description || undefined,
      category: formValues.category,
      is_public: formValues.isPublic,
      track_time: formValues.trackTime
    };

    const result = await onSubmit(dto);
    if (result.success) {
      reset();
      onClose();
    }
  };

  const handleCancel = () => {
    reset();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-2xl font-bold text-gray-800">
            {initialData ? 'Editar Hábito' : 'Crear Nuevo Hábito'}
          </h2>
          <button
            onClick={handleCancel}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Título */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Título del hábito *
            </label>
            <input
              type="text"
              name="title"
              value={values.title}
              onChange={handleChange}
              placeholder="Ej: Hacer ejercicio 30 minutos"
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all ${
                errors.title ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-500">{errors.title}</p>
            )}
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Descripción (opcional)
            </label>
            <textarea
              name="description"
              value={values.description}
              onChange={handleChange}
              placeholder="Describe tu hábito..."
              rows={3}
              className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none ${
                errors.description ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            <div className="flex justify-between mt-1">
              {errors.description && (
                <p className="text-sm text-red-500">{errors.description}</p>
              )}
              <p className="text-xs text-gray-500 ml-auto">
                {values.description.length}/200
              </p>
            </div>
          </div>

          {/* Categoría */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-3">
              Categoría
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {HABIT_CATEGORIES.map(cat => (
                <label
                  key={cat.value}
                  className={`flex items-center justify-center gap-2 px-4 py-3 border-2 rounded-lg cursor-pointer transition-all ${
                    values.category === cat.value
                      ? 'border-indigo-500 bg-indigo-50 shadow-md'
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="category"
                    value={cat.value}
                    checked={values.category === cat.value}
                    onChange={handleChange}
                    className="sr-only"
                  />
                  <span className="font-medium text-gray-700">
                    {cat.label}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Opciones */}
          <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="isPublic"
                checked={values.isPublic}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Globe size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Hábito público
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Aparecerás en el ranking global y otros podrán ver tu progreso
                </p>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                name="trackTime"
                checked={values.trackTime}
                onChange={handleChange}
                className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <Clock size={18} className="text-gray-600" />
                  <span className="font-medium text-gray-700">
                    Registrar tiempo
                  </span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Podrás ingresar cuánto tiempo dedicaste a este hábito
                </p>
              </div>
            </label>
          </div>

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleCancel}
              className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleSubmit(handleFormSubmit)}
              className="flex-1 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors shadow-md hover:shadow-lg"
            >
              {initialData ? 'Actualizar' : 'Crear Hábito'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}