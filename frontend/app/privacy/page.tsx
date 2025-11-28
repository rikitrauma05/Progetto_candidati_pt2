import Link from "next/link";

export default function PrivacyPage() {
    return (
        <main className="container mx-auto max-w-3xl p-6 space-y-8">
            <h1 className="text-3xl font-bold">Informativa sulla Privacy</h1>

            <p className="text-sm text-[var(--muted)]">
                Ultimo aggiornamento: {new Date().toLocaleDateString('it-IT')}
            </p>


            <section className="space-y-3">
                <h2 className="text-xl font-semibold">1. Finalità del trattamento</h2>
                <p>I dati personali raccolti attraverso la piattaforma vengono trattati per le seguenti finalità:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Creazione e gestione dell'account utente</li>
                    <li>Gestione delle candidature e dei processi di selezione</li>
                    <li>Comunicazioni relative ai servizi offerti dalla piattaforma</li>
                    <li>Adempimento di obblighi contrattuali e di legge</li>
                    <li>Miglioramento dei servizi e analisi statistiche aggregate</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">2. Base giuridica del trattamento</h2>
                <p>
                    Il trattamento dei dati personali si fonda sul consenso esplicito dell'utente
                    (art. 6, comma 1, lett. a) del GDPR) e sull'esecuzione di un contratto di cui
                    l'interessato è parte (art. 6, comma 1, lett. b) del GDPR).
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">3. Tipologia di dati raccolti</h2>
                <p>La piattaforma raccoglie le seguenti categorie di dati personali:</p>
                <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Dati identificativi:</strong> nome, cognome, email, numero di telefono</li>
                    <li><strong>Dati anagrafici:</strong> data di nascita, città di residenza</li>
                    <li><strong>Curriculum vitae:</strong> informazioni professionali e formative contenute nel CV caricato</li>
                    <li><strong>Dati di navigazione:</strong> informazioni tecniche relative all'utilizzo della piattaforma</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">4. Modalità di trattamento</h2>
                <p>
                    I dati personali sono trattati con strumenti informatici e telematici,
                    adottando misure di sicurezza tecniche e organizzative adeguate per garantire
                    la protezione dei dati contro accessi non autorizzati, perdite o distruzioni.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">5. Comunicazione e diffusione dei dati</h2>
                <p>
                    I dati personali potranno essere comunicati a:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li>Aziende partner per la gestione dei processi di selezione</li>
                    <li>Fornitori di servizi tecnici e di hosting</li>
                    <li>Autorità pubbliche e organi di vigilanza, quando richiesto dalla legge</li>
                </ul>
                <p className="mt-2">
                    I dati non saranno diffusi pubblicamente senza il consenso esplicito dell'utente.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">6. Conservazione dei dati</h2>
                <p>
                    I dati personali saranno conservati per il periodo necessario al raggiungimento
                    delle finalità per cui sono stati raccolti e, in ogni caso, nel rispetto delle
                    tempistiche previste dalla normativa vigente. Al termine del periodo di conservazione,
                    i dati saranno cancellati o resi anonimi in modo irreversibile.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">7. Diritti dell'interessato</h2>
                <p>
                    In conformità al Regolamento UE 2016/679 (GDPR), l'utente ha il diritto di:
                </p>
                <ul className="list-disc ml-6 space-y-2">
                    <li><strong>Accesso:</strong> ottenere conferma dell'esistenza dei propri dati e richiederne copia</li>
                    <li><strong>Rettifica:</strong> richiedere la correzione di dati inesatti o incompleti</li>
                    <li><strong>Cancellazione:</strong> ottenere la cancellazione dei dati personali (diritto all'oblio)</li>
                    <li><strong>Limitazione:</strong> richiedere la limitazione del trattamento dei dati</li>
                    <li><strong>Portabilità:</strong> ricevere i dati in formato strutturato e trasferirli ad altro titolare</li>
                    <li><strong>Opposizione:</strong> opporsi al trattamento dei dati personali</li>
                    <li><strong>Revoca del consenso:</strong> revocare il consenso in qualsiasi momento</li>
                </ul>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">8. Reclamo all'Autorità di controllo</h2>
                <p>
                    L'utente ha il diritto di proporre reclamo all'Autorità Garante per la Protezione
                    dei Dati Personali (www.garanteprivacy.it) qualora ritenga che il trattamento
                    dei propri dati personali avvenga in violazione del GDPR.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">9. Modifiche all'informativa</h2>
                <p>
                    La presente informativa può essere aggiornata periodicamente. Gli utenti saranno
                    informati di eventuali modifiche sostanziali tramite comunicazione sulla piattaforma
                    o via email.
                </p>
            </section>

            <section className="space-y-3">
                <h2 className="text-xl font-semibold">10. Cookie e tecnologie di tracciamento</h2>
                <p>
                    La piattaforma utilizza cookie tecnici necessari al funzionamento del sito.
                    Per maggiori informazioni, consultare la Cookie Policy.
                </p>
            </section>

            <div className="pt-6 border-t border-[var(--border)]">
                <Link
                    href="/auth/register"
                    className="inline-block px-6 py-3 bg-[var(--accent)] text-white rounded-lg hover:bg-[var(--accent)]/90 transition font-medium"
                >
                    Torna alla registrazione
                </Link>
            </div>
        </main>
    );
}