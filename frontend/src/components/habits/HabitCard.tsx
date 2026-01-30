// components/habits/HabitCard.tsx
import { X, Clock, Globe, Lock } from 'lucide-react';
import { HABIT_CATEGORIES } from '../../utils/constants';
import type { Habit } from '../../types/habit.types';

interface HabitCardProps {
  habit: Habit;
  onDelete: (id: number) => void;
  onEdit?: (habit: Habit) => void;
}

export default function HabitCard({ habit, onDelete, onEdit }: HabitCardProps) {
  const category = HABIT_CATEGORIES.find(c => c.value === habit.category);

  return (
    <div className="bg-white rounded-xl p-5 shadow-md hover:shadow-lg transition-shadow border border-gray-100">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          {/* Título y Categoría */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <h3 className="text-xl font-bold text-gray-800">
              {habit.title}
            </h3>
            {category && (
              <span className={`px-3 py-1 rounded-full text-xs font-medium ${category.color}`}>
                {category.label}
              </span>
            )}
          </div>

          {/* Descripción */}
          {habit.description && (
            <p className="text-gray-600 mb-3">
              {habit.description}
            </p>
          )}

          {/* Metadata */}
          <div className="flex gap-4 text-sm text-gray-500 flex-wrap">
            <span className="flex items-center gap-1">
              {habit.is_public ? (
                <>
                  <Globe size={16} />
                  Público
                </>
              ) : (
                <>
                  <Lock size={16} />
                  Privado
                </>
              )}
            </span>
            
            {habit.track_time && (
              <span className="flex items-center gap-1">
                <Clock size={16} />
                Registra tiempo
              </span>
            )}
          </div>
        </div>

        {/* Botones de Acción */}
        <div className="flex gap-2 ml-4">
          {onEdit && (
            <button
              onClick={() => onEdit(habit)}
              className="text-gray-400 hover:text-indigo-600 transition-colors p-2 hover:bg-indigo-50 rounded-lg"
              title="Editar hábito"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
            </button>
          )}
          
          <button
            onClick={() => onDelete(habit.id)}
            className="text-gray-400 hover:text-red-500 transition-colors p-2 hover:bg-red-50 rounded-lg"
            title="Eliminar hábito"
          >
            <X size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}