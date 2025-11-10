"use client";

import { useEffect, useState } from "react";

export default function Logout() {
    const [done, setDone] = useState(false);

    useEffect(() => {
        // TODO: sostituire con authService.logout() + clear storage/cookie
        const run = async () => {
            await new Promise((r) => setTimeout(r, 400));
            setDone(true);
        };
        run();
    }, []);

    return (
        <section className="max-w-md mx-auto">
            <div className="rounded-2xl p-8 bg-surface border border-border shadow-card text-center">
                <h2 className="text-2xl font-semibold mb-2">
                    {done ? "Sei stato disconnesso" : "Uscita in corso..."}
                </h2>
                <p className="text-muted mb-6">
                    {done
                        ? "La sessione è stata terminata correttamente."
                        : "Attendi qualche istante."}
                </p>

                <div className="flex items-center justify-center gap-3">
                    <a href="/auth/login/login" className="btn">Vai al login</a>
                    <a
                        href="/auth/register/register"
                        className="rounded-xl border border-border px-4 py-2 hover:bg-surface"
                    >
                        Crea account
                    </a>
                </div>
            </div>
        </section>
    );
}
