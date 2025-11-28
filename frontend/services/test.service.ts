// frontend/services/test.service.ts

import { getJson, postJson } from "./api";

import type {
    TentativoListItem,
    AvviaTestRequest,
    AvviaTestResponse,
    GetDomandeResponse,
    InviaRisposteRequest,
    InviaRisposteResponse,
    RisultatoTentativoDettaglio,
} from "@/types/test/tentativo-test";


import type {
    TestListItem,
    StrutturaTestDto,
    TestCreateRequest,
} from "@/types/test/test"

/* ============================================================
 *  LISTE TEST
 * ============================================================*/

/**
 * Lista di TUTTI i test (uso HR/admin).
 * GET /api/test
 */
export function getTests() {
    return getJson<TestListItem[]>("/test");
}

/**
 * Lista dei test disponibili per il candidato.
 * GET /api/test/disponibili
 */
export function getTestDisponibili() {
    return getJson<TestListItem[]>("/test/disponibili");
}

/* ============================================================
 *  TENTATIVI CANDIDATO
 * ============================================================*/

/**
 * Storico tentativi del candidato loggato.
 * GET /api/test/tentativi/miei
 *
 * Restituisce solo gli ULTIMI 10 tentativi.
 */
export async function getTentativiCandidato(): Promise<TentativoListItem[]> {
    // NB: niente /api qui, ci pensa API_BASE_URL in api.ts
    const tentativi = await getJson<TentativoListItem[]>("/test/tentativi/miei");
    return tentativi.slice(0, 10);
}

/* ============================================================
 *  GESTIONE TEST (HR/Admin)
 * ============================================================*/

/**
 * Creazione di un nuovo test.
 * POST /api/test
 */
export function creaTest(payload: TestCreateRequest) {
    return postJson<StrutturaTestDto, TestCreateRequest>("/test", payload);
}

/**
 * Struttura completa test lato HR (intro + domande).
 * GET /api/test/{idTest}/struttura
 */
export function getStrutturaTest(idTest: number) {
    return getJson<StrutturaTestDto>(`/test/${idTest}/struttura`);
}

/* ============================================================
 *  AVVIO E SVOLGIMENTO TEST (Candidato)
 * ============================================================*/

/**
 * Avvio tentativo test per il candidato.
 * POST /api/test/{idTest}/tentativi/avvia
 */
export function avviaTest(idTest: number, payload?: AvviaTestRequest) {
    return postJson<AvviaTestResponse, AvviaTestRequest | {}>(
        `/test/${idTest}/tentativi/avvia`,
        (payload ?? {}) as AvviaTestRequest | {}
    );
}

/**
 * Elenco domande per un tentativo specifico.
 * GET /api/test/tentativi/{idTentativo}/domande
 */
export function getDomandeTentativo(idTentativo: number) {
    return getJson<GetDomandeResponse>(`/test/tentativi/${idTentativo}/domande`);
}

/**
 * Invio in blocco di TUTTE le risposte del test.
 * POST /api/test/tentativi/{idTentativo}/risposte
 */
export function inviaRisposte(
    idTentativo: number,
    payload: InviaRisposteRequest
) {
    return postJson<InviaRisposteResponse, InviaRisposteRequest>(
        `/test/tentativi/${idTentativo}/risposte`,
        payload
    );
}

/* ============================================================
 *  RISPOSTA SINGOLA (eventuale)
 * ============================================================*/

export type InviaRispostaSingolaRequest = {
    idDomanda: number;
    idOpzione: number | null;
};

/**
 * Invio risposta SINGOLA.
 * POST /api/test/tentativi/{idTentativo}/risposte/singola
 */
export function inviaRispostaSingola(
    idTentativo: number,
    payload: InviaRispostaSingolaRequest
) {
    return postJson<void, InviaRispostaSingolaRequest>(
        `/test/tentativi/${idTentativo}/risposte/singola`,
        payload
    );
}

/**
 * Completa il test (fine tempo o ultima domanda).
 * POST /api/test/tentativi/{idTentativo}/completa
 */
export function completaTest(idTentativo: number) {
    return postJson<void, {}>(`/test/tentativi/${idTentativo}/completa`, {});
}

/* ============================================================
 *  RISULTATI TEST
 * ============================================================*/

/**
 * Risultato dettagliato del tentativo.
 * GET /api/test/tentativi/{idTentativo}/risultati
 */
export function getRisultatoTentativo(idTentativo: number) {
    return getJson<RisultatoTentativoDettaglio>(
        `/test/tentativi/${idTentativo}/risultati`
    );
}
