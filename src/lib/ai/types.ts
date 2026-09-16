// Public types for the Murshidi AI layer. Kept in their own module so the
// rule-based fallback can import them without creating a cycle through index.ts.

export interface AiProfileContext {
  name?: string;
  grade?: number | null;
  branch?: string | null;
  city?: string | null;
  lang: 'ar' | 'en';
}

export interface AskOptions {
  history?: { role: 'user' | 'assistant'; content: string }[];
  profile?: AiProfileContext;
  signal?: AbortSignal;
  /**
   * Fires for every streamed delta.
   *
   * Treat what arrives here as a live preview, not the final answer: if a model
   * dies mid-stream the chain restarts on the next model and tokens begin again
   * from the top. When the promise resolves, replace whatever you accumulated
   * with `AiResult.text`, which is always the authoritative full answer.
   */
  onToken?: (chunk: string) => void;
  /** Overrides the default advisor prompt (which already carries the grounding block). */
  system?: string;
  json?: boolean;
  maxTokens?: number;
}

export interface AiResult {
  text: string;
  /** The model id that actually answered, or 'local-rules' for the offline layer. */
  model: string;
  /** 'local' = every remote attempt failed and this is the rule-based answer. */
  source: 'ai' | 'local';
}
