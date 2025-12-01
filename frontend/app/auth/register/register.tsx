"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { register as registerApi } from "@/services/auth.service";
import type { RuoloCodice } from "@/types/auth";
import PageHeader from "@/components/layout/pageHeader";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";
import { useRegisterStore } from "@/store/registerFormStore";
import Link from "next/link";

export default function Register() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);

    const {
        form,
        setFormField,
        cvFile,
        setCvFile,
        consensoPrivacy,
        setConsensoPrivacy,
        reset
    } = useRegisterStore();

    const [cvError, setCvError] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [busy, setBusy] = React.useState(false);

    function onCvChange(e: React.ChangeEvent<HTMLInputElement>) {
        setCvError(null);
        const file = e.currentTarget.files?.[0] ?? null;

        if (!file) {
            setCvFile(null);
            return;
        }

        if (file.type !== "application/pdf") {
            setCvError("Il CV deve essere in formato PDF.");
            setCvFile(null);
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            setCvError("Il CV deve essere massimo 5 MB.");
            setCvFile(null);
            return;
        }

        setCvFile(file);
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (form.password !== form.conferma) {
            setError("Le password non coincidono.");
            return;
        }

        if (!cvFile) {
            setError("Devi caricare il cv");
            return;
        }

        if (cvError) {
            setError(cvError);
            return;
        }

        if (!consensoPrivacy) {
            setError("Devi accettare l'informativa sulla privacy per continuare.");
            return;
        }

        setBusy(true);

        try {

            const stateBefore = useAuthStore.getState();

            useAuthStore.getState().logout();

            localStorage.removeItem("auth-storage");

            await new Promise(resolve => setTimeout(resolve, 150));

            const stateAfterClean = useAuthStore.getState();

            const ruolo: RuoloCodice = "CANDIDATO";

            const payload = {
                email: form.email,
                password: form.password,
                nome: form.nome,
                cognome: form.cognome,
                ruolo,
                consensoPrivacy,
                dataNascita: form.dataNascita || null,
                telefono: form.telefono || null,
                citta: form.citta || null,
            };

            const resp = await registerApi(payload, cvFile);


            if (!resp.accessToken || !resp.refreshToken) {
                throw new Error("Token mancanti - errore backend");
            }

            login(resp.user, {
                accessToken: resp.accessToken,
                refreshToken: resp.refreshToken,
            });

            await new Promise(resolve => setTimeout(resolve, 100));

            const stateAfterLogin = useAuthStore.getState();
            console.log("Store dopo login:", {
                hasUser: !!stateAfterLogin.user,
                hasToken: !!stateAfterLogin.accessToken,
                isAuthenticated: stateAfterLogin.isAuthenticated,
                userId: stateAfterLogin.user?.idUtente,
                tokenMatch: stateAfterLogin.accessToken === resp.accessToken,
            });

            const savedInLocalStorage = localStorage.getItem("auth-storage");

            if (!stateAfterLogin.accessToken) {
                throw new Error("Errore salvataggio sessione");
            }

            reset();

            window.location.replace("/candidati/profili");

        } catch (err: any) {

            const msg = String(err?.message || "");

            if (msg.includes("EMAIL_GIA_REGISTRATA") || msg.includes("409")) {
                setError("Esiste già un account con questa email.");
            } else if (msg.includes("Token mancanti")) {
                setError("Errore configurazione server. Contatta l'assistenza.");
            } else if (msg.includes("Network") || msg.includes("fetch")) {
                setError("Errore di connessione. Verifica la tua rete.");
            } else {
                setError(`Registrazione non riuscita: ${msg}`);
            }
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="container mx-auto max-w-xl p-4 space-y-6">
            <PageHeader
                title="Registrati"
                subtitle="Crea il tuo account candidato per inviare candidature e sostenere i test."
            />

            <form
                onSubmit={onSubmit}
                className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 space-y-4 shadow-sm"
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="nome" className="text-sm font-medium">
                            Nome
                        </label>
                        <Input
                            id="nome"
                            value={form.nome}
                            onChange={(e) =>
                                setFormField("nome", e.currentTarget.value)
                            }
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="cognome" className="text-sm font-medium">
                            Cognome
                        </label>
                        <Input
                            id="cognome"
                            value={form.cognome}
                            onChange={(e) =>
                                setFormField("cognome", e.currentTarget.value)
                            }
                            required
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                        Email
                    </label>
                    <Input
                        id="email"
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                            setFormField("email", e.currentTarget.value)
                        }
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="dataNascita" className="text-sm font-medium">
                            Data di nascita
                        </label>
                        <Input
                            id="dataNascita"
                            type="date"
                            value={form.dataNascita}
                            onChange={(e) =>
                                setFormField("dataNascita", e.currentTarget.value)
                            }
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="telefono" className="text-sm font-medium">
                            Numero di telefono
                        </label>
                        <Input
                            id="telefono"
                            type="tel"
                            value={form.telefono}
                            onChange={(e) =>
                                setFormField("telefono", e.currentTarget.value)
                            }
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="citta" className="text-sm font-medium">
                        Città
                    </label>
                    <Input
                        id="citta"
                        value={form.citta}
                        onChange={(e) =>
                            setFormField("citta", e.currentTarget.value)
                        }
                    />
                </div>

                <div className="space-y-2">
                    <label htmlFor="cv" className="text-sm font-medium">
                        Curriculum (PDF)
                    </label>
                    <input
                        id="cv"
                        type="file"
                        accept="application/pdf"
                        onChange={onCvChange}
                        className="block w-full text-sm text-[var(--foreground)] file:mr-4 file:rounded-lg file:border-0 file:bg-[var(--accent)] file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-white hover:file:bg-[var(--accent)]/90"
                    />

                    {cvFile && !cvError && (
                        <p className="text-xs text-[var(--muted)]">
                            File selezionato: <span className="font-medium">{cvFile.name}</span>
                        </p>
                    )}
                    {cvError && <p className="text-xs text-red-600">{cvError}</p>}
                </div>

                <div className="space-y-2">
                    <div className="flex items-start gap-3 p-4 rounded-lg border border-[var(--border)] bg-[var(--background)]">
                        <input
                            id="consensoPrivacy"
                            type="checkbox"
                            checked={consensoPrivacy}
                            onChange={(e) => setConsensoPrivacy(e.target.checked)}
                            className="mt-1 h-4 w-4 rounded border-[var(--border)] text-[var(--accent)] focus:ring-2 focus:ring-[var(--accent)] focus:ring-offset-2"
                        />
                        <label
                            htmlFor="consensoPrivacy"
                            className="text-sm leading-relaxed cursor-pointer"
                        >
                            Accetto l'
                            <Link
                                href="/privacy"
                                className="underline font-medium hover:text-[var(--accent)]"
                            >
                                informativa sulla privacy
                            </Link>{" "}
                            e acconsento al trattamento dei miei dati personali.
                        </label>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="password" className="text-sm font-medium">
                            Password
                        </label>
                        <Input
                            id="password"
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setFormField("password", e.currentTarget.value)
                            }
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="space-y-2">
                        <label htmlFor="conferma" className="text-sm font-medium">
                            Conferma password
                        </label>
                        <Input
                            id="conferma"
                            type="password"
                            value={form.conferma}
                            onChange={(e) =>
                                setFormField("conferma", e.currentTarget.value)
                            }
                            required
                            minLength={6}
                        />
                    </div>
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Creazione account..." : "Registrati"}
                    </Button>
                </div>

                <div className="pt-4 text-sm text-center">
                    Hai già un account?{" "}
                    <Link href="/auth/login" className="underline">
                        Accedi
                    </Link>
                </div>
            </form>
        </main>
    );
}
