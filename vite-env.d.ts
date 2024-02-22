/// <reference types="vite/client" />
interface ImportMetaEnv {
    FTA_FMEA_API_URL: string;
    FTA_FMEA_ADMIN_REGISTRATION_ONLY: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}