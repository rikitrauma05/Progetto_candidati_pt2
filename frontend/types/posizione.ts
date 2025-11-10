export type Posizione = {
    id: number | string;
    titolo: string;
    sede?: string;
    contratto?: string;
    stato?: "APERTA" | "CHIUSA";
};
