"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Stato = "APERTA" | "CHIUSA";

export default function HrPosizioneDettaglio() {
    const { idPosizione } = useParams<{ idPosizione: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);

    const [titolo, setTitolo] = useState("");
    const [sede, setSede] = useState("");
    const [contratto, setContratto] = useState("");
    const [settore, setSettore] = useState("");
    const [stato, setStato] = useState<Stato>("APERTA");
    const [descrizione, setDescrizione] = useState("");

    useEffect(() => {
        if (!idPosizione) return;
        const bootstrap = async () => {
            try {
                setLoading(true);
                setErrore(null);
                // TODO: carica dati reali dal backend con idPosizione
                // Esempio:
                // const data = await posizioneService.getByIdHR(idPosizione as string)
                // setTitolo(data.titolo) ... etc.
            } catch {
                setErrore("Impossibile caricare la posizione.");
            } finally {
                setLoading(false);
            }
        };
        bootstrap();
    }, [idPosizione]);

    async function salvaModifiche(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setErrore(null);
            // TODO: update
            // await posizioneService.update(idPosizione as string, { titolo, sede, contratto, settore, stato, descrizione })
            setEditing(false);
        } catch {
            setErrore("Errore durante il salvataggio.");
        } finally {
            setLoading(false);
        }
    }

    async function toggleStato() {
        try {
            setLoading(true);
            setErrore(null);
            const nuovo = stato === "APERTA" ? "CHIUSA" : "APERTA";
            // TODO: patch stato
            // await posizioneService.patchStato(idPosizione as string, nuovo)
            setStato(nuovo);
        } catch {
            setErrore("Errore durante l'aggiornamento dello stato.");
        } finally {
            setLoading(false);
        }
    }

    async function eliminaPosizione() {
        if (!confirm("Confermi l'eliminazione della posizione?")) return;
        try {
            setLoading(true);
            setErrore(null);
            // TODO: delete
            // await posizioneService.delete(idPosizione as string)
            router.push("/hr/posizioni");
        } catch {
            setErrore("Errore durante l'eliminazione.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <p className="text-muted">Caricamento...</p>
            </section>
        );
    }

    // Se non sono stati caricati dati reali, mostriamo placeholder “non trovata”
    if (!titolo && !sede && !contratto && !settore && !descrizione) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <h2 className="text-xl font-semibold mb-2">Posizione non trovata</h2>
                <p className="text-muted">Nessun dato disponibile per questa posizione.</p>
                <div className="mt-4">
                    <a href="/hr/posizioni" className="rounded-xl border border-border px-4 py-2 hover:bg-surface">
                        Torna all’elenco
                    </a>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">HR — Posizione</h2>
                    <p className="text-sm text-muted">
                        ID: <span className="font-mono">{String(idPosizione)}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                        onClick={() => setEditing((v) => !v)}
                    >
                        {editing ? "Annulla" : "Modifica"}
                    </button>
                    <button type="button" className="btn" onClick={toggleStato}>
                        {stato === "APERTA" ? "Chiudi posizione" : "Riapri posizione"}
                    </button>
                    <button
                        type="button"
                        className="rounded-xl border border-red-300 text-red-700 px-4 py-2 hover:bg-red-50"
                        onClick={eliminaPosizione}
                    >
                        Elimina
                    </button>
                </div>
            </div>

            <form
                onSubmit={salvaModifiche}
                className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Titolo</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Sede</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            value={sede}
                            onChange={(e) => setSede(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Contratto</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            value={contratto}
                            onChange={(e) => setContratto(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Settore</label>
                        <input
                            type="text"
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                            value={settore}
                            onChange={(e) => setSettore(e.target.value)}
                            disabled={!editing}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Stato</label>
                        <select
                            className="w-full rounded-xl border border-border bg-background px-3 py-2"
                            value={stato}
                            onChange={(e) => setStato(e.target.value as Stato)}
                            disabled={!editing}
                        >
                            <option value="APERTA">APERTA</option>
                            <option value="CHIUSA">CHIUSA</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Descrizione</label>
                    <textarea
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent min-h-[140px]"
                        value={descrizione}
                        onChange={(e) => setDescrizione(e.target.value)}
                        disabled={!editing}
                    />
                </div>

                {editing && (
                    <div className="flex justify-end">
                        <button type="submit" className="btn">
                            Salva modifiche
                        </button>
                    </div>
                )}
            </form>
        </section>
    );
}
