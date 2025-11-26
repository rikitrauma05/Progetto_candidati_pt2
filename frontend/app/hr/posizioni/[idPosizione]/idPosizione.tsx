"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { getJson, postJson } from "@/services/api";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

//type Stato = "APERTA" | "CHIUSA";

type PosizioneCreata = {
    idPosizione: number;
    titolo: string;
};

type TestItem = {
    idTest: number;
    titolo: string;
    descrizione?: string | null;
    durataMinuti?: number | null;
    punteggioMax?: number | null;
};

export default function NuovaPosizionePage() {
    const router = useRouter();

    const [loading, setLoading] = useState(false);
    const [errore, setErrore] = useState<string | null>(null);

    const [titolo, setTitolo] = useState("");
    const [sede, setSede] = useState("");
    const [contratto, setContratto] = useState("");
    const [settore, setSettore] = useState("");
    //const [stato, setStato] = useState<Stato>("APERTA");
    const [descrizione, setDescrizione] = useState("");

    // RAL indicativa
    const [ral, setRal] = useState<number | "" | null>("");

    // TEST DISPONIBILI
    const [tests, setTests] = useState<TestItem[]>([]);
    const [testsLoading, setTestsLoading] = useState(false);
    const [testsErrore, setTestsErrore] = useState<string | null>(null);
    const [selectedTestId, setSelectedTestId] = useState<number | null>(null);

    useEffect(() => {
        const loadTests = async () => {
            try {
                setTestsLoading(true);
                setTestsErrore(null);
                const data = await getJson<TestItem[]>("/test/disponibili");
                setTests(data);
            } catch (err) {
                console.error("Errore caricamento test:", err);
                setTestsErrore("Impossibile caricare la lista dei test.");
            } finally {
                setTestsLoading(false);
            }
        };

        loadTests();
    }, []);

    async function handleSubmit(e: FormEvent) {
        e.preventDefault();

        if (!titolo.trim()) {
            setErrore("Il titolo della posizione è obbligatorio.");
            return;
        }

        try {
            setLoading(true);
            setErrore(null);

            const payload: any = {
                titolo: titolo.trim(),
                sede: sede.trim() || null,
                contratto: contratto.trim() || null,
                settore: settore.trim() || null,
                descrizione: descrizione.trim() || null,
                //stato: stato, // se il tuo backend lo gestisce
                ral: ral === "" ? null : ral, // RAL inviata al backend
            };

            // se è stato selezionato un test, aggiungiamo il campo
            if (selectedTestId != null) {
                // questo nome può essere adattato al tuo DTO backend
                payload.idTest = selectedTestId;
            }

            const creata = await postJson<PosizioneCreata>("/posizioni", payload);

            // dopo la creazione torniamo alla lista posizioni
            // oppure potresti fare router.push(`/hr/posizioni/${creata.idPosizione}`)
            console.log("Posizione creata:", creata);
            router.push("/hr/posizioni");
        } catch (err) {
            console.error("Errore creazione posizione:", err);
            setErrore("Errore durante la creazione della posizione.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <main className="min-h-dvh bg-slate-950 text-slate-50">
            <section className="max-w-4xl mx-auto px-4 py-8 space-y-6">
                {/* HEADER */}
                <header className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <p className="text-xs font-semibold tracking-[0.2em] text-sky-400/80 uppercase">
                            area hr
                        </p>
                        <h1 className="mt-2 text-2xl md:text-3xl font-semibold tracking-tight">
                            Nuova posizione
                        </h1>
                        <p className="mt-1 text-sm text-slate-400 max-w-xl">
                            Crea una nuova posizione e, se vuoi, associa direttamente un test
                            di valutazione ai candidati.
                        </p>
                    </div>

                    <Button variant="outline" onClick={() => router.push("/hr/posizioni")}>
                        ← Torna alle posizioni
                    </Button>
                </header>

                {/* FORM CREAZIONE */}
                <form
                    onSubmit={handleSubmit}
                    className="rounded-2xl border border-slate-800 bg-slate-900/80 p-6 space-y-5 shadow-card"
                >
                    {errore && (
                        <div className="rounded-lg border border-red-500/70 bg-red-950/40 px-3 py-2 text-sm text-red-100">
                            {errore}
                        </div>
                    )}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input
                            label="Titolo posizione"
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            required
                        />
                        <Input
                            label="Sede"
                            value={sede}
                            onChange={(e) => setSede(e.target.value)}
                        />
                        <Input
                            label="Contratto"
                            value={contratto}
                            onChange={(e) => setContratto(e.target.value)}
                        />
                        <Input
                            label="Settore"
                            value={settore}
                            onChange={(e) => setSettore(e.target.value)}
                        />

                        {/* RAL indicativa */}
                        <Input
                            label="RAL indicativa"
                            type="number"
                            value={ral === "" || ral == null ? "" : ral}
                            onChange={(e) =>
                                setRal(e.target.value === "" ? "" : Number(e.target.value))
                            }
                        />

                    </div>

                    {/* SEZIONE TEST ASSOCIATO */}
                    <div className="space-y-2">
                        <Select
                            label="Test associato alla posizione"
                            value={selectedTestId ? String(selectedTestId) : ""}
                            onChangeAction={(val: string) => {
                                if (!val) {
                                    setSelectedTestId(null);
                                } else {
                                    setSelectedTestId(Number(val));
                                }
                            }}
                            options={[
                                { value: "", label: "Nessun test associato" },
                                ...tests.map((t) => ({
                                    value: String(t.idTest),
                                    label: t.titolo,
                                })),
                            ]}
                        />
                        {testsLoading && (
                            <p className="text-[11px] text-slate-400">
                                Caricamento elenco test…
                            </p>
                        )}
                        {testsErrore && (
                            <p className="text-[11px] text-red-300">{testsErrore}</p>
                        )}
                        {!testsLoading && !testsErrore && tests.length === 0 && (
                            <p className="text-[11px] text-slate-400">
                                Non è presente ancora nessun test configurato. Puoi crearne uno
                                dalla sezione Test HR.
                            </p>
                        )}
                    </div>

                    <Textarea
                        label="Descrizione"
                        value={descrizione}
                        onChangeAction={(val: string) => setDescrizione(val)}
                        minRows={7}
                    />

                    <div className="flex justify-end gap-2">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => router.push("/hr/posizioni")}
                        >
                            Annulla
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Salvataggio…" : "Crea posizione"}
                        </Button>
                    </div>
                </form>
            </section>
        </main>
    );
}
