/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_GOOGLE_CLIENT_ID: string;
  readonly VITE_SUI_NETWORK: string;
  readonly VITE_SUI_RPC_URL: string;
  readonly VITE_API_URL: string;
  readonly VITE_SUBSCRIPTION_PACKAGE_ID: string;
  readonly VITE_SUBSCRIPTION_TREASURY_ID: string;
  readonly VITE_SUBSCRIPTION_PRICING_ID: string;
  readonly VITE_SUBSCRIPTION_CLOCK_ID: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
