"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { postJson } from "@/services/api";
import { getTestDisponibili } from "@/services/test.service";
import type { TestListItem } from "@/types/test/test";

type Sede = "LODI" | "FIRENZE" | "PARMA" | "RAPALLO";
type Contratto =
    | "STAGE"
    | "PART TIME"
    | "CONTRATTO"
    | "DETERMINATO"
    | "INDETERMINATO";

type PosizioneCreata = {
    idPosizione: number;
};

// ATTENZIONE: questi ID devono corrispondere a quelli della tabella SETTORE nel DB
const SETTORI = [
    { id: 1, label: "Informatica" },
    { id: 2, label: "Cybersecurity" },
    { id: 3, label: "Sistemistica" },
    { id: 4, label: "Sviluppo" },
];

export default function NuovaPosizionePage() {
    const router = useRouter();

    // campi posizione
    const [titolo, setTitolo] = useState("");
    const [sede, setSede] = useState<Sede>("LODI");
    const [contratto, setContratto] = useState<Contratto>("INDETERMINATO");
    const [idSettore, setIdSettore] = useState<string>("1"); // default Informatica
    const [descrizione, setDescrizione] = useState("");
    const [ral, setRal] = useState<number>(0);

    // test
    const [tests, setTests] = useState<TestListItem[]>([]);
    const [selectedTestId, setSelectedTestId] = useState<string>("");
    const [testsLoading, setTestsLoading] = useState(false);
    const [testsError, setTestsError] = useState<string | null>(null);

    // stato form
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadTests = async () => {
            try {
                setTestsLoading(true);
                setTestsError(null);
                const data = await getTestDisponibili();
                setTests(data ?? []);
            } catch (e: any) {
                console.error("Errore caricamento test:", e);
                setTestsError(
                    e?.message ||
                    "Impossibile caricare la lista dei test disponibili.",
                );
            } finally {
                setTestsLoading(false);
            }
        };

        void loadTests();
    }, []);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!titolo.trim()) {
            setError("Il titolo della posizione è obbligatorio.");
            return;
        }

        try {
            setLoading(true);
            setError(null);

            const payload: any = {
                titolo: titolo.trim(),
                sede,
                contratto,
                descrizione: descrizione.trim() || null,
                ral: ral === 0 ? null : Number(ral),
                // qui mandiamo l'oggetto idSettore come si aspetta l'entity Posizione
                idSettore: {
                    idSettore: Number(idSettore),
                },
            };

            if (selectedTestId !== "") {
                payload.idTest = Number(selectedTestId);
            }

            const risposta = await postJson<PosizioneCreata>(
                "/posizioni",
                payload,
            );

            if (risposta?.idPosizione) {
                router.push(`/hr/posizioni/${risposta.idPosizione}`);
            } else {
                router.push("/hr/posizioni");
            }
        } catch (e: any) {
            console.error("Errore creazione posizione:", e);
            setError(
                e?.message ||
                "Si è verificato un errore durante la creazione della posizione.",
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <section className="max-w-4xl mx-auto space-y-6">
            {/* HEADER */}
            <header className="flex items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-semibold">Nuova posizione</h1>
                    <p className="text-sm text-[var(--muted)]">
                        Crea una nuova posizione e, se vuoi, associa un test di
                        valutazione.
                    </p>
                </div>

                <button
                    type="button"
                    onClick={() => router.push("/hr/posizioni")}
                    className="px-4 py-2 rounded-lg border border-[var(--border)] font-medium hover:bg-[var(--accent)]/10"
                >
                    Torna alle posizioni
                </button>
            </header>

            {/* FORM */}
            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6 border rounded-xl bg-[var(--card)]"
            >
                {error && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                        {error}
                    </div>
                )}

                {/* dati base */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Titolo</label>
                        <input
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            placeholder="Es. Junior Developer"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">Sede</label>
                            <select
                                value={sede}
                                onChange={(e) =>
                                    setSede(e.target.value as Sede)
                                }
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            >
                                <option value="LODI">Lodi</option>
                                <option value="FIRENZE">Firenze</option>
                                <option value="PARMA">Parma</option>
                                <option value="RAPALLO">Rapallo</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Contratto
                            </label>
                            <select
                                value={contratto}
                                onChange={(e) =>
                                    setContratto(
                                        e.target.value as Contratto,
                                    )
                                }
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            >
                                <option value="STAGE">Stage</option>
                                <option value="PART TIME">Part time</option>
                                <option value="CONTRATTO">Contratto</option>
                                <option value="DETERMINATO">
                                    Tempo determinato
                                </option>
                                <option value="INDETERMINATO">
                                    Tempo indeterminato
                                </option>
                            </select>
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Settore
                            </label>
                            <select
                                value={idSettore}
                                onChange={(e) =>
                                    setIdSettore(e.target.value)
                                }
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            >
                                {SETTORI.map((s) => (
                                    <option key={s.id} value={s.id.toString()}>
                                        {s.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Descrizione
                        </label>
                        <textarea
                            value={descrizione}
                            onChange={(e) =>
                                setDescrizione(e.target.value)
                            }
                            className="w-full px-3 py-2 rounded-md border bg-[var(--input)] h-24"
                            placeholder="Descrivi le attività e i requisiti della posizione…"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                RAL (opzionale)
                            </label>
                            <input
                                type="number"
                                min={0}
                                value={ral}
                                onChange={(e) => setRal(Number(e.target.value))}
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                                placeholder="Es. 28000"
                            />
                        </div>
                    </div>
                </div>

                {/* test associato */}
                <div className="border-t border-[var(--border)] pt-4 space-y-3">
                    <h2 className="text-sm font-semibold">
                        Test di valutazione (opzionale)
                    </h2>
                    <p className="text-xs text-[var(--muted)]">
                        Seleziona un test da associare alla posizione. I
                        candidati dovranno svolgerlo durante il processo di
                        selezione.
                    </p>

                    {testsLoading && (
                        <p className="text-xs text-[var(--muted)]">
                            Caricamento test disponibili…
                        </p>
                    )}

                    {testsError && (
                        <p className="text-xs text-destructive">{testsError}</p>
                    )}

                    {!testsLoading && !testsError && tests.length === 0 && (
                        <p className="text-xs text-[var(--muted)]">
                            Non ci sono test disponibili. Puoi crearne uno
                            dalla sezione &quot;Test&quot;.
                        </p>
                    )}

                    {!testsLoading && !testsError && tests.length > 0 && (
                        <div>
                            <label className="text-sm font-medium">
                                Test associato
                            </label>
                            <select
                                value={selectedTestId}
                                onChange={(e) =>
                                    setSelectedTestId(e.target.value)
                                }
                                className="mt-1 w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            >
                                <option value="">
                                    Nessun test (lascia vuoto)
                                </option>
                                {tests.map((t) => (
                                    <option key={t.idTest} value={t.idTest}>
                                        {t.titolo}
                                        {t.durataMinuti
                                            ? ` – ${t.durataMinuti} min`
                                            : ""}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/hr/posizioni")}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] font-medium hover:bg-[var(--accent)]/10"
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 disabled:opacity-60"
                    >
                        {loading
                            ? "Salvataggio in corso…"
                            : "Crea posizione"}
                    </button>
                </div>
            </form>
        </section>
    );
}
