// frontend/services/test.service.ts

import { getJson, postJson } from "./api";

import type {
    TestListItem,
    TentativoListItem,
    AvviaTestRequest,
    AvviaTestResponse,
    GetDomandeResponse,
    InviaRisposteRequest,
    InviaRisposteResponse,
    StrutturaTestDto,
    RisultatoTentativoDettaglio,
    TestCreateRequest,
} from "@/types/test";

/**
 * Lista di TUTTI i test (uso generico, lato HR o debug).
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

/**
 * Storico tentativi del candidato loggato.
 * GET /api/test/tentativi/miei
 */
export function getTentativiCandidato() {
    return getJson<TentativoListItem[]>("/test/tentativi/miei");
}

/**
 * Creazione di un nuovo test (HR/admin).
 * POST /api/test
 */
export function creaTest(payload: TestCreateRequest) {
    return postJson<StrutturaTestDto, TestCreateRequest>("/test", payload);
}

/**
 * Struttura completa test (intro + domande) lato HR.
 * GET /api/test/{idTest}/struttura
 */
export function getStrutturaTest(idTest: number) {
    return getJson<StrutturaTestDto>(`/test/${idTest}/struttura`);
}

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
 * Domande per un tentativo specifico.
 * GET /api/test/tentativi/{idTentativo}/domande
 */
export function getDomandeTentativo(idTentativo: number) {
    return getJson<GetDomandeResponse>(
        `/test/tentativi/${idTentativo}/domande`
    );
}

/**
 * Invio di TUTTE le risposte in un colpo solo (flusso attuale).
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

/**
 * Tipo per eventuale invio risposta singola (se in futuro la useremo).
 */
export type InviaRispostaSingolaRequest = {
    idDomanda: number;
    idOpzione: number | null;
};

/**
 * Invio di UNA sola risposta alla volta.
 * POST /api/test/tentativi/{idTentativo}/risposte/singola
 * (endpoint da aggiungere nel backend se/quando lo useremo)
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
 * (endpoint da aggiungere nel backend se/quando lo useremo)
 */
export function completaTest(idTentativo: number) {
    return postJson<void, {}>(
        `/test/tentativi/${idTentativo}/completa`,
        {}
    );
}

/**
 * Risultato dettagliato del tentativo.
 * GET /api/test/tentativi/{idTentativo}/risultati
 */
export function getRisultatoTentativo(idTentativo: number) {
    return getJson<RisultatoTentativoDettaglio>(
        `/test/tentativi/${idTentativo}/risultati`
    );
}
