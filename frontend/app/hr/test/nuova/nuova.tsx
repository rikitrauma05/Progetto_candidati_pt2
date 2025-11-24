"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createTest } from "@/services/test.service";
import type { TestCreateRequest, TestType } from "@/types/test";

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
    const [punteggioMax, setPunteggioMax] = useState<number>(100);
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

    const aggiungiDomanda = () => {
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

    const setOpzioneCorretta = (indexDomanda: number, indexOpzione: number) => {
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
            prev.map((d, i) =>
                i === indexDomanda
                    ? {
                        ...d,
                        opzioni: [
                            ...d.opzioni,
                            { testoOpzione: "", corretta: false },
                        ],
                    }
                    : d
            )
        );
    };

    const rimuoviOpzione = (indexDomanda: number, indexOpzione: number) => {
        setDomande((prev) =>
            prev.map((d, i) =>
                i === indexDomanda
                    ? {
                        ...d,
                        opzioni: d.opzioni.filter((_, j) => j !== indexOpzione),
                    }
                    : d
            )
        );
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const payload: TestCreateRequest = {
            titolo,
            descrizione,
            durataMinuti,
            numeroDomande: domande.length,
            punteggioMax,
            punteggioMin: 0,
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
            await createTest(payload);
            router.push("/hr/test");
        } catch (error) {
            console.error("Errore creazione test:", error);
        }
    };

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
                className="space-y-6 p-6 border rounded-xl bg-[var(--card)]"
            >
                {/* Meta test */}
                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">Titolo</label>
                        <input
                            value={titolo}
                            onChange={(e) => setTitolo(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            required
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium">Descrizione</label>
                        <textarea
                            value={descrizione}
                            onChange={(e) => setDescrizione(e.target.value)}
                            className="w-full px-3 py-2 rounded-md border bg-[var(--input)] h-24"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                            <label className="text-sm font-medium">
                                Durata (minuti)
                            </label>
                            <input
                                type="number"
                                value={durataMinuti}
                                onChange={(e) =>
                                    setDurataMinuti(Number(e.target.value))
                                }
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                                required
                            />
                        </div>

                        <div>
                            <label className="text-sm font-medium">
                                Punteggio massimo
                            </label>
                            <input
                                type="number"
                                value={punteggioMax}
                                onChange={(e) =>
                                    setPunteggioMax(Number(e.target.value))
                                }
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
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
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)] bg-gray-100/50"
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
                                className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                            >
                                {TIPI_TEST.map((t) => (
                                    <option key={t.codice} value={t.codice}>
                                        {t.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Domande */}
                {/* (tutta la parte domande/opzioni identica a prima, già inclusa sopra) */}

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
                                className="border rounded-lg p-4 bg-[var(--surface)] space-y-4"
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
                                                    Rimuovi domanda
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
                                            className="w-full px-3 py-2 rounded-md border bg-[var(--input)] h-20"
                                            placeholder="Testo della domanda"
                                            required
                                        />
                                    </div>

                                    <div className="w-32">
                                        <label className="text-xs font-medium">
                                            Punteggio
                                        </label>
                                        <input
                                            type="number"
                                            value={domanda.punteggio}
                                            onChange={(e) =>
                                                handleDomandaChange(
                                                    idx,
                                                    "punteggio",
                                                    e.target.value
                                                )
                                            }
                                            className="w-full px-3 py-2 rounded-md border bg-[var(--input)]"
                                            required
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium">
                                            Opzioni di risposta
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                aggiungiOpzione(idx)
                                            }
                                            className="text-xs font-medium hover:underline"
                                        >
                                            + Aggiungi opzione
                                        </button>
                                    </div>

                                    <div className="space-y-2">
                                        {domanda.opzioni.map((opzione, j) => (
                                            <div
                                                key={j}
                                                className="flex items-center gap-2"
                                            >
                                                <input
                                                    type="radio"
                                                    name={`corretta-${idx}`}
                                                    checked={opzione.corretta}
                                                    onChange={() =>
                                                        setOpzioneCorretta(
                                                            idx,
                                                            j
                                                        )
                                                    }
                                                />
                                                <input
                                                    value={opzione.testoOpzione}
                                                    onChange={(e) =>
                                                        handleOpzioneChange(
                                                            idx,
                                                            j,
                                                            e.target.value
                                                        )
                                                    }
                                                    className="flex-1 px-3 py-2 rounded-md border bg-[var(--input)]"
                                                    placeholder={`Opzione ${
                                                        j + 1
                                                    }`}
                                                    required
                                                />
                                                {domanda.opzioni.length > 2 && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            rimuoviOpzione(
                                                                idx,
                                                                j
                                                            )
                                                        }
                                                        className="text-xs text-red-500 hover:underline"
                                                    >
                                                        Rimuovi
                                                    </button>
                                                )}
                                            </div>
                                        ))}
                                    </div>
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
                    >
                        Annulla
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 rounded-lg bg-[var(--accent)] text-white font-medium hover:opacity-90"
                    >
                        Salva test
                    </button>
                </div>
            </form>
        </section>
    );
}
