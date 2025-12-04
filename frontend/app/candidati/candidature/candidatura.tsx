"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import { API_BASE_URL } from "@/services/api";
import { useAuthStore } from "@/store/authStore";

type CandidaturaApi = {
    idCandidatura: number;
    posizione: {
        idPosizione: number;
        titolo: string;
        sede?: string | null;
        contratto?: string | null;
    };
    createdAT: string;
    stato?: {
        codice: string;
        descrizione?: string | null;
    } | null;
    punteggioTest?: number | null;
    numeroDomande?: number | null;
};

function formatData(dataIso: string) {
    const d = new Date(dataIso);
    return d.toLocaleDateString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
    });
}

function formatStato(stato?: CandidaturaApi["stato"]) {
    const codice = stato?.codice;
    if (!codice) return "—";

    switch (codice) {
        case "IN_VALUTAZIONE":
            return "In valutazione";
        case "RESPINTA":
            return "Respinta";
        case "ACCETTATA":
            return "Accettata";
        default:
            return stato?.descrizione || codice;
    }
}

export default function CandidatureCandidato() {
    const [candidature, setCandidature] = useState<CandidaturaApi[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const { accessToken } = useAuthStore();
    const router = useRouter();


    async function loadCandidature() {
        if (!accessToken) {
            setErrore("Utente non autenticato");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setErrore(null);

            const res = await fetch(`${API_BASE_URL}/candidature/mie`, {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    "Content-Type": "application/json",
                },
            });

            const text = await res.text();
            if (!res.ok) {
                throw new Error(text || "Errore nel caricamento delle candidature");
            }

            const data: CandidaturaApi[] = JSON.parse(text);
            setCandidature(data);
        } catch (err: any) {
            console.error(err);
            setErrore(err.message ?? "Errore imprevisto");
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadCandidature();
    }, [accessToken]);

    const handleTornaAlleCandidature = async () => {
        await loadCandidature();
        router.push("/candidati/candidature");
    };

    return (
        <div className="space-y-6">
            <PageHeader
                title="Le mie candidature"
                subtitle="Visualizza lo stato delle posizioni per cui ti sei candidato."
            />

            {loading && (
                <p className="text-sm text-[var(--muted)]">
                    Caricamento delle candidature in corso…
                </p>
            )}

            {errore && (
                <div className="max-w-3xl mx-auto rounded-xl border border-red-500/40 bg-red-900/30 px-4 py-3 text-sm text-red-100">
                    {errore}
                </div>
            )}

            {!loading && !errore && candidature.length === 0 && (
                <EmptyState
                    title="Nessuna candidatura inviata"
                    subtitle="Non hai ancora inviato candidature. Trova una posizione adatta a te e candidati subito."
                    actionSlot={
                        <Button asChild onClick={handleTornaAlleCandidature}>
                            <Link href="/candidati/posizioni">
                                Vedi posizioni aperte
                            </Link>
                        </Button>
                    }
                />
            )}

            {!loading && !errore && candidature.length > 0 && (
                <section className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr className="text-left">
                            <th className="px-4 py-3">Posizione</th>
                            <th className="px-4 py-3 hidden md:table-cell">
                                Data candidatura
                            </th>
                            <th className="px-4 py-3">Punteggio test</th>
                            <th className="px-4 py-3">Stato candidatura</th>
                            <th className="px-4 py-3 text-right">Azioni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {candidature.map((c) => (
                            <tr
                                key={c.idCandidatura}
                                className="border-t border-border"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {c.posizione.titolo}
                                    </div>
                                    <div className="text-xs text-[var(--muted)]">
                                        {[c.posizione.sede, c.posizione.contratto]
                                            .filter(Boolean)
                                            .join(" • ")}
                                    </div>
                                </td>
                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {formatData(c.createdAT)}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    {typeof c.punteggioTest === "number"
                                        ? `${((c.punteggioTest / (c?.numeroDomande ?? 1)) * 100).toFixed(2)}%`
                                        : "Nessun test previsto"}
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    {formatStato(c.stato)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Button asChild size="sm">
                                        <Link
                                            href={`/candidati/posizioni/${c.posizione.idPosizione}`}
                                        >
                                            Dettaglio
                                        </Link>
                                    </Button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </section>
            )}

        </div>
    );
}
