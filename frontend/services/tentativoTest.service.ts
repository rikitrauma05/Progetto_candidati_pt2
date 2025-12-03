//frontend/services/tentativoTest.service.ts
import { getJson, API_BASE_URL } from "./api";
import { useAuthStore } from "@/store/authStore";

export type TentativoTest = {
    idTentativo: number;
    idCandidatura: number;
    punteggio: number;
    completatoAt: string;
};

// GET /tentativi-test/candidatura/{idCandidatura}
export function getPunteggioTestByCandidatura(idCandidatura: number) {
    return getJson<{ punteggio: number | null }>(
        `/tentativi-test/candidatura/${idCandidatura}`
    );
}

/**
 * Helper utile per ottenere tutti i punteggi per una lista di candidature.
 * Ritorna una Map<idCandidatura, punteggio>
 */
export async function getPunteggiForCandidature(ids: number[]) {
    const results = new Map<number, number | null>();

    await Promise.all(
        ids.map(async (id) => {
            try {
                const res = await getPunteggioTestByCandidatura(id);
                results.set(id, res?.punteggio ?? null);
            } catch {
                results.set(id, null);
            }
        })
    );

    return results;
}