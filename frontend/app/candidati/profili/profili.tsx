"use client";

import { useUser } from "@/hooks/useUser";
import { useEffect, useState } from "react";
import { updateProfiloCandidato, updatePassword } from "@/services/user.service";
import type { UpdateProfiloCandidatoRequest } from "@/types/user";
import {useAuthStore} from "@/store/authStore";

export default function ProfiloCandidato() {
    const { profilo, loading, error, reload } = useUser();

    // campi profilo modificabili
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [telefono, setTelefono] = useState("");
    const [citta, setCitta] = useState("");
    const [dataNascita, setDataNascita] = useState("");
    const [lingua, setLingua] = useState("");
    const [consensoPrivacy, setConsensoPrivacy] = useState(false);

    // CV
    const [cvFile, setCvFile] = useState<File | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const [uploadSuccess, setUploadSuccess] = useState(false);

    // stato salvataggio profilo
    const [savingProfile, setSavingProfile] = useState(false);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [profileSuccess, setProfileSuccess] = useState(false);

    // stato cambio password
    const [showPasswordForm, setShowPasswordForm] = useState(false);
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordError, setPasswordError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState(false);

    // stato modale eliminazione account
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deleting, setDeleting] = useState(false);

    // inizializza i campi quando il profilo è caricato
    useEffect(() => {
        if (profilo) {
            setNome(profilo.nome ?? "");
            setCognome(profilo.cognome ?? "");
            setTelefono(profilo.telefono ?? "");
            setCitta(profilo.citta ?? "");
            setDataNascita(profilo.dataNascita ?? "");
        }
    }, [profilo]);

    const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setCvFile(e.target.files[0]);
            setUploadSuccess(false);
            setUploadError(null);
        }
    };

    const handleUpdateProfilo = async () => {
        if (!profilo) return;

        setSavingProfile(true);
        setProfileError(null);
        setProfileSuccess(false);
        setUploadError(null);
        setUploadSuccess(false);

        try {
            const payload: UpdateProfiloCandidatoRequest = {
                nome,
                cognome,
                dataNascita: dataNascita || null,
                telefono: telefono || null,
                citta: citta || null,
                lingua: lingua || null,
            };

            await updateProfiloCandidato(payload, cvFile ?? undefined);

            setProfileSuccess(true);
            if (cvFile) {
                setUploadSuccess(true);
                setCvFile(null);
            }

            await reload();
        } catch (err: any) {
            console.error("Errore aggiornamento profilo:", err);
            const msg = err?.message || "Errore durante l'aggiornamento del profilo";
            setProfileError(msg);
            setUploadError(msg);
        } finally {
            setSavingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        setPasswordError(null);
        setPasswordSuccess(false);

        try {
            await updatePassword({
                oldPassword,
                newPassword,
            });

            setPasswordSuccess(true);
            setOldPassword("");
            setNewPassword("");
        } catch (err: any) {
            console.error("Errore cambio password:", err);
            setPasswordError(err?.message || "Errore durante il cambio password");
        }
    };

    const { user } = useAuthStore(); // hook a livello di componente

    const handleDeleteAccount = async () => {
        setDeleting(true);
        try {
            const { user, accessToken } = useAuthStore.getState();

            if (!user?.idUtente || !accessToken) {
                throw new Error("Sessione non valida");
            }

            const deleteRes = await fetch(`/api/utenti/${user.idUtente}`, {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${accessToken}`,
                },
            });

            if (!deleteRes.ok) {
                throw new Error(`Errore server: ${deleteRes.status}`);
            }
            useAuthStore.getState().logout();

            localStorage.removeItem("auth-storage");

            sessionStorage.clear();

            await new Promise(resolve => setTimeout(resolve, 150));

            const stateAfter = useAuthStore.getState();
            console.log("Store dopo pulizia:", {
                hasUser: !!stateAfter.user,
                hasToken: !!stateAfter.accessToken,
            });

            window.location.replace("/");

        } catch (err: any) {
            alert("Errore durante l'eliminazione: " + err.message);
        } finally {
            setDeleting(false);
            setShowDeleteModal(false);
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

             <div className="relative rounded-xl border border-border bg-[var(--card)] p-6 space-y-6">
                 <div className="absolute inset-0 bg-black/10 rounded-xl pointer-events-none"></div>
                 <div className="relative space-y-6">


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
                            onClick={() => setShowPasswordForm(prev => !prev)}
                            className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                        >
                            {showPasswordForm ? "Chiudi" : "Cambia password"}
                        </button>

                        {showPasswordForm && (
                            <div className="mt-3 flex flex-col gap-2 max-w-sm">
                                <input
                                    type="password"
                                    placeholder="Password attuale"
                                    className="border rounded px-3 py-1.5 text-sm bg-transparent"
                                    value={oldPassword}
                                    onChange={(e) => setOldPassword(e.target.value)}
                                />
                                <input
                                    type="password"
                                    placeholder="Nuova password"
                                    className="border rounded px-3 py-1.5 text-sm bg-transparent"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                />
                                <button
                                    type="button"
                                    onClick={handleChangePassword}
                                    className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                                >
                                    Salva nuova password
                                </button>

                                {passwordError && (
                                    <p className="text-sm text-red-600 mt-1">{passwordError}</p>
                                )}
                                {passwordSuccess && (
                                    <p className="text-sm text-green-600 mt-1">
                                        Password aggiornata con successo!
                                    </p>
                                )}
                            </div>
                        )}
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
                        <input
                            type="tel"
                            className="mt-1 w-full border rounded px-3 py-1.5 text-sm bg-transparent"
                            value={telefono}
                            onChange={(e) => setTelefono(e.target.value)}
                        />
                    </div>
                    <div>
                        <p className="text-[var(--muted)]">Città</p>
                        <input
                            type="text"
                            className="mt-1 w-full border rounded px-3 py-1.5 text-sm bg-transparent"
                            value={citta}
                            onChange={(e) => setCitta(e.target.value)}
                        />
                    </div>
                </div>

                <div>
                    <p className="text-[var(--muted)] mb-2">Carica nuovo CV</p>
                    <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleCvChange}
                        className="
                            block w-full text-sm text-white
                            bg-transparent
                            border-0
                            rounded-none
                            file:mr-4 file:py-2 file:px-4
                            file:rounded-lg
                            file:border file:border-white/60
                            file:text-sm file:font-semibold
                            file:bg-[var(--card)]
                            file:text-white
                            hover:file:bg-[var(--border)]
                            transition-all duration-200"
                    />
                    {cvFile && <p className="mt-2 text-sm text-green-600">File selezionato: {cvFile.name}</p>}
                    {uploadError && <p className="mt-2 text-sm text-red-600">{uploadError}</p>}
                    {uploadSuccess && <p className="mt-2 text-sm text-green-600">CV caricato con successo!</p>}
                </div>

                <div className="pt-2 flex gap-3">
                    <button
                        type="button"
                        onClick={handleUpdateProfilo}
                        disabled={savingProfile}
                        className="inline-flex items-center rounded-lg border px-3 py-1.5 text-sm hover:bg-[var(--border)]"
                    >
                        {savingProfile ? "Salvataggio..." : "Aggiorna dati profilo"}
                    </button>

                    <button
                        type="button"
                        onClick={() => setShowDeleteModal(true)}
                        className="inline-flex items-center rounded-lg border border-red-600 px-3 py-1.5 text-sm text-red-600 hover:bg-red-600/10"
                    >
                        Elimina account
                    </button>
                </div>

                {profileError && (
                    <p className="mt-2 text-sm text-red-600">{profileError}</p>
                )}
                {profileSuccess && (
                    <p className="mt-2 text-sm text-green-600">
                        Profilo aggiornato correttamente!
                    </p>
                )}
                 </div>
            </div>

            {/* Modale di conferma eliminazione */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-slate-800 rounded-xl border border-border max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4 text-white">Conferma eliminazione account</h3>
                        <p className="text-sm text-gray-300 mb-6">
                            Sei sicuro di voler eliminare il tuo account? I tuoi dati verranno cancellati definitivamente e questa azione non può essere annullata. Inoltre, le tue candidature verranno annullate.
                        </p>

                        <div className="flex gap-3 justify-end">
                            <button
                                type="button"
                                onClick={() => setShowDeleteModal(false)}
                                disabled={deleting}
                                className="inline-flex items-center rounded-lg border px-4 py-2 text-sm hover:bg-gray-700 text-white"
                            >
                                Annulla
                            </button>
                            <button
                                type="button"
                                onClick={handleDeleteAccount}
                                disabled={deleting}
                                className="inline-flex items-center rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                            >
                                {deleting ? "Eliminazione..." : "Elimina account"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </section>
    );
}