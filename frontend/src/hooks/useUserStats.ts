import { statsService } from "@/api/statsService"
import { useQuery, useQueryClient } from "@tanstack/react-query"

export const STATS_QUERY_KEY = ['stats'] as const

export const useUserStats = () => {
    const { data, isLoading, error } = useQuery({
        queryKey: STATS_QUERY_KEY,
        queryFn: statsService.getStats,
    })

    return {
        data,
        isLoading,
        error,
    }
}

export const useInvalidateUserStats = () => {
    const queryClient = useQueryClient()

    return () => queryClient.invalidateQueries({ queryKey: STATS_QUERY_KEY })
}