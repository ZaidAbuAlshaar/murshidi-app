// Murshidi AI engine — the single entry point every page uses.
//
// askAi() walks a fallback chain: the free Gemma model Zaid picked, then the
// second free variant, then the paid variant, and finally a rule-based answer
// computed from src/data/majors.ts. The chat can therefore never go dead in
// front of a judge, even with no network at all.
//
// Honesty: the model is handed the app's own data block (see ./grounding) and is
// instructed to say "لا أعرف" instead of inventing a figure. No unemployment
// rate, salary or vacancy count is hardcoded anywhere in this layer.

import {
  OpenRouterError,
  hasApiKey,
  isAbortError,
  requestCompletion,
} from '../openrouter';
import type { ChatMessage } from '../openrouter';
import { modelChain, preferredModel } from './config';
import { buildSystemPrompt } from './grounding';
import { localAnswer } from './local';
import type { AiProfileContext, AiResult, AskOptions } from './types';

export type { AiProfileContext, AskOptions, AiResult } from './types';
export { buildGroundingBlock } from './grounding';

/** Model id reported when the offline rule-based layer produced the answer. */
const LOCAL_MODEL_ID = 'local-rules';

/** One retry on the same model after a 429/5xx, then move down the chain. */
const RETRY_BACKOFF_MS = 700;

/** How many previous turns are replayed to the model. */
const HISTORY_TURNS = 8;

export function aiStatus(): { configured: boolean; model: string } {
  return { configured: hasApiKey(), model: preferredModel() };
}

function sleep(ms: number, signal?: AbortSignal): Promise<void> {
  return new Promise((resolve, reject) => {
    if (signal?.aborted) {
      reject(new DOMException('aborted', 'AbortError'));
      return;
    }
    let timer = 0;
    const onAbort = () => {
      clearTimeout(timer);
      reject(new DOMException('aborted', 'AbortError'));
    };
    timer = setTimeout(() => {
      signal?.removeEventListener('abort', onAbort);
      resolve();
    }, ms);
    signal?.addEventListener('abort', onAbort, { once: true });
  });
}

function profileLine(profile: AiProfileContext | undefined): string | null {
  if (!profile) return null;
  const ar = profile.lang === 'ar';
  const parts: string[] = [];
  if (profile.name) parts.push(ar ? `الاسم: ${profile.name}` : `Name: ${profile.name}`);
  if (typeof profile.grade === 'number') {
    parts.push(ar ? `معدّل التوجيهي: ${profile.grade}` : `Tawjihi average: ${profile.grade}`);
  }
  if (profile.branch) parts.push(ar ? `الفرع: ${profile.branch}` : `Stream: ${profile.branch}`);
  if (profile.city) parts.push(ar ? `المحافظة: ${profile.city}` : `Governorate: ${profile.city}`);
  if (parts.length === 0) return null;
  return (ar ? 'بيانات الطالب الحالي — استخدمها لتخصيص الإجابة: ' : 'Current student — use this to tailor the answer: ') + parts.join(' · ');
}

function buildMessages(prompt: string, opts: AskOptions): ChatMessage[] {
  const lang = opts.profile?.lang ?? 'ar';
  const messages: ChatMessage[] = [
    { role: 'system', content: opts.system ?? buildSystemPrompt(lang) },
  ];

  const student = profileLine(opts.profile);
  if (student) messages.push({ role: 'system', content: student });

  for (const turn of (opts.history ?? []).slice(-HISTORY_TURNS)) {
    if (turn.content.trim()) messages.push({ role: turn.role, content: turn.content });
  }

  messages.push({ role: 'user', content: prompt });
  return messages;
}

/** 401/403 mean the key itself is unusable — no point walking the rest of the chain. */
function keyIsUnusable(error: unknown): boolean {
  return error instanceof OpenRouterError && (error.status === 401 || error.status === 403);
}

/**
 * Asks the advisor a question.
 *
 * Never rejects on a model failure — it degrades to `source: 'local'` instead.
 * It DOES reject with an AbortError when the caller's own signal fires, so a
 * "stop" button and a page unmount stay distinguishable from a dead provider.
 */
export async function askAi(prompt: string, opts: AskOptions = {}): Promise<AiResult> {
  const question = prompt.trim();
  const lang = opts.profile?.lang ?? 'ar';

  if (!question) {
    return { text: localAnswer('', lang, opts.profile), model: LOCAL_MODEL_ID, source: 'local' };
  }
  if (opts.signal?.aborted) throw new DOMException('aborted', 'AbortError');

  if (hasApiKey()) {
    const messages = buildMessages(question, opts);

    for (const model of modelChain()) {
      for (let attempt = 0; attempt < 2; attempt += 1) {
        try {
          const answer = await requestCompletion({
            model,
            messages,
            signal: opts.signal,
            onToken: opts.onToken,
            json: opts.json,
            maxTokens: opts.maxTokens,
          });
          return { text: answer.text, model: answer.model, source: 'ai' };
        } catch (error) {
          // The caller aborted: surface it rather than answering something they cancelled.
          if (isAbortError(error) && opts.signal?.aborted) throw error;

          if (keyIsUnusable(error)) {
            return { text: localAnswer(question, lang, opts.profile), model: LOCAL_MODEL_ID, source: 'local' };
          }

          const retryable = error instanceof OpenRouterError && error.retryable;
          if (retryable && attempt === 0) {
            await sleep(RETRY_BACKOFF_MS, opts.signal);
            continue;
          }
          break; // next model in the chain
        }
      }
    }
  }

  return { text: localAnswer(question, lang, opts.profile), model: LOCAL_MODEL_ID, source: 'local' };
}
