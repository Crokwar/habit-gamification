import { useState, useEffect } from 'react'
import habitService from '@/api/habitService'
import type { HabitToday } from '@/types/habit.types';
import { TimerModal } from './habits/TimerModal';


function Checklist() {

  const [habits, setHabits] = useState<HabitToday[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null) 
  const [activeTimer, setActiveTimer] = useState< HabitToday | null>(null)
  
  const getProgressMessage = (progress: number): string => {
    if (progress === 100) return '🎉 ¡Mas ready que 10 readys!'
    if (progress >= 75) return '💪 ¡Ya casito!'
    if (progress >= 50) return '🔥 ¡Medio medio, tibio!'
    if (progress >= 25) return '🚀 ¡Lo que falta es día!'
    return '👋 ¡Empezamos ya o que?!'
  }

  useEffect(() => {
    const fetchHabits = async () => {
      try {
        const data = await habitService.getToday()
        setHabits(data)
      } catch (err) {
        setError('Error al cargar los hábitos')
      } finally {
        setLoading(false)
      }
    }
    fetchHabits()
  }, [])

  const handleComplete = async (id: number) => {
    try {
      await habitService.complete(id)
      setHabits(prev => prev.map(habit => 
        habit.id === id ? { ...habit, is_completed_today: true } : habit
      ))
    } catch (err) {
      setError('Error al completar el hábito')
    }
  } 

  const progress = habits.length === 0 ? 0 : Math.round((habits.filter(habit => habit.is_completed_today).length / habits.length) * 100)

  if (loading) return <div className="text-[#cebea4] text-center">Cargando ... </div>
  if (error) return <div className="text-[#cebea4] text-center">{error}</div>
    
  return (
      <div className="max-w-md mx-auto bg-black rounded-2xl shadow-lg overflow-hidden mb-6 text-[#cebea4]">
  
        {/* Header + Progreso */}
        <div className="p-6 border border-[#cebea4] rounded-2xl mx-4 mt-4 mb-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="font-semibold text-xl">Hábitos para hoy</h2>
          </div>

          {/* Barra de progreso */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm">{getProgressMessage(progress)}</span>
              <span className="text-sm font-medium">{progress}%</span>
            </div>
  
            <div className="w-full bg-[#cebea4]/30 rounded-full h-3">
              <div
                className="bg-[#ff5730] h-3 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
  
        <div className="px-6 pb-6">
          {/* Checklist */}
          <ul className="space-y-5">
            {habits.map((habit) => (
              <li
                key={habit.id}
                className="flex items-center justify-between p-4 rounded-xl border border-[#cebea4]"
              >
                <div className="flex items-start gap-3 w-full">
  
                  {/* Texto */}
                  <div>
                    <p className="font-semibold text-base">{habit.title}</p>
                    <p className="text-xs">
                      {habit.description}
                    </p>
                  </div>
                </div>
  
                {/* Estado */}
                {habit.is_completed_today 
                ? (
                  <button
                    className="w-6 h-6 border-2 border-[#ff5730] bg-[#ff5730] rounded flex items-center justify-center text-black cursor-pointer transition-transform duration-200 hover:scale-105"
                  >
                    ✓
                  </button>
                ) : !habit.is_completed_today && habit.track_time
                ? (
                  <button
                    onClick={() => setActiveTimer(habit)}
                    className="w-6 h-6 border-2 border-[#cebea4] rounded cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-[#ff5730] hover:bg-[#ff5730] hover:scale-105"
                  > 
                    <svg
                      className="w-3 h-3 ml-[1px]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </button>
                ) : (
                  <button
                  onClick={() => handleComplete(habit.id)}
                  className="w-6 h-6 border-2 border-[#cebea4] rounded cursor-pointer flex items-center justify-center transition-all duration-200 hover:border-[#ff5730] hover:bg-[#ff5730] hover:scale-105"
                  >
                  </button>
                )}
              </li>
            ))}
          </ul>
        </div>
        {activeTimer && (
          <TimerModal
              habitId={activeTimer.id}
              habitTitle={activeTimer.title}
              onClose={() => setActiveTimer(null)}
              onComplete={() => {
                  setHabits(prev => prev.map(h =>
                    h.id === activeTimer.id ? {...h, is_completed_today: true} : h
                  ))
                  setActiveTimer(null)
              }}
          />
        )}
      </div>
    );
}

export { Checklist }