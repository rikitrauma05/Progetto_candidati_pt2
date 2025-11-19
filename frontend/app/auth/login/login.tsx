"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {login as loginApi } from "@/services/auth.service";
import {register as registerApi} from "@/services/auth.service";
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
            const resp = await loginApi({
                email,
                password,
            });

            // resp.user è il UtenteDto (tipizzato in types/user.ts)
            login(resp.user);

            // redirect in base al ruolo reale
            if (resp.user.ruolo === "HR") {
                router.push("/hr/dashboard");
            } else {
                router.push("/candidati/profili");
            }
        } catch (err: any) {
            const msg = String(err?.message || "");

            if (msg.includes("UTENTE_NON_TROVATO")) {
                setError("Utente non trovato.");
            } else if (msg.includes("PASSWORD_ERRATA")) {
                setError("Password errata.");
            } else {
                setError("Login non riuscito. Riprova.");
            }
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
