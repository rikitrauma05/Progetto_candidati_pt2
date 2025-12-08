"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import { getJson } from "@/services/api";

type Posizione = {
    idPosizione: number;
    titolo: string;
    pubblicataAt?: string | null;
    sede?: string | null;
    contratto?: string | null;
    candidatureRicevute?: number;
};

export default function HrListaPosizioni() {
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);

    // ============================================================
    // CARICA POSIZIONI HR
    // ============================================================
    async function caricaPosizioni() {
        try {
            const data = await getJson<Posizione[]>("/posizioni/hr/mie");
            setPosizioni(data);
        } catch {
            setErrore("Impossibile caricare le posizioni.");
        }
    }

    useEffect(() => {
        const load = async () => {
            await caricaPosizioni();
            setLoading(false);
        };
        load();
    }, []);

    return (
        <section className="space-y-6">

            <PageHeader
                title="Candidati per posizione"
                subtitle="Seleziona una posizione per vedere i candidati e gestire la top 5.
                            Verrano visualizzate solo le candidature che hanno superato l'iter dei test,
                            per facilitare la selezione di candidati adando a presentare solo i migliori"





            />

            {/* LOADING */}
            {loading && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">Caricamento…</p>
                </div>
            )}

            {/* ERROR */}
            {!loading && errore && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-red-500/40 bg-red-900/30 p-6">
                    <p className="text-red-200 text-sm">{errore}</p>
                </div>
            )}

            {/* EMPTY */}
            {!loading && !errore && posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione"
                    subtitle="Non hai ancora pubblicato posizioni."
                />
            )}

            {/* POSIZIONI */}
            {!loading && !errore && posizioni.length > 0 && (
                <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-[var(--card)] overflow-hidden">

                    <div className="border-b border-border px-4 py-3 text-sm text-[var(--muted)]">
                        Posizioni aperte
                    </div>

                    <table className="w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr>
                            <th className="px-4 py-3 text-left">Titolo</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Sede</th>
                            <th className="px-4 py-3 text-left hidden md:table-cell">Contratto</th>
                            <th className="px-4 py-3 text-left">Candidature</th>
                            <th className="px-4 py-3 text-left">Azioni</th>
                        </tr>
                        </thead>

                        <tbody>
                        {posizioni.map((p) => (
                            <tr key={p.idPosizione} className="border-t border-border">

                                <td className="px-4 py-3 font-medium">{p.titolo}</td>

                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {p.sede ?? "—"}
                                </td>

                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {p.contratto ?? "—"}
                                </td>

                                <td className="px-4 py-3 text-xs">
                                    {p.candidatureRicevute ?? 0}
                                </td>

                                <td className="px-4 py-3">
                                    <Button
                                        size="sm"
                                        variant="secondary"
                                        onClick={() =>
                                            router.push(`/hr/candidati/posizioni/${p.idPosizione}`)
                                        }
                                    >
                                        Vedi candidati
                                    </Button>
                                </td>

                            </tr>
                        ))}
                        </tbody>
                    </table>

                </div>
            )}

        </section>
    );
}
