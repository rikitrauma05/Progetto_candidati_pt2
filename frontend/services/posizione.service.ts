// frontend/services/posizione.service.ts

import { getJson } from "./api";
import type { Posizione } from "@/types/posizione";

/**
 * Recupera dal backend le prime quattro posizioni aperte.
 * Passa sempre attraverso il proxy definito in next.config.ts.
 */
export async function getTopQuattroPosizioni(): Promise<Posizione[]> {
    const data = await getJson<Posizione[]>("/posizioni/topquattro");

    // Mappo l'id per compatibilità con i componenti frontend
    return data.map((p) => ({
        ...p,
        id: p.idPosizione,
    }));
}
