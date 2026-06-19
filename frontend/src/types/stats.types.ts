export type Rank= "D" | "C" | "B" | "A" | "S" | "SS"

export interface StatsResponse {
    total_xp: number;
    current_level_xp: number;
    xp_to_next_level: number;
    level: number;
    level_progress_pct: number;
    streak: number;
    rank: Rank
}