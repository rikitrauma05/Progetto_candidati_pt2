import { getJson, postJson } from "./api";
import type {
    TestListItem,
    TentativoListItem,
    AvviaTestRequest,
    AvviaTestResponse,
    GetDomandeResponse,
    InviaRisposteRequest,
    InviaRisposteResponse,
} from "@/types/test";

/**
 * GET /test/disponibili
 * Lista test disponibili per il candidato (eventualmente filtrati per posizione).
 */
export function getTestDisponibili() {
    return getJson<TestListItem[]>("/test/disponibili");
}

/**
 * GET /test/tentativi/miei
 * Storico tentativi del candidato loggato.
 */
export function getTentativiCandidato() {
    return getJson<TentativoListItem[]>("/test/tentativi/miei");
}

/**
 * POST /test/tentativi
 * Avvia un nuovo tentativo per una certa candidatura + test.
 */
export function avviaTest(payload: AvviaTestRequest) {
    return postJson<AvviaTestResponse, AvviaTestRequest>(
        "/test/tentativi",
        payload
    );
}

/**
 * GET /test/tentativi/{idTentativo}/domande
 * Recupera domande + opzioni per svolgere il test.
 */
export function getDomande(idTentativo: number) {
    return getJson<GetDomandeResponse>(
        `/test/tentativi/${idTentativo}/domande`
    );
}

/**
 * POST /test/tentativi/{idTentativo}/risposte
 * Invia le risposte del candidato.
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
