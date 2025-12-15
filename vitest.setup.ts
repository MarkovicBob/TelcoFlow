// Vitest global helpers for Vite SSR transforms used during tests
// Vite injects __vite_ssr_exportName__ in transformed modules; ensure it exists in Node env
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
if (!globalThis.__vite_ssr_exportName__) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  globalThis.__vite_ssr_exportName__ = (name: string, value: unknown) => {
    (globalThis as Record<string, unknown>)[name] = value;
  };
}

export {};
