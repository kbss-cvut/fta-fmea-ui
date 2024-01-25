/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_API_URL: string;
    VITE_ADMIN_REGISTRATION_ONLY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}