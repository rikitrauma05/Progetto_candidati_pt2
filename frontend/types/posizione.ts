export type StatoPosizione = "APERTA" | "CHIUSA";

export interface Posizione {
    id: string;
    titolo: string;
    sede: string;
    contratto: string;
    settore: string;
    stato: StatoPosizione;
    aggiornataIl: string;
}
