import { useEffect, useState, useRef } from "react";
import { timerService } from "@/api/timerService";

interface useTimerReturn {
    timeMarker: number,
    isRunning: boolean,
    timerId: number | null,
    handleStart: () => void,
    handleStop: () => void,
    handleCancel: () => void,
    error: string | null
}

export const useTimer = (habitId: number): useTimerReturn => {
    
    const [timeMarker, setTimeMarker] = useState(0)
    const [isRunning, setIsRunning] = useState(false)
    const [timerId, setTimerId] = useState<number | null>(null)
    const [startedAt, setStartedAt] = useState<string | null>(null)
    const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (isRunning && startedAt) {
            intervalRef.current = setInterval(() => {
                const seconds = Math.floor( (Date.now() - new Date(startedAt).getTime()) /1000 )
                setTimeMarker(seconds)
            }, 1000)
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isRunning, startedAt])

    const handleStart = async () => {
        try {
            const startTimer = await timerService.startTimer(habitId)
            setTimerId(startTimer.id)
            setStartedAt(startTimer.started_at)
            setIsRunning(true)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    const handleStop = async () => {
        if (!timerId) return
        try {
            await timerService.stopTimer(habitId, timerId)
            setIsRunning(false)
            setTimerId(null)
            setStartedAt(null)
            setTimeMarker(0)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    const handleCancel = async () => {
        if (!timerId) return
        try {
            await timerService.cancelTimer(habitId, timerId)
            setIsRunning(false)
            setTimerId(null)
            setStartedAt(null)
            setTimeMarker(0)
        } catch (error) {
            if (error instanceof Error) {
                setError(error.message)
            }
        }
    }

    return {
        timeMarker,
        isRunning,
        timerId,
        handleStart,
        handleStop,
        handleCancel,
        error
    }
}