import "@/styles/globals.css";

export const metadata = {
    title: "Lavoro_Candidati",
    description: "Piattaforma candidature e test",
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="it">
        <body className="min-h-dvh bg-[var(--background)] text-[var(--foreground)] antialiased">
        {children}
        </body>
        </html>
    );
}
