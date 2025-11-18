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
} from "@/types/test";

/**
 * GET /test
 * Restituisce la lista di tutti i test (backend: TestController -> getAllTests).
 */
export function getTestDisponibili() {
    return getJson<TestListItem[]>("/test");
}

/**
 * Storico tentativi del candidato.
 * Al momento il backend non espone ancora l’endpoint,
 * quindi restituiamo una lista vuota senza fare chiamate HTTP.
 */
export async function getTentativiCandidato(): Promise<TentativoListItem[]> {
    return [];
}

/**
 * POST /test/tentativi
 * Avvio di un nuovo tentativo di test.
 * (Endpoint da implementare nel backend; per ora NON viene usato dalle pagine.)
 */
export function avviaTest(data: AvviaTestRequest) {
    return postJson<AvviaTestResponse>("/test/tentativi", data);
}

/**
 * GET /test/tentativi/{idTentativo}/domande
 * Recupera le domande di un tentativo.
 * (Endpoint da implementare nel backend; per ora NON viene usato dalle pagine.)
 */
export function getDomandeTentativo(idTentativo: number) {
    return getJson<GetDomandeResponse>(`/test/tentativi/${idTentativo}/domande`);
}

/**
 * POST /test/tentativi/{idTentativo}/risposte
 * Invio delle risposte di un tentativo.
 * (Endpoint da implementare nel backend; per ora NON viene usato dalle pagine.)
 */
export function inviaRisposte(
    idTentativo: number,
    data: InviaRisposteRequest
) {
    return postJson<InviaRisposteResponse>(
        `/test/tentativi/${idTentativo}/risposte`,
        data
    );
}
