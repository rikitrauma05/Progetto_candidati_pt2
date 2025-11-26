"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { getJson } from "@/services/api";
import Button from "@/components/ui/button";

type Posizione = {
    idPosizione: number;
    titolo: string;
    sede?: string | null;
    contratto?: string | null;
    settore?: string | null;
    descrizione?: string | null;
    ral?: number | null;
    testAssociato?: {
        idTest: number;
        titolo: string;
    } | null;
};

export default function DettaglioPosizionePage() {
    const params = useParams<{ idPosizione: string }>();
    const idPosizione = Number(params?.idPosizione ?? 0);

    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [posizione, setPosizione] = useState<Posizione | null>(null);

    useEffect(() => {
        if (!idPosizione) {
            setErrore("ID posizione non valido.");
            setLoading(false);
            return;
        }

        async function load() {
            try {
                setErrore(null);
                setLoading(true);

                const data = await getJson<Posizione>(`/posizioni/${idPosizione}`);
                setPosizione(data);
            } catch (e) {
                console.error(e);
                setErrore("Impossibile caricare i dettagli della posizione.");
            } finally {
                setLoading(false);
            }
        }

        load();
    }, [idPosizione]);

    return (
        <main className="min-h-dvh bg-slate-950 text-slate-50">
            <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">

                <header className="flex items-center justify-between">
                    <div>
                        <p className="text-xs uppercase text-sky-400/80 tracking-[0.2em]">
                            area hr
                        </p>
                        <h1 className="mt-2 text-2xl font-semibold">
                            Dettaglio posizione
                        </h1>
                    </div>

                    <Button variant="outline" onClick={() => router.push("/hr/posizioni")}>
                        ← Torna alle posizioni
                    </Button>
                </header>

                {loading && (
                    <p className="text-slate-400 text-sm">Caricamento…</p>
                )}

                {errore && (
                    <div className="rounded-lg border border-red-500 bg-red-950/40 px-3 py-2 text-red-100">
                        {errore}
                    </div>
                )}

                {!loading && !errore && posizione && (
                    <div className="space-y-4 rounded-2xl border border-slate-800 bg-slate-900/80 p-6">

                        <div>
                            <h2 className="text-lg font-semibold">{posizione.titolo}</h2>
                            {posizione.descrizione && (
                                <p className="text-sm text-slate-300 mt-1">
                                    {posizione.descrizione}
                                </p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <p><span className="font-semibold">Sede:</span> {posizione.sede || "—"}</p>
                            <p><span className="font-semibold">Contratto:</span> {posizione.contratto || "—"}</p>
                            <p><span className="font-semibold">Settore:</span> {posizione.settore || "—"}</p>
                            <p>
                                <span className="font-semibold">RAL indicativa:</span>{" "}
                                {posizione.ral ? `€ ${posizione.ral}` : "—"}
                            </p>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold">Test associato</h3>
                            {posizione.testAssociato ? (
                                <p className="mt-1 text-slate-300">
                                    {posizione.testAssociato.titolo} (ID {posizione.testAssociato.idTest})
                                </p>
                            ) : (
                                <p className="mt-1 text-slate-400 text-sm">Nessun test associato</p>
                            )}
                        </div>

                    </div>
                )}
            </section>
        </main>
    );
}
