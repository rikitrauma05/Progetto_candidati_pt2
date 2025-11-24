"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { getJson, postJson, deleteJson } from "@/services/api";

type Candidatura = {
    idCandidatura: number;
    posizione?: {
        idPosizione: number;
    };
};

type PosizioneApi = {
    idPosizione: number;
    idTest?: number | null;
};

type ApplyButtonProps = {
    idPosizione: number;
    fullWidth?: boolean;
};

export default function ApplyButton({ idPosizione, fullWidth }: ApplyButtonProps) {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [alreadyApplied, setAlreadyApplied] = useState(false);
    const [candidaturaId, setCandidaturaId] = useState<number | null>(null);
    const [idTest, setIdTest] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // All'avvio:
    // 1) vede se esiste già una candidatura per questa posizione (/candidature/mie)
    // 2) legge i dettagli della posizione e si prende l'idTest (/posizioni/{id})
    useEffect(() => {
        const load = async () => {
            try {
                setError(null);

                // 1) Stato candidatura
                const candidature = await getJson<Candidatura[]>("/candidature/mie");
                const lista = candidature ?? [];
                const found = lista.find(
                    (c) => c.posizione?.idPosizione === idPosizione,
                );

                if (found) {
                    setAlreadyApplied(true);
                    setCandidaturaId(found.idCandidatura);
                } else {
                    setAlreadyApplied(false);
                    setCandidaturaId(null);
                }

                // 2) Dettaglio posizione → idTest
                const pos = await getJson<PosizioneApi>(`/posizioni/${idPosizione}`);
                if (pos && typeof pos.idTest !== "undefined" && pos.idTest !== null) {
                    setIdTest(pos.idTest);
                } else {
                    setIdTest(null);
                }
            } catch (e) {
                console.error(
                    "Errore nel caricamento stato candidatura/posizione:",
                    e,
                );
                // se fallisce, lasciamo il bottone "Candidati" e niente test
            }
        };

        void load();
    }, [idPosizione]);

    async function handleApply() {
        if (loading || alreadyApplied) return;

        try {
            setLoading(true);
            setError(null);

            const nuova = await postJson<Candidatura, { idPosizione: number }>(
                "/candidature",
                { idPosizione },
            );

            if (nuova) {
                setAlreadyApplied(true);
                setCandidaturaId(nuova.idCandidatura);
            }

            // Se esiste un test associato, dopo esserti candidato puoi andare al test
            if (idTest) {
                router.push(`/candidati/test/${idTest}/introduzione`);
            }
        } catch (e: any) {
            console.error("Errore invio candidatura:", e);
            setError(
                e?.message ??
                "Si è verificato un errore durante l'invio della candidatura.",
            );
        } finally {
            setLoading(false);
        }
    }

    async function handleWithdraw() {
        if (!candidaturaId || loading) return;

        try {
            setLoading(true);
            setError(null);

            await deleteJson(`/candidature/${candidaturaId}`);

            setAlreadyApplied(false);
            setCandidaturaId(null);
        } catch (e: any) {
            console.error("Errore ritiro candidatura:", e);
            setError(
                e?.message ??
                "Si è verificato un errore durante il ritiro della candidatura.",
            );
        } finally {
            setLoading(false);
        }
    }

    function handleGoToTest() {
        if (!idTest) return;
        router.push(`/candidati/test/${idTest}/introduzione`);
    }

    return (
        <div
            className={`flex flex-wrap items-center gap-2 ${
                fullWidth ? "w-full" : ""
            }`}
        >
            {/* Bottone principale: Candidati / Candidato */}
            <Button
                type="button"
                className={fullWidth ? "flex-1" : ""}
                variant={alreadyApplied ? "outline" : "primary"}
                disabled={loading}
                onClick={alreadyApplied ? undefined : handleApply}
            >
                {alreadyApplied
                    ? "Candidato"
                    : loading
                        ? "Invio in corso…"
                        : "Candidati"}
            </Button>

            {/* Se sei già candidato → puoi ritirare la candidatura */}
            {alreadyApplied && (
                <Button
                    type="button"
                    variant="ghost"
                    disabled={loading}
                    onClick={handleWithdraw}
                    className="text-xs md:text-sm"
                >
                    Ritira candidatura
                </Button>
            )}

            {/* Se sei candidato e la posizione ha un test → mostra "Vai al test" */}
            {alreadyApplied && idTest && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading}
                    onClick={handleGoToTest}
                    className={fullWidth ? "flex-1" : ""}
                >
                    Vai al test
                </Button>
            )}

            {error && (
                <p className="w-full text-xs text-red-400 mt-1 text-right">
                    {error}
                </p>
            )}
        </div>
    );
}
