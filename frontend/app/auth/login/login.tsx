"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import PageHeader from "@/components/layout/pageHeader";
import { useAuthStore } from "@/store/authStore";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";

export default function LoginPage() {
    const router = useRouter();
    const login = useAuthStore((s) => s.login);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [busy, setBusy] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setError(null);
        setBusy(true);

        try {
            const ruolo = email.toLowerCase().includes("hr") ? "HR" : "CANDIDATO" as const;

            login({
                id: 1,
                nome: "Utente",
                cognome: ruolo === "HR" ? "HR" : "Candidato",
                email,
                ruolo,
            });

            router.push(ruolo === "HR" ? "/hr/dashboard" : "/candidati/profili");
        } catch {
            setError("Accesso non riuscito. Riprova.");
        } finally {
            setBusy(false);
        }
    }

    return (
        <main className="container mx-auto p-4 space-y-6 max-w-md">
            <PageHeader title="Accedi" subtitle="Inserisci le tue credenziali per continuare" />

            <form onSubmit={onSubmit} className="rounded-2xl border bg-[var(--surface)] border-[var(--border)] p-6 space-y-4">
                <div className="space-y-2">
                    <label htmlFor="email" className="text-sm">Email</label>
                    <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.currentTarget.value)} required />
                </div>

                <div className="space-y-2">
                    <label htmlFor="password" className="text-sm">Password</label>
                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.currentTarget.value)} required />
                </div>

                {error && <p className="text-sm text-red-600">{error}</p>}

                <div className="pt-2">
                    <Button type="submit" disabled={busy} className="w-full">
                        {busy ? "Accesso..." : "Accedi"}
                    </Button>
                </div>

                <div className="pt-4 text-sm">
                    Non hai un account?{" "}
                    <Link href="/auth/register" className="underline">
                        Registrati
                    </Link>
                </div>
            </form>
        </main>
    );
}
