import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="container mx-auto max-w-3xl p-6 space-y-6">
            <h1 className="text-3xl font-bold">Informativa sulla Privacy</h1>

            <p>
                Questa pagina contiene le normative relative al trattamento dei dati personali,
                se accetti devi BACIARE ARIA.
            </p>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">1. Finalità del trattamento</h2>
                <p>Baciare ARIA</p>
            </section>


            <section className="space-y-3">
                <h2 className="text-xl font-semibold">2. Diritti dell’utente</h2>
                <ul className="list-disc ml-6">
                    <li>Diritto di baciare ARIA</li>
                    <li>Diritto di essere baciato da ARIA</li>
                </ul>
            </section>

            <Link
                href="auth/register"
                className="inline-block mt-6 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
                Torna alla registrazione
            </Link>

        </main>
    );
}
