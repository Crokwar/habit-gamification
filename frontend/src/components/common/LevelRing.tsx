import { CircularProgressbarWithChildren } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { useUserStats } from '@/hooks/useUserStats';


function LevelRing() {

    const maxValue = 100
    const strokeWidth = 8

    const {data, isLoading, error} = useUserStats()
    
    return (
        <div className="flex items-center gap-2">

            {isLoading && <div>Cargando...</div>}
            {error && <div>Error: {error.message}</div>}
            {/* Anillo con LV adentro */}
            <div className="w-10 h-10">
                <CircularProgressbarWithChildren value={data?.level_progress_pct ?? 0} maxValue={maxValue} strokeWidth={strokeWidth}>
                    <span className="text-xs font-bold">{data?.level}</span>
                </CircularProgressbarWithChildren>
            </div>
        </div>
    )
}

export { LevelRing };