"use client";

import Link from "next/link";

export default function Homepage() {
    return (
        <section className="space-y-8">
            <div className="rounded-2xl p-8 bg-surface border border-border shadow-card">
                <h2 className="text-2xl font-semibold mb-2">Homepage</h2>
                <p className="text-muted">
                    Benvenuto nella piattaforma. Scegli un’area per iniziare.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Link
                    href="/auth/login"
                    className="rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold mb-1">Login</h3>
                    <p className="text-muted">Accedi al tuo account.</p>
                </Link>

                <Link
                    href="/auth/register"
                    className="rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold mb-1">Registrati</h3>
                    <p className="text-muted">Crea un nuovo account.</p>
                </Link>

                <Link
                    href="/candidati/posizioni"
                    className="rounded-2xl p-6 bg-surface border border-border shadow-card hover:shadow-lg transition-shadow"
                >
                    <h3 className="text-lg font-semibold mb-1">Posizioni</h3>
                    <p className="text-muted">Vai all’elenco posizioni.</p>
                </Link>
            </div>
        </section>
    );
}
