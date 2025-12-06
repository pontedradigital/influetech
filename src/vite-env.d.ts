/// <reference types="vite/client" />

interface ImportMetaEnv {
    readonly VITE_MELHOR_ENVIO_TOKEN?: string;
    readonly VITE_MELHOR_ENVIO_SANDBOX?: string;
    readonly VITE_APP_NAME?: string;
    readonly VITE_APP_EMAIL?: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
