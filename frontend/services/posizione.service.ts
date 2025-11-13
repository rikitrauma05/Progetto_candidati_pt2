// frontend/services/posizione.service.ts
import { getJson } from "./api";
import type { Posizione } from "@/types/posizione";

/**
 * GET /posizioni/topquattro
 * Top posizioni per la home candidato.
 */
export async function getTopQuattroPosizioni(): Promise<Posizione[]> {
    const data = await getJson<Posizione[]>("posizioni/topquattro");
    return data.map((p: Posizione) => ({ ...p, id: p.idPosizione }));
}

/**
 * GET /posizioni/{id}
 * Dettaglio posizione per candidato.
 */
export async function getPosizioneById(id: string | number): Promise<Posizione> {
    const data = await getJson<Posizione>(`posizioni/${id}`);
    return { ...data, id: data.idPosizione };
}

/**
 * GET /posizioni
 * Lista completa posizioni (candidato).
 */
export async function getTutteLePosizioni(): Promise<Posizione[]> {
    const data = await getJson<Posizione[]>("posizioni");
    return data.map((p: Posizione) => ({ ...p, id: p.idPosizione }));
}

/**
 * GET /posizioni?contratto=&sede=&settore=
 * Lista posizioni filtrate lato candidato.
 */
export async function getPosizioniFiltrate(filters: {
    contratto?: string;
    sede?: string;
    settore?: string;
}): Promise<Posizione[]> {
    const params = new URLSearchParams();
    if (filters.contratto) params.append("contratto", filters.contratto);
    if (filters.sede) params.append("sede", filters.sede);
    if (filters.settore) params.append("settore", filters.settore);

    const qs = params.toString();
    const data = await getJson<Posizione[]>(`posizioni${qs ? `?${qs}` : ""}`);
    return data.map((p: Posizione) => ({ ...p, id: p.idPosizione }));
}
