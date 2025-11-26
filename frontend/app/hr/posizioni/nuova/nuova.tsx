"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";

import { getJson, postJson } from "@/services/api";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import Select from "@/components/ui/select";
import Textarea from "@/components/ui/textarea";

type Sede = "LODI" | "FIRENZE" | "PARMA" | "RAPALLO";
type Contratto = "STAGE" | "PART TIME" | "CONTRATTO" | "DETERMINATO" | "INDETERMINATO"
type Settore = "IT" | "CYBER SECURITY" | "RETI"


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
    const [sede, setSede] = useState<Sede>("LODI");
    const [contratto, setContratto] = useState<Contratto>("INDETERMINATO");
    const [settore, setSettore] = useState<Settore>("IT");
    const [descrizione, setDescrizione] = useState("");
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
                sede: sede,
                contratto: contratto,
                settore: settore,
                descrizione: descrizione.trim() || null,
                //stato: stato,
                ral: ral === "" ? null : ral, // <<< QUI INVIO LA RAL
            };

            if (selectedTestId != null) {
                payload.idTest = selectedTestId;
            }

            const creata = await postJson<PosizioneCreata>("/posizioni", payload);

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
                        <Select
                            label="Sede"
                            value={sede}
                            onChangeAction={(val: string) => setSede(val as Sede)}
                            options={[
                                { value: "Lodi", label: "LODI" },
                                { value: "Firenze", label: "FIRENZE" },
                                { value: "Parma", label: "PARMA" },
                                { value: "Rapallo", label: "RAPALLO" },
                            ]}
                            required
                        />
                        <Select
                            label="Contratto"
                            value={contratto}
                            onChangeAction={(val: string) => setContratto(val as Contratto)}
                            options={[
                                { value: "Stage", label: "Stage" },
                                { value: "Part Time", label: "Part Time" },
                                { value: "Contratto", label: "Contratto" },
                                { value: "Determinato", label: "Determinato" },
                                { value: "Indeterminato", label: "Indeterminato" },
                            ]}
                            required
                        />
                        <Select
                            label="Settore"
                            value={settore}
                            onChangeAction={(val: string) => setSettore(val as Settore)}
                            options={[
                                { value: "Lodi", label: "IT" },
                                { value: "Cyber", label: "CYBER SECURITY" },
                                { value: "Reti", label: "RETI" },
                            ]}
                            required

                        />

                        {/* RAL indicativa */}
                        <div className="flex flex-col gap-1">
                            <label className="text-sm font-medium text-slate-300">
                                RAL indicativa
                            </label>

                            <div className="relative">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400 font-semibold">
                              €
                            </span>
                                <input
                                    type="text"
                                    inputMode="numeric"
                                    placeholder="0"
                                    className="w-full rounded-md bg-slate-900 border border-slate-700 px-3 py-2 pl-7 text-slate-50 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                    value={ral === "" || ral == null ? "" : ral}
                                    onChange={(e) => {
                                        const val = e.target.value.replace(/\D/g, ""); // accetta solo numeri
                                        setRal(val === "" ? "" : Number(val));
                                    }}
                                />
                            </div>
                        </div>
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
                            required
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
                        minRows={10}
                        required
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
