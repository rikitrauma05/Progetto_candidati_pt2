"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import PageHeader from "@/components/layout/pageHeader";
import Input from "@/components/ui/input";
import Button from "@/components/ui/button";
import { useAuthStore } from "@/store/authStore";

export default function Register() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);

    const [form, setForm] = useState({
        nome: "",
        cognome: "",
        email: "",
        password: "",
        conferma: "",
    });
    const [error, setError] = useState<string | null>(null);
    const [busy, setBusy] = useState(false);

    function onChange<K extends keyof typeof form>(key: K, val: string) {
        setForm((f) => ({ ...f, [key]: val }));
    }

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);

        if (form.password !== form.conferma) {
            setError("Le password non coincidono.");
            return;
        }

        setBusy(true);
        try {
            // Qui in futuro chiamerai la tua API di registrazione.
            // Ora completiamo il flusso: set auth store + redirect.
            login({
                id: Date.now(),
                nome: form.nome,
                cognome: form.cognome,
                email: form.email,
                ruolo: "CANDIDATO",
            });
            router.push("/candidati/profili");
        } catch {
            setError("Registrazione non riuscita. Riprova.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="container mx-auto p-4 space-y-6 max-w-md">
            <PageHeader title="Registrati" subtitle="Crea un account per accedere alla piattaforma" />

            <form onSubmit={onSubmit} className="rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label htmlFor="nome" className="text-sm">Nome</label>
                        <Input id="nome" value={form.nome} onChange={(e) => onChange("nome", e.currentTarget.value)} required />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="cognome" className="text-sm">Cognome</label>
                        <Input id="cognome" value={form.cognome} onChange={(e) => onChange("cognome", e.currentTarget.value)} required />
                    </div>
                </div>

                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm">Email</label>
                    <Input id="email" type="email" value={form.email} onChange={(e) => onChange("email", e.currentTarget.value)} required />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm">Password</label>
                    <Input id="password" type="password" value={form.password} onChange={(e) => onChange("password", e.currentTarget.value)} required minLength={6} />
                </div>

                <div className="space-y-2">
                    <label htmlFor="conferma" className="text-sm">Conferma password</label>
                    <Input id="conferma" type="password" value={form.conferma} onChange={(e) => onChange("conferma", e.currentTarget.value)} required minLength={6} />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="pt-2">
                    <Button type="submit" className="w-full" disabled={busy}>
                        {busy ? "Creazione account..." : "Registrati"}
                    </Button>
                </div>
            </form>
        </main>
    );
}
