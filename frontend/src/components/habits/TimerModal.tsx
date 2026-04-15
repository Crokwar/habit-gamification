import { useTimer } from '@/hooks/useTimer';

interface TimerModalProps {
    habitId: number;
    habitTitle: string;
    onClose: () => void;
    onComplete: () => void;
}

export function TimerModal({ habitId, habitTitle, onClose, onComplete }: TimerModalProps) {
    const { timeMarker, handleStart, handleStop, handleCancel, error, isRunning } = useTimer(habitId);

    const seconds = timeMarker;
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    const format = (n: number) => String(n).padStart(2,'0')

    return (
        <div className="fixed inset-0 bg-black/75 z-50 flex items-center justify-center">
            <div className="flex flex-col items-center gap-6 p-8 rounded-2xl border border-[#cebea4] bg-[#111] w-full max-w-md">

                <div className="text-center">
                    <h2 className="text-[#cebea4] text-lg font-medium">{habitTitle}</h2>
                </div>

                <div className="font-mono text-[#ff5730] text-6xl tracking-widest">
                    {`${format(hours)}:${format(minutes)}:${format(secs)}`}
                </div>

                <div className="w-full h-px bg-[#cebea4] opacity-20"/>

                <div className="flex flex-col gap-3 w-full">
                    {!isRunning && (
                        <button
                            onClick={handleStart}
                            className="w-full py-3 rounded-xl text-sm font-medium bg-[#ff5730] text-black cursor-pointer">
                            Iniciar
                        </button>
                    )}
                    <button
                        onClick={async () => { await handleStop(); onComplete(); }}
                        className="w-full py-3 rounded-xl text-sm font-medium bg-[#ff5730] text-black cursor-pointer">
                        Completar
                    </button>
                    <button
                        onClick={async () => { await handleCancel(); onClose(); }}
                        className="w-full py-2 rounded-xl text-sm border border-[#cebea4] text-[#cebea4] bg-transparent cursor-pointer opacity-70">
                        Cancelar sesión
                    </button>
                </div>

                {error && <p className="text-red-400 text-xs text-center">{error}</p>}
            </div>
        </div>
    )
}
