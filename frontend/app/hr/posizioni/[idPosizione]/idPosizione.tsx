"use client";

import { useEffect, useState, FormEvent } from "react";
import { useParams, useRouter } from "next/navigation";

import { getJson, deleteJson } from "@/services/api";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

type Stato = "APERTA" | "CHIUSA";

type Posizione = {
    idPosizione: number;
    titolo: string;
    descrizione?: string;
    sede?: string;
    contratto?: string;
    // altri campi se ti servono
};

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

        const loadData = async () => {
            try {
                setLoading(true);
                setErrore(null);

                const data = await getJson<Posizione>(`/posizioni/${idPosizione}`);

                setTitolo(data.titolo ?? "");
                setDescrizione(data.descrizione ?? "");
                setSede(data.sede ?? "");
                setContratto(data.contratto ?? "");
                // se in futuro hai stato/settore da backend li setti qui
            } catch {
                setErrore("Impossibile caricare la posizione.");
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [idPosizione]);

    async function salvaModifiche(e: FormEvent) {
        e.preventDefault();
        try {
            setLoading(true);
            setErrore(null);
            // TODO: chiamata PUT/PATCH per aggiornare la posizione
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
            const nuovo: Stato = stato === "APERTA" ? "CHIUSA" : "APERTA";
            // TODO: chiamata PATCH per aggiornare solo lo stato
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

            await deleteJson<void>(`/posizioni/${idPosizione}`);

            router.push("/hr/posizioni");
        } catch (err) {
            console.error(err);
            setErrore("Errore durante l'eliminazione.");
        } finally {
            setLoading(false);
        }
    }

    function tornaAllePosizioni() {
        router.push("/hr/posizioni");
    }

    if (loading) {
        return (
            <section className="rounded-2xl p-6 bg-surface border border-border shadow-card text-center">
                <p className="text-muted">Caricamento...</p>
            </section>
        );
    }

    return (
        <section className="space-y-8">
            {/* barra superiore con bottone TORNA ALLE POSIZIONI */}
            <div className="flex items-center justify-between">
                <Button variant="outline" onClick={tornaAllePosizioni}>
                    ← Torna alle posizioni
                </Button>
            </div>

            <div className="rounded-2xl p-6 bg-surface border border-border shadow-card flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-semibold">Dettaglio posizione HR</h2>
                    <p className="text-sm text-muted">
                        Posizione: <span className="font-mono">{titolo}</span>
                    </p>
                </div>

                <div className="flex gap-2">
                    {/* Se in futuro riattivi la modifica, basta scommentare */}
                    {/*<Button variant="outline" onClick={() => setEditing((v) => !v)}>*/}
                    {/*    {editing ? "Annulla" : "Modifica"}*/}
                    {/*</Button>*/}
                    <Button variant="primary" onClick={toggleStato}>
                        {stato === "APERTA" ? "Chiudi posizione" : "Riapri posizione"}
                    </Button>
                    <Button variant="danger" onClick={eliminaPosizione}>
                        Elimina
                    </Button>
                </div>
            </div>

            <form
                onSubmit={salvaModifiche}
                className="rounded-2xl p-6 bg-surface border border-border shadow-card space-y-4"
            >
                {errore && (
                    <div className="rounded-lg border border-red-300 bg-red-50 px-3 py-2 text-sm text-red-700">
                        {errore}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input
                        label="Titolo"
                        value={titolo}
                        onChange={(e) => setTitolo(e.target.value)}
                        disabled={!editing}
                    />
                    <Input
                        label="Sede"
                        value={sede}
                        onChange={(e) => setSede(e.target.value)}
                        disabled={!editing}
                    />
                    <Input
                        label="Contratto"
                        value={contratto}
                        onChange={(e) => setContratto(e.target.value)}
                        disabled={!editing}
                    />
                    <Input
                        label="Settore"
                        value={settore}
                        onChange={(e) => setSettore(e.target.value)}
                        disabled={!editing}
                    />
                    <Select
                        label="Stato"
                        value={stato}
                        onChangeAction={(val: string) => setStato(val as Stato)}
                        options={[
                            { value: "APERTA", label: "APERTA" },
                            { value: "CHIUSA", label: "CHIUSA" },
                        ]}
                        disabled={!editing}
                    />
                </div>

                <Textarea
                    label="Descrizione"
                    value={descrizione}
                    onChangeAction={(val: string) => setDescrizione(val)}
                    disabled={!editing}
                    minRows={7}
                />

                {editing && (
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            Salva modifiche
                        </Button>
                    </div>
                )}
            </form>
        </section>
    );
}
