"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

type Stato = "APERTA" | "CHIUSA";

export default function HrNuovaPosizione() {
    const router = useRouter();

    const [titolo, setTitolo] = useState("");
    const [sede, setSede] = useState("");
    const [contratto, setContratto] = useState("");
    const [settore, setSettore] = useState("");
    const [stato, setStato] = useState<Stato>("APERTA");
    const [descrizione, setDescrizione] = useState("");

    const [submitting, setSubmitting] = useState(false);
    const [errore, setErrore] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent) {
        e.preventDefault();
        setErrore(null);

        if (!titolo.trim() || !sede.trim() || !contratto.trim() || !settore.trim()) {
            setErrore("Compila tutti i campi obbligatori.");
            return;
        }

        try {
            setSubmitting(true);
            // TODO: integrazione API create posizione
            router.push("/hr/posizioni");
        } catch {
            setErrore("Errore durante la creazione della posizione.");
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold mb-1">Nuova posizione</h2>
                    <p className="text-muted text-sm">Inserisci i dettagli e salva per creare la posizione.</p>
                </div>
                <a href="/hr/posizioni" className="rounded-xl border border-border px-4 py-2 hover:bg-surface">
                    Torna all’elenco
                </a>
            </div>

            <form onSubmit={onSubmit} className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-5" noValidate>
                {errore && (
                    <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errore}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Titolo *" value={titolo} onChange={(e) => setTitolo(e.target.value)} required />
                    <Input label="Sede *" value={sede} onChange={(e) => setSede(e.target.value)} required />
                    <Input label="Contratto *" value={contratto} onChange={(e) => setContratto(e.target.value)} placeholder="Es. Tempo indeterminato" required />
                    <Input label="Settore *" value={settore} onChange={(e) => setSettore(e.target.value)} placeholder="Es. IT, HR, Data" required />
                    <Select
                        label="Stato"
                        value={stato}
                        onChange={(e) => setStato(e.target.value as Stato)}
                        options={[
                            { value: "APERTA", label: "APERTA" },
                            { value: "CHIUSA", label: "CHIUSA" },
                        ]}
                    />
                </div>

                <Textarea
                    label="Descrizione"
                    value={descrizione}
                    onChange={(e) => setDescrizione(e.target.value)}
                    hint="Responsabilità, requisiti, benefit…"
                    minRows={7}
                />

                <div className="flex justify-end gap-3">
                    <a href="/hr/posizioni" className="rounded-xl border border-border px-4 py-2 hover:bg-surface">
                        Annulla
                    </a>
                    <Button type="submit" disabled={submitting}>
                        {submitting ? "Creazione in corso..." : "Crea posizione"}
                    </Button>
                </div>
            </form>
        </section>
    );
}
