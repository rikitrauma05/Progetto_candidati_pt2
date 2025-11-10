"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function HrCandidatoDettaglio() {
    const { idCandidato } = useParams<{ idCandidato: string }>();
    const router = useRouter();

    const [loading, setLoading] = useState(true);
    const [errore, setErrore] = useState<string | null>(null);
    const [modifica, setModifica] = useState(false);

    // Dati profilo (placeholders, nessun mock: saranno popolati via API)
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [email, setEmail] = useState("");
    const [telefono, setTelefono] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        if (!idCandidato) return;
        const bootstrap = async () => {
            try {
                setLoading(true);
                setErrore(null);
                // TODO: carica dati reali
                // const data = await candidatoService.getById(idCandidato as string)
                // setNome(data.nome) ...
            } catch {
                setErrore("Impossibile caricare il candidato.");
            } finally {
                setLoading(false);
            }
        };
        bootstrap();
    }, [idCandidato]);

    async function salvaModifiche(e: React.FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setErrore(null);
            // TODO: update candidato
            // await candidatoService.update(idCandidato as string, { nome, cognome, email, telefono, note })
            setModifica(false);
        } catch {
            setErrore("Errore durante il salvataggio.");
        } finally {
            setLoading(false);
        }
    }

    async function eliminaCandidato() {
        if (!confirm("Confermi l'eliminazione del candidato?")) return;
        try {
            setLoading(true);
            setErrore(null);
            // TODO: delete candidato
            // await candidatoService.delete(idCandidato as string)
            router.push("/hr/candidati");
        } catch {
            setErrore("Errore durante l'eliminazione.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <p className="text-muted">Caricamento…</p>
            </section>
        );
    }

    // Se non ci sono dati caricati mostriamo placeholder “non trovato”
    if (!nome && !cognome && !email && !telefono && !note) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <h2 className="text-xl font-semibold mb-2">Candidato non trovato</h2>
                <p className="text-muted">Nessuna informazione disponibile.</p>
                <div className="mt-4">
                    <a href="/hr/candidati" className="rounded-xl border border-border px-4 py-2 hover:bg-surface">
                        Torna all’elenco
                    </a>
                </div>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            {/* Header */}
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">HR — Candidato</h2>
                    <p className="text-sm text-muted">
                        ID: <span className="font-mono">{String(idCandidato)}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    <button
                        type="button"
                        className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                        onClick={() => setModifica((v) => !v)}
                    >
                        {modifica ? "Annulla" : "Modifica"}
                    </button>
                    <button
                        type="button"
                        className="rounded-xl border border-red-300 text-red-700 px-4 py-2 hover:bg-red-50"
                        onClick={eliminaCandidato}
                    >
                        Elimina
                    </button>
                </div>
            </div>

            {/* Form profilo */}
            <form
                onSubmit={salvaModifiche}
                className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4"
                noValidate
            >
                {errore && (
                    <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errore}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium">Nome</label>
                        <input
                            type="text"
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                            disabled={!modifica}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Cognome</label>
                        <input
                            type="text"
                            value={cognome}
                            onChange={(e) => setCognome(e.target.value)}
                            disabled={!modifica}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            disabled={!modifica}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Telefono</label>
                        <input
                            type="tel"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                            disabled={!modifica}
                            className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium">Note interne</label>
                    <textarea
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                        disabled={!modifica}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-accent min-h-[120px]"
                        placeholder="Aggiungi valutazioni interne, esiti colloqui, ecc."
                    />
                </div>

                {modifica && (
                    <div className="flex justify-end">
                        <button type="submit" className="btn">Salva modifiche</button>
                    </div>
                )}
            </form>

            {/* Sezioni correlate */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <section className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                    <h3 className="text-lg font-semibold mb-2">Candidature del candidato</h3>
                    <div className="h-32 rounded-xl border border-dashed border-border grid place-items-center text-muted">
                        Saranno elencate le candidature con stato e date.
                    </div>
                </section>

                <section className="rounded-2xl p-6 bg-surface border border-border shadow-card">
                    <h3 className="text-lg font-semibold mb-2">Test sostenuti</h3>
                    <div className="h-32 rounded-xl border border-dashed border-border grid place-items-center text-muted">
                        Saranno elencati i test, i punteggi e l’esito.
                    </div>
                </section>
            </div>
        </section>
    );
}
