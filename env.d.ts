declare namespace NodeJS {
  interface ProcessEnv {
    readonly NEXT_PUBLIC_SYNC_URL: string | undefined;
    readonly NEXT_PUBLIC_GITHUB_CLIENT_ID: string | undefined;
    readonly NEXT_PUBLIC_GOOGLE_CLIENT_ID: string | undefined;
  }
}
