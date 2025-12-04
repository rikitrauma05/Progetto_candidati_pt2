// components/ApplyButton.tsx (o dove si trova)

"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { getJson, postJson } from "@/services/api";

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
    const [idTest, setIdTest] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setError(null);

                const candidature = await getJson<Candidatura[]>("/candidature/mie");
                const lista = candidature ?? [];
                const found = lista.find(
                    (c) => c.posizione?.idPosizione === idPosizione,
                );

                setAlreadyApplied(!!found);

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
            }
        };

        void load();
    }, [idPosizione]);

    async function handleApply() {
        if (loading || alreadyApplied) return;

        try {
            setLoading(true);
            setError(null);

            await postJson<{ message: string }, { idPosizione: number }>(
                "/candidature",
                { idPosizione },
            );

            setAlreadyApplied(true);

            // ✅ Passa idPosizione nell'URL
            if (idTest) {
                router.push(`/candidati/test/${idTest}/introduzione?idPosizione=${idPosizione}`);
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

    function handleGoToTest() {
        if (!idTest) return;
        // ✅ Passa idPosizione nell'URL
        router.push(`/candidati/test/${idTest}/introduzione?idPosizione=${idPosizione}`);
    }

    return (
        <div
            className={`flex flex-wrap items-center gap-2 ${
                fullWidth ? "w-full" : ""
            }`}
        >
            <Button
                type="button"
                className={fullWidth ? "flex-1" : ""}
                variant={alreadyApplied ? "outline" : "primary"}
                disabled={loading || alreadyApplied}
                onClick={alreadyApplied ? undefined : handleApply}
            >
                {alreadyApplied
                    ? "Candidato"
                    : loading
                        ? "Invio in corso…"
                        : "Candidati"}
            </Button>

            {alreadyApplied && idTest && (
                <Button
                    type="button"
                    variant="outline"
                    disabled={loading || alreadyApplied}
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