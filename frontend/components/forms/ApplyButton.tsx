// frontend/components/forms/ApplyButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Button from "@/components/ui/button";
import { createCandidatura } from "@/services/candidatura.service";

type ApplyButtonProps = {
    idPosizione: number;
    /**
     * Se true, il bottone occupa tutta la larghezza disponibile.
     */
    fullWidth?: boolean;
};

export default function ApplyButton({
                                        idPosizione,
                                        fullWidth = false,
                                    }: ApplyButtonProps) {
    const router = useRouter();
    const [submitting, setSubmitting] = useState(false);

    async function handleClick() {
        if (submitting) return;

        try {
            setSubmitting(true);

            await createCandidatura({ idPosizione });

            // In futuro sostituibile con un toast
            router.push("/candidati/candidature");
        } catch (err: any) {
            console.error(err);
            alert(
                err?.message ||
                "Si è verificato un errore durante l'invio della candidatura."
            );
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <Button
            type="button"
            onClick={handleClick}
            disabled={submitting}
            className={fullWidth ? "w-full mt-2" : "mt-2"}
        >
            {submitting ? "Invio candidatura…" : "Candidati"}
        </Button>
    );
}
