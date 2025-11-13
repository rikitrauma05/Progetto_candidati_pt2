// frontend/app/candidati/posizioni/posizioni.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import EmptyState from "@/components/empty/EmptyState";
import Button from "@/components/ui/button";
import PosizioneCard from "@/components/cards/posizioneCard";
import { getPosizioniFiltrate } from "@/services/posizione.service";
import type { Posizione } from "@/types/posizione";

type PosizioniFilters = {
    contratto: string;
    sede: string;
    settore: string;
};

export default function PosizioniPage() {
    const [posizioni, setPosizioni] = useState<Posizione[]>([]);
    const [err, setErr] = useState<string>("");
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState<PosizioniFilters>({
        contratto: "",
        sede: "",
        settore: "",
    });

    const router = useRouter();

    useEffect(() => {
        let mounted = true;

        setLoading(true);
        setErr("");

        getPosizioniFiltrate(filters)
            .then((data) => {
                if (!mounted) return;
                setPosizioni(data ?? []);
            })
            .catch((e) => {
                if (!mounted) return;
                setErr(String(e?.message || e));
            })
            .finally(() => {
                if (!mounted) return;
                setLoading(false);
            });

        return () => {
            mounted = false;
        };
    }, [filters]);

    function handleFilterChange(e: React.ChangeEvent<HTMLSelectElement>) {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    }

    function clearFilters() {
        setFilters({ contratto: "", sede: "", settore: "" });
    }

    const errorText = useMemo(() => {
        if (!err) return "";
        return err.length > 160 ? `${err.slice(0, 160)}…` : err;
    }, [err]);

    return (
        <div className="space-y-6">
            <PageHeader
                title="Posizioni disponibili"
                subtitle="Consulta e filtra le offerte attive"
                actions={[
                    {
                        label: "Pulisci filtri",
                        onClick: clearFilters,
                    },
                ]}
            />

            {/* FILTRI */}
            <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/15 bg-[var(--surface)] px-3 py-3">
                <select
                    name="contratto"
                    value={filters.contratto}
                    onChange={handleFilterChange}
                    className="h-10 rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-[var(--foreground)] outline-none transition hover:border-white/35 focus:border-blue-500"
                >
                    <option value="">Tutti i contratti</option>
                    <option value="Indeterminato">Tempo indeterminato</option>
                    <option value="Determinato">Tempo determinato</option>
                    <option value="Stage">Stage</option>
                    <option value="Part-Time">Part-time</option>
                </select>

                <select
                    name="sede"
                    value={filters.sede}
                    onChange={handleFilterChange}
                    className="h-10 rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-[var(--foreground)] outline-none transition hover:border-white/35 focus:border-blue-500"
                >
                    <option value="">Tutte le sedi</option>
                    <option value="Milano">Milano</option>
                    <option value="Roma">Roma</option>
                    <option value="Torino">Torino</option>
                    <option value="Piacenza">Piacenza</option>
                </select>

                <select
                    name="settore"
                    value={filters.settore}
                    onChange={handleFilterChange}
                    className="h-10 rounded-xl border border-white/15 bg-black/40 px-3 text-sm text-[var(--foreground)] outline-none transition hover:border-white/35 focus:border-blue-500"
                >
                    <option value="">Tutti i settori</option>
                    <option value="IT">IT</option>
                    <option value="HR">HR</option>
                    <option value="Marketing">Marketing</option>
                    <option value="Finance">Finance</option>
                </select>

                <div className="ml-auto">
                    <Button onClick={clearFilters}>Pulisci filtri</Button>
                </div>
            </div>

            {/* STATO: errore */}
            {errorText && !loading && (
                <div className="rounded-md border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
                    Errore: {errorText}
                </div>
            )}

            {/* STATO: loading */}
            {loading && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {Array.from({ length: 4 }).map((_, i) => (
                        <div
                            key={i}
                            className="animate-pulse rounded-2xl border border-white/10 bg-[var(--surface)] p-4"
                        >
                            <div className="mb-2 h-4 w-2/3 rounded bg-white/10" />
                            <div className="mb-4 h-3 w-1/3 rounded bg-white/10" />
                            <div className="h-8 w-24 rounded-full bg-white/10" />
                        </div>
                    ))}
                </div>
            )}

            {/* STATO: vuoto */}
            {!loading && !errorText && posizioni.length === 0 && (
                <EmptyState
                    title="Nessuna posizione trovata"
                    subtitle="Nessuna offerta corrisponde ai filtri selezionati."
                />
            )}

            {/* STATO: dati */}
            {!loading && posizioni.length > 0 && (
                <div className="grid gap-3 sm:grid-cols-2">
                    {posizioni.map((p) => (
                        <PosizioneCard
                            key={p.idPosizione}
                            id={p.idPosizione}
                            titolo={p.titolo}
                            sede={p.sede}
                            contratto={p.contratto}
                            onClick={() => router.push(`/candidati/posizioni/${p.idPosizione}`)}
                            rightSlot={
                                <Button asChild>
                                    <Link href={`/candidati/posizioni/${p.idPosizione}`}>
                                        Dettaglio
                                    </Link>
                                </Button>
                            }
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
