// pages/Habits.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Loader, ArrowLeft } from 'lucide-react';
import HabitForm from '../components/habits/HabitForm';
import HabitCard from '../components/habits/HabitCard';
import { useHabits } from '../hooks/useHabits';
import type { HabitCreateDTO } from '../types/habit.types';
import type { ServiceResponse } from '../types/api.types';

function Habits() {
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const { habits, loading, error, createHabit, deleteHabit } = useHabits();
  const navigate = useNavigate();

  const handleCreateHabit = async (
    habitData: HabitCreateDTO
  ): Promise<ServiceResponse<any>> => {
    const result = await createHabit(habitData);
    if (result.success) {
      console.log('Hábito creado exitosamente');
    } else {
      console.error('Error al crear hábito:', result.error);
    }
    return result;
  };

  const handleDeleteHabit = async (id: number): Promise<void> => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este hábito?')) {
      await deleteHabit(id);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#cebea4] flex items-center justify-center">
        <div className="text-center text-[#cebea4] bg-black rounded-2xl border border-[#cebea4]/60 px-8 py-6 shadow-lg">
          <Loader className="w-12 h-12 animate-spin text-[#ff5730] mx-auto mb-4" />
          <p className="text-sm">Cargando tus hábitos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#cebea4] flex items-center justify-center">
        <div className="text-center bg-black text-[#cebea4] px-8 py-6 rounded-2xl shadow-lg border border-[#cebea4]/60 max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold mb-2">
            Error al cargar hábitos
          </h2>
          <p className="mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-[#ff5730] text-black font-semibold rounded-lg hover:bg-[#ff865f] transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#cebea4] p-4 sm:p-6">
      <div className="max-w-6xl mx-auto bg-black text-[#cebea4] rounded-3xl border border-[#cebea4]/60 px-4 sm:px-8 py-8 shadow-lg">
        {/* Header con botón volver */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center gap-2 text-[#ff5730] hover:text-[#ff865f] mb-4 transition-colors"
          >
            <ArrowLeft size={20} />
            Volver al Dashboard
          </button>
          <h1 className="text-4xl font-bold mb-2">
            Mis Hábitos
          </h1>
          <p>
            Crea y gestiona tus hábitos diarios para mejorar tu productividad
          </p>
        </div>

        {/* Botón Crear */}
        <button
          onClick={() => setIsFormOpen(true)}
          className="mb-6 bg-[#ff5730] hover:bg-[#ff865f] text-black px-6 py-3 rounded-xl font-semibold flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
        >
          <Plus size={20} />
          Crear Nuevo Hábito
        </button>

        {/* Lista de Hábitos */}
        {habits.length > 0 ? (
          <div className="grid gap-4">
            {habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                onDelete={handleDeleteHabit}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 rounded-2xl border border-[#cebea4]/60 bg-black/40">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold mb-2">
              No tienes hábitos todavía
            </h3>
            <p className="mb-4">
              Crea tu primer hábito para comenzar tu viaje de productividad
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#ff5730] text-black rounded-lg hover:bg-[#ff865f] transition-colors font-semibold"
            >
              <Plus size={20} />
              Crear mi primer hábito
            </button>
          </div>
        )}

        {/* Modal de Formulario */}
        <HabitForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
          onSubmit={handleCreateHabit}
        />
      </div>
    </div>
  );
}

export default Habits;