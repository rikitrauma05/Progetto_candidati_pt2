"use client";

import { useUser } from "@/hooks/useUser";
import { useState } from "react";

export default function ProfiloCandidato() {
    const { profilo, loading, error, reload } = useUser();
    const [cvFile, setCvFile] = useState<File | null>(null);

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCvFile(e.target.files[0]);
        }
    };

    if (loading && !profilo) {
        return (
            <section className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Il tuo profilo</h1>
                <div className="rounded-xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">Caricamento del profilo in corso…</p>
                </div>
            </section>
        );
    }

    if (error && !profilo) {
        return (
            <section className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Il tuo profilo</h1>
                <div className="rounded-xl border border-destructive/40 bg-destructive/5 p-6">
                    <p className="text-sm text-destructive mb-4">{error}</p>
                    <button
                        type="button"
                        onClick={reload}
                        className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Riprova a caricare
                    </button>
                </div>
            </section>
        );
    }

    if (!profilo) {
        return (
            <section className="max-w-2xl mx-auto">
                <h1 className="text-2xl font-semibold mb-4">Il tuo profilo</h1>
                <div className="rounded-xl border border-border bg-[var(--card)] p-6">
                    <p className="text-sm text-[var(--muted)]">Nessun profilo trovato per questo account.</p>
                    <button
                        type="button"
                        onClick={reload}
                        className="mt-4 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Riprova a caricare
                    </button>
                </div>
            </section>
        );
    }

    return (
        <section className="max-w-2xl mx-auto">
            <h1 className="text-2xl font-semibold mb-4">Il tuo profilo</h1>

            <div className="rounded-xl border border-border bg-[var(--card)] p-6 space-y-6">
                {/* Nome e Cognome */}
                <div>
                    <h2 className="text-lg font-semibold">{profilo.nome} {profilo.cognome}</h2>
                </div>

                {/* Email */}
                <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                        <p className="text-[var(--muted)]">Email</p>
                        <p className="font-medium break-all">{profilo.email}</p>
                    </div>

                    {/* Cambio password */}
                    <div>
                        <p className="text-[var(--muted)]">Password</p>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                        >
                            Cambia password
                        </button>
                    </div>

                    {/* Data di nascita */}
                    <div>
                        <p className="text-[var(--muted)]">Data di nascita</p>
                        <p className="font-medium">
                        {profilo.dataNascita
                            ? new Date(profilo.dataNascita).toLocaleDateString("it-IT", {
                                day: "2-digit",
                                month: "2-digit",
                                year: "numeric",
                            })
                            : "-"}
                    </p>
                    </div>

                    {/* Telefono */}
                    <div>
                        <p className="text-[var(--muted)]">Telefono</p>
                        <p className="font-medium">{profilo.telefono || "-"}</p>
                    </div>

                    {/* Città */}
                    <div>
                        <p className="text-[var(--muted)]">Città</p>
                        <p className="font-medium">{profilo.citta || "-"}</p>
                    </div>

                    {/* ID utente */}
                </div>

                {/* Upload CV */}
                <div>
                    <p className="text-[var(--muted)] mb-2">Carica nuovo CV</p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-semibold file:bg-[var(--card)] hover:file:bg-[var(--border)]"
                    />
                    {cvFile && <p className="mt-2 text-sm text-green-600">File selezionato: {cvFile.name}</p>}
                </div>

                {/* Bottone aggiorna */}
                <div className="pt-2">
                    <button
                        type="button"
                        onClick={reload}
                        className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        Aggiorna dati profilo
                    </button>
                </div>
            </div>
        </section>
    );
}
