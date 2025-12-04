"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import { getJson } from "@/services/api";
import Button from "@/components/ui/button";

type TentativoStorico = {
    idTentativo: number;
    idTest: number;
    titoloTest: string;
    esito: string; // SUPERATO / NON_SUPERATO / IN_VALUTAZIONE / ecc.
    completatoAt: string | null;
};

function esitoLabel(esito: string) {
    switch (esito) {
        case "SUPERATO":
            return "Superato";
        case "NON_SUPERATO":
            return "Non superato";
        case "IN_VALUTAZIONE":
            return "In valutazione";
        default:
            return esito;
    }
}

function esitoClass(esito: string) {
    switch (esito) {
        case "SUPERATO":
            return "text-emerald-600";
        case "NON_SUPERATO":
            return "text-red-600";
        case "IN_VALUTAZIONE":
            return "text-amber-600";
        default:
            return "text-[var(--foreground)]";
    }
}

function formatDataOra(value: string | null) {
    if (!value) return "—";
    const d = new Date(value);
    return d.toLocaleString("it-IT", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function TestStoricoPage() {
    const [tentativi, setTentativi] = useState<TentativoStorico[]>([]);
    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setErrore(null);

                // endpoint da allineare al backend
                const data = await getJson<TentativoStorico[]>(
                    "/test/tentativi/miei",
                );
                setTentativi(data ?? []);
            } catch (e: any) {
                console.error("Errore caricamento storico test:", e);
                setErrore(
                    e?.message ||
                    "Si è verificato un errore nel caricamento dello storico test.",
                );
            } finally {
                setLoading(false);
            }
        };

        void load();
    }, []);

    return (
        <section className="max-w-5xl mx-auto space-y-6">
            <PageHeader
                title="Storico test"
                subtitle="Visualizza tutti i tentativi di test che hai svolto."
            />

            {loading && (
                <div className="rounded-2xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento dello storico test in corso…
                    </p>
                </div>
            )}

            {errore && !loading && (
                <div className="rounded-2xl border border-red-500/40 bg-red-900/30 p-6 text-sm text-red-100">
                    {errore}
                </div>
            )}

            {!loading && !errore && tentativi.length === 0 && (
                <EmptyState
                    title="Nessun test svolto"
                    subtitle="Quando completerai un test, lo troverai qui con esito e data di completamento."
                    actionSlot={
                        <Button asChild>
                            <Link href="/candidati/posizioni">
                                Vai alle posizioni
                            </Link>
                        </Button>
                    }
                />
            )}

            {!loading && !errore && tentativi.length > 0 && (
                <div className="rounded-2xl border border-border bg-[var(--card)] overflow-hidden">
                    <table className="w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr className="text-left">
                            <th className="px-4 py-3">Test</th>
                            <th className="px-4 py-3">Esito</th>
                            <th className="px-4 py-3">
                                Completato il
                            </th>
                            <th className="px-4 py-3 text-right">
                                Dettaglio
                            </th>
                        </tr>
                        </thead>
                        <tbody>
                        {tentativi.map((t) => (
                            <tr
                                key={t.idTentativo}
                                className="border-t border-border"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {t.titoloTest}
                                    </div>
                                    <div className="text-xs text-[var(--muted)]">
                                        ID test: {t.idTest}
                                    </div>
                                </td>
                                <td className="px-4 py-3">
                                        <span
                                            className={`text-xs font-medium ${esitoClass(
                                                t.esito,
                                            )}`}
                                        >
                                            {esitoLabel(t.esito)}
                                        </span>
                                </td>
                                <td className="px-4 py-3 text-xs">
                                    {formatDataOra(t.completatoAt)}
                                </td>
                                <td className="px-4 py-3 text-right">
                                    <Link
                                        href={`/candidati/test/${t.idTest}/risultati?tentativo=${t.idTentativo}`}
                                        className="text-sm font-medium text-blue-500 hover:underline"
                                    >
                                        Vedi risultati →
                                    </Link>
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
