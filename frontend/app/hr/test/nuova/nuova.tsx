"use client";

import { useState } from "react";
import type React from "react";
import { useRouter } from "next/navigation";
import { creaTest } from "@/services/test.service";
import type { TestCreateRequest, TestType } from "@/types/test/test";

type OpzioneForm = {
    testoOpzione: string;
    corretta: boolean;
};

type DomandaForm = {
    testo: string;
    punteggio: number;
    opzioni: OpzioneForm[];
};

const TIPI_TEST: { codice: TestType; label: string }[] = [
    { codice: "SOFT_SKILLS", label: "Soft skills (valutazione attitudinale)" },
    { codice: "TECNICO", label: "Tecnico (competenze tecniche)" },
];

export default function NuovaTest() {
    const router = useRouter();

    const [titolo, setTitolo] = useState("");
    const [descrizione, setDescrizione] = useState("");
    const [durataMinuti, setDurataMinuti] = useState<number>(20);
    const [punteggioMin, setPunteggioMin] = useState<number>(0);
    const [tipoTest, setTipoTest] = useState<TestType>("SOFT_SKILLS");

    const [domande, setDomande] = useState<DomandaForm[]>([
        {
            testo: "",
            punteggio: 1,
            opzioni: [
                { testoOpzione: "", corretta: true },
                { testoOpzione: "", corretta: false },
            ],
        },
    ]);

    const [error, setError] = useState<string | null>(null);
    const [saving, setSaving] = useState(false);

    // ============================================================
    // VALIDAZIONI CLIENT
    // ============================================================

    const validateBeforeSubmit = (): string | null => {
        if (durataMinuti < 1 || durataMinuti > 60) {
            return "La durata deve essere compresa tra 1 e 60 minuti.";
        }

        if (domande.length === 0) {
            return "Devi inserire almeno una domanda.";
        }

        if (domande.length > 20) {
            return "Non puoi inserire più di 20 domande.";
        }

        if (punteggioMin < 0) {
            return "Il punteggio minimo non può essere negativo.";
        }

        // Mappa: testo normalizzato domanda -> indici (1-based) dove compare
        const mappaDomande: Record<string, number[]> = {};

        for (let i = 0; i < domande.length; i++) {
            const d = domande[i];
            const testoNorm = d.testo.trim().toLowerCase();

            if (!testoNorm) {
                return `Il testo della domanda ${i + 1} è obbligatorio.`;
            }

            if (!mappaDomande[testoNorm]) {
                mappaDomande[testoNorm] = [];
            }
            mappaDomande[testoNorm].push(i + 1); // per messaggio umano

            if (!d.opzioni || d.opzioni.length < 2) {
                return `La domanda ${i + 1} deve avere almeno due opzioni di risposta.`;
            }

            const hasCorretta = d.opzioni.some((o) => o.corretta);
            if (!hasCorretta) {
                return `La domanda ${i + 1} deve avere almeno un'opzione corretta.`;
            }

            // Controllo opzioni duplicate nella singola domanda
            const opzioniSet = new Set<string>();
            for (let j = 0; j < d.opzioni.length; j++) {
                const op = d.opzioni[j];
                const testoOpNorm = op.testoOpzione.trim().toLowerCase();

                if (!testoOpNorm) {
                    return `Il testo dell'opzione ${j + 1} della domanda ${i + 1} è obbligatorio.`;
                }

                if (opzioniSet.has(testoOpNorm)) {
                    return `Le opzioni della domanda ${i + 1} contengono testi duplicati. Modifica le opzioni per renderle tutte diverse.`;
                }

                opzioniSet.add(testoOpNorm);
            }
        }

        // Individuiamo le domande duplicate (testo identico)
        const duplicateGroups = Object.entries(mappaDomande).filter(
            ([_, indices]) => indices.length > 1
        );

        if (duplicateGroups.length > 0) {
            const dettagli = duplicateGroups
                .map(
                    ([testo, indices]) =>
                        `- "${testo}" usata nelle domande: ${indices.join(", ")}`
                )
                .join("\n");

            return `Le seguenti domande risultano duplicate (testo identico):\n${dettagli}`;
        }

        return null;
    };

    // ============================================================
    // HANDLER DOMANDE/OPZIONI
    // ============================================================

    const aggiungiDomanda = () => {
        if (domande.length >= 20) {
            setError("Non puoi aggiungere più di 20 domande.");
            return;
        }

        setDomande((prev) => [
            ...prev,
            {
                testo: "",
                punteggio: 1,
                opzioni: [
                    { testoOpzione: "", corretta: true },
                    { testoOpzione: "", corretta: false },
                ],
            },
        ]);
    };

    const rimuoviDomanda = (index: number) => {
        setDomande((prev) => prev.filter((_, i) => i !== index));
    };

    const handleDomandaChange = (
        index: number,
        field: "testo" | "punteggio",
        value: string
    ) => {
        setDomande((prev) =>
            prev.map((d, i) =>
                i === index
                    ? {
                        ...d,
                        [field]:
                            field === "punteggio" ? Number(value) : value,
                    }
                    : d
            )
        );
    };

    const handleOpzioneChange = (
        indexDomanda: number,
        indexOpzione: number,
        value: string
    ) => {
        setDomande((prev) =>
            prev.map((d, i) =>
                i === indexDomanda
                    ? {
                        ...d,
                        opzioni: d.opzioni.map((o, j) =>
                            j === indexOpzione
                                ? { ...o, testoOpzione: value }
                                : o
                        ),
                    }
                    : d
            )
        );
    };

    const setOpzioneCorretta = (
        indexDomanda: number,
        indexOpzione: number
    ) => {
        setDomande((prev) =>
            prev.map((d, i) =>
                i === indexDomanda
                    ? {
                        ...d,
                        opzioni: d.opzioni.map((o, j) => ({
                            ...o,
                            corretta: j === indexOpzione,
                        })),
                    }
                    : d
            )
        );
    };

    const aggiungiOpzione = (indexDomanda: number) => {
        setDomande((prev) =>
            prev.map((d, i) => {
                if (i === indexDomanda) {
                    if (d.opzioni.length >= 4) {
                        setError("Non puoi aggiungere più di 4 opzioni per domanda.");
                        return d;
                    }
                    return {
                        ...d,
                        opzioni: [...d.opzioni, { testoOpzione: "", corretta: false }],
                    };
                }
                return d;
            })
        );
    };


    const rimuoviOpzione = (indexDomanda: number, indexOpzione: number) => {
        setDomande((prev) =>
            prev.map((d, i) =>
                i === indexDomanda
                    ? {
                        ...d,
                        opzioni: d.opzioni.filter(
                            (_, j) => j !== indexOpzione
                        ),
                    }
                    : d
            )
        );
    };

    // ============================================================
    // SUBMIT
    // ============================================================

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const validationError = validateBeforeSubmit();
        if (validationError) {
            setError(validationError);
            return;
        }

        setError(null);

        const payload: TestCreateRequest = {
            titolo,
            descrizione,
            durataMinuti,
            numeroDomande: domande.length,
            punteggioMin,
            codiceTipoTest: tipoTest,
            domande: domande.map((d) => ({
                testo: d.testo,
                punteggio: d.punteggio,
                opzioni: d.opzioni.map((o) => ({
                    testoOpzione: o.testoOpzione,
                    corretta: o.corretta,
                })),
            })),
        };

        try {
            setSaving(true);
            await creaTest(payload);
            router.push("/hr/test");
        } catch (err: any) {
            console.error("Errore creazione test:", err);

            const backendMessage =
                err?.response?.data?.message ||
                err?.message ||
                "Errore durante la creazione del test.";

            setError(backendMessage);
        } finally {
            setSaving(false);
        }
    };

    const baseInputClass =
        "w-full px-3 py-2 rounded-md border border-[var(--border)] bg-[var(--input)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--accent)]";

    // ============================================================
    // RENDER
    // ============================================================

    return (
        <section className="max-w-4xl mx-auto space-y-6">
            <header className="flex items-center justify-between">
                <h1 className="text-2xl font-semibold">Crea un nuovo Test</h1>
                <button
                    type="button"
                    onClick={() => router.push("/hr/test")}
                    className="px-4 py-2 rounded-lg border border-[var(--border)] font-medium hover:bg-[var(--accent)]/10"
                >
                    Torna ai test
                </button>
            </header>

            <form
                onSubmit={handleSubmit}
                className="space-y-6 p-6 border border-[var(--border)] rounded-xl bg-[var(--card)]"
            >
                {error && (
                    <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive whitespace-pre-line">
                        {error}
                    </div>
                )}

                {/* Meta test */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Titolo</label>
                        <input
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            className={baseInputClass}
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">
                            Descrizione
                        </label>
                        <textarea
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                            className={`${baseInputClass} h-24 resize-none`}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                Durata (1–60)
                            </label>
                            <input
                                type="number"
                                min={1}
                                max={60}
                                value={durataMinuti}
                                onChange={(e) =>
                                    setDurataMinuti(Number(e.target.value))
                                }
                                className={baseInputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Punteggio minimo %
                            </label>
                            <input
                                type="number"
                                min={0}
                                max={100}
                                value={punteggioMin}
                                onChange={(e) =>
                                    setPunteggioMin(Number(e.target.value))
                                }
                                className={baseInputClass}
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Numero domande
                            </label>
                            <input
                                type="number"
                                value={domande.length}
                                readOnly
                                className={`${baseInputClass} text-xs text-neutral-400 bg-[var(--surface)] cursor-not-allowed`}
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Tipo di test
                            </label>
                            <select
                                value={tipoTest}
                                onChange={(e) =>
                                    setTipoTest(e.target.value as TestType)
                                }
                                className={`${baseInputClass} min-w-80`}

                            >
                                {TIPI_TEST.map((t) => (
                                    <option className="bg-neutral-900 / border-neutral-700" key={t.codice} value={t.codice}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Domande */}
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <h2 className="text-lg font-semibold">
                            Domande del test
                        </h2>
                        <button
                            type="button"
                            onClick={aggiungiDomanda}
                            className="px-3 py-1.5 text-sm rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90"
                        >
                            + Aggiungi domanda
                        </button>
                    </div>

                    <div className="space-y-6">
                        {domande.map((domanda, idx) => (
                            <div
                                key={idx}
                                className="border border-[var(--border)] rounded-lg p-4 bg-[var(--surface)] space-y-4"
                            >
                                <div className="flex items-start justify-between gap-4">
                                    <div className="flex-1 space-y-2">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-medium">
                                                Domanda {idx + 1}
                                            </span>
                                            {domande.length > 1 && (
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        rimuoviDomanda(idx)
                                                    }
                                                    className="text-xs text-red-500 hover:underline"
                                                >
                                                    Rimuovi
                                                </button>
                                            )}
                                        </div>

                                        <textarea
                                            value={domanda.testo}
                                            onChange={(e) =>
                                                handleDomandaChange(
                                                    idx,
                                                    "testo",
                                                    e.target.value
                                                )
                                            }
                                            className={`${baseInputClass} h-20 resize-none`}
                                            placeholder="Testo della domanda"
                                            required
                                        />
                                    </div>
                                </div>

                                {/* Opzioni */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify_between">
                                        <span className="text-xs font-medium">
                                            Opzioni di risposta
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                aggiungiOpzione(idx)
                                            }
                                            className="text-sm font-semibold text-blue-600 hover:text-blue-700 underline-offset-2 hover:underline"
                                        >
                                            + Aggiungi opzione
                                        </button>
                                    </div>

                                    {domanda.opzioni.map(
                                        (opzione, idxOpzione) => (
                                            <div
                                                key={idxOpzione}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`domanda-${idx}`}
                                                    checked={opzione.corretta}
                                                    onChange={() =>
                                                        setOpzioneCorretta(
                                                            idx,
                                                            idxOpzione
                                                        )
                                                    }
                                                />

                                                <input
                                                    value={
                                                        opzione.testoOpzione
                                                    }
                                                    onChange={(e) =>
                                                        handleOpzioneChange(
                                                            idx,
                                                            idxOpzione,
                                                            e.target.value
                                                        )
                                                    }
                                                    className={`${baseInputClass} flex-1`}
                                                    placeholder={`Opzione ${
                                                        idxOpzione + 1
                                                    }`}
                                                    required
                                                />

                                                {domanda.opzioni.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            rimuoviOpzione(
                                                                idx,
                                                                idxOpzione
                                                            )
                                                        }
                                                        className="text-xs text-destructive hover:underline"
                                                    >
                                                        Rimuovi
                                                    </button>
                                                )}
                                            </div>
                                        )
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex justify-end gap-3">
                    <button
                        type="button"
                        onClick={() => router.push("/hr/test")}
                        className="px-4 py-2 rounded-lg border border-[var(--border)] font-medium hover:bg-[var(--accent)]/10"
                        disabled={saving}
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90 disabled:opacity-60"
                        disabled={saving}
                    >
                        {saving ? "Salvataggio…" : "Salva test"}
                    </button>
                </div>
            </form>
        </section>
    );
}
