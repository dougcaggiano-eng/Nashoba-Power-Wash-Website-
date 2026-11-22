/// <reference types="vite/client" />
interface ImportMetaEnv {
  /** Optional URL that receives the quote form as multipart/form-data (e.g. Formspree, Netlify, your own endpoint). */
  readonly VITE_QUOTE_ENDPOINT?: string;
}
