"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getTestDisponibili } from "@/services/test.service";
import type { TestListItem } from "@/types/test/test";

export default function TestPage() {
    const [tests, setTests] = useState<TestListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await getTestDisponibili();
                setTests(data);
            } catch (e: any) {
                console.error("Errore nel caricamento dei test:", e);
                setError(
                    e?.message ||
                    "Si è verificato un errore nel caricamento dei test."
                );
            } finally {
                setLoading(false);
            }
        };

        load();
    }, []);

    return (
        <section className="max-w-5xl mx-auto space-y-6">
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Gestione Test</h1>
                    <p className="text-sm text-[var(--muted)]">
                        Qui puoi creare e gestire i test di valutazione per i
                        candidati.
                    </p>
                </div>

                <Link
                    href="/hr/test/nuova"
                    className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white text-sm font-medium hover:opacity-90"
                >
                    + Crea nuovo test
                </Link>
            </header>

            {loading && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Caricamento dei test in corso…
                    </p>
                </div>
            )}

            {error && !loading && (
                <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-6">
                    <p className="text-sm text-destructive">
                        {error}
                    </p>
                </div>
            )}

            {!loading && !error && tests.length === 0 && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">
                        Non ci sono ancora test creati. Crea il tuo primo test
                        con il pulsante in alto a destra.
                    </p>
                </div>
            )}

            {!loading && !error && tests.length > 0 && (
                <div className="rounded-xl border border-[var(--border)] bg-[var(--card)] overflow-hidden">
                    <table className="min-w-full text-sm">
                        <thead className="bg-[var(--surface)]">
                        <tr className="text-left">
                            <th className="px-4 py-3">Titolo</th>
                            <th className="px-4 py-3 hidden md:table-cell">
                                Tipo
                            </th>
                            <th className="px-4 py-3 hidden md:table-cell">
                                Durata
                            </th>
                            <th className="px-4 py-3">Azioni</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tests.map((test) => (
                            <tr
                                key={test.idTest}
                                className="border-t border-[var(--border)]"
                            >
                                <td className="px-4 py-3">
                                    <div className="font-medium">
                                        {test.titolo}
                                    </div>
                                    {test.descrizione && (
                                        <div className="text-xs text-[var(--muted)] line-clamp-1">
                                            {test.descrizione}
                                        </div>
                                    )}
                                </td>
                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {test.tipo ?? "—"}
                                </td>
                                <td className="px-4 py-3 text-xs hidden md:table-cell">
                                    {test.durataMinuti} min
                                </td>
                                <td className="px-4 py-3">
                                    <Link
                                        href={`/hr/test/${test.idTest}`}
                                        className="text-sm font-medium text-blue-500 hover:underline"
                                    >
                                        Dettagli →
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
