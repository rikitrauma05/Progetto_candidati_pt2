// frontend/services/posizione.service.ts
import { getJson } from "./api";
import type { Posizione } from "@/types/posizione";

export async function getTopQuattroPosizioni(): Promise<Posizione[]> {
    const data = await getJson<Posizione[]>("posizioni/topquattro");
    return data.map((p: Posizione) => ({ ...p, id: p.idPosizione }));
}

export async function getPosizioneById(id: string): Promise<Posizione> {
    const data = await getJson<Posizione>(`posizioni/${id}`);
    return { ...data, id: data.idPosizione };
}

export async function getTutteLePosizioni(): Promise<Posizione[]> {
    const data = await getJson<Posizione[]>("posizioni");
    return data.map((p: Posizione) => ({ ...p, id: p.idPosizione }));
}

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
