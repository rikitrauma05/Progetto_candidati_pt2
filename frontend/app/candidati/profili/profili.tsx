"use client";

import { useUser } from "@/hooks/useUser";
import { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/services/api";

export default function ProfiloCandidato() {
    const { profilo, loading, error, reload } = useUser();
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [uploading, setUploading] = useState(false);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);
    const { accessToken } = useAuthStore();

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCvFile(e.target.files[0]);
            setUploadSuccess(false);
            setUploadError(null);
        }
    };

    const handleCvUpload = async () => {
        if (!cvFile) return;
        setUploading(true);
        setUploadError(null);
        setUploadSuccess(false);

        try {
            const formData = new FormData();
            formData.append("cv", cvFile);

            const resp = await fetch(`${API_BASE_URL}/candidati/profili/cv`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
                body: formData,
            });

            if (!resp.ok) {
                let message = `Errore HTTP ${resp.status}`;
                try {
                    const data = await resp.json();
                    if (data?.message) message = data.message;
                } catch {}
                throw new Error(message);
            }

            setUploadSuccess(true);
            reload(); // ricarica il profilo dopo upload
        } catch (err: any) {
            console.error("Errore upload CV:", err);
            setUploadError(err?.message || "Errore durante l'upload del CV");
        } finally {
            setUploading(false);
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
                <div>
                    <h2 className="text-lg font-semibold">{profilo.nome} {profilo.cognome}</h2>
                </div>

                <div className="grid grid-cols-1 gap-3 text-sm">
                    <div>
                        <p className="text-[var(--muted)]">Email</p>
                        <p className="font-medium break-all">{profilo.email}</p>
                    </div>
                    <div>
                        <p className="text-[var(--muted)]">Password</p>
                        <button
                            type="button"
                            className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                        >
                            Cambia password
                        </button>
                    </div>
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
                    <div>
                        <p className="text-[var(--muted)]">Telefono</p>
                        <p className="font-medium">{profilo.telefono || "-"}</p>
                    </div>
                    <div>
                        <p className="text-[var(--muted)]">Città</p>
                        <p className="font-medium">{profilo.citta || "-"}</p>
                    </div>
                </div>

                <div>
                    <p className="text-[var(--muted)] mb-2">Carica nuovo CV</p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvChange}
                        className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border file:border-border file:text-sm file:font-semibold file:bg-[var(--card)] hover:file:bg-[var(--border)]"
                    />
                    {cvFile && <p className="mt-2 text-sm text-green-600">File selezionato: {cvFile.name}</p>}
                    {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
                    {uploadSuccess && <p className="mt-2 text-sm text-green-600">CV caricato con successo!</p>}
                    {/*<button*/}
                    {/*    type="button"*/}
                    {/*    onClick={handleCvUpload}*/}
                    {/*    disabled={!cvFile || uploading}*/}
                    {/*    className="mt-2 inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"*/}
                    {/*>*/}
                    {/*    {uploading ? "Caricamento..." : "Carica CV"}*/}
                    {/*</button>*/}
                </div>

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
