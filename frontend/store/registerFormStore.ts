// store/registerStore.ts
import { create } from "zustand";

interface RegisterForm {
    nome: string;
    cognome: string;
    email: string;
    password: string;
    conferma: string;
    dataNascita: string;
    telefono: string;
    citta: string;
}

interface RegisterStore {
    form: RegisterForm;
    cvFile: File | null;
    consensoPrivacy: boolean;

    setFormField: (key: keyof RegisterForm, value: string) => void;
    setCvFile: (file: File | null) => void;
    setConsensoPrivacy: (v: boolean) => void;

    reset: () => void;
}

const emptyForm = {
    nome: "",
    cognome: "",
    email: "",
    password: "",
    conferma: "",
    dataNascita: "",
    telefono: "",
    citta: "",
};

export const useRegisterStore = create<RegisterStore>((set) => ({
    form: emptyForm,
    cvFile: null,
    consensoPrivacy: false,

    setFormField: (key, value) =>
        set((state) => ({
            form: { ...state.form, [key]: value },
        })),

    setCvFile: (file) => set({ cvFile: file }),

    setConsensoPrivacy: (v) => set({ consensoPrivacy: v }),

    reset: () => set({ form: emptyForm, cvFile: null, consensoPrivacy: false }),
}));
