import { getJson } from "./api";

export type HrDashboardStats = {
    totalePosizioni: number;
    totaleCandidature: number;
    totaleTest: number;
    totaleTentativi: number;
};

export async function getHrDashboardStats(): Promise<HrDashboardStats> {
    // ATTENZIONE: niente /api qui, ci pensa già services/api.ts
    return getJson<HrDashboardStats>("/dashboard/hr");
}
