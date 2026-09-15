export const OPENROUTER_DEFAULT_MODEL = 'google/gemma-4-26b-a4b-it:free';
export const OPENROUTER_FALLBACK_MODEL = 'google/gemma-4-31b-it:free';

const ENDPOINT = 'https://openrouter.ai/api/v1/chat/completions';

export const AI_SYSTEM_PROMPT =
  'أنت «المرشد الذكي» في تطبيق مُرشِدي الأردني لمساعدة طلبة التوجيهي على اختيار التخصص الجامعي. ' +
  'أجب بالعربية الفصيحة المبسطة (RTL) وباختصار عملي: نقاط مرقمة قصيرة. ' +
  'اعتمد هذه الحقائق عند الحاجة: الطب البشري حكومياً حدّه ~96، التمريض ~75، العلاج الطبيعي ~78، التغذية ~76؛ ' +
  'بطالة الإعلام ~41% (DOS Q1 2026)، المدني 24%، المعمارية 32%، هندسة البرمجيات 9%؛ ' +
  'التمريض مطلوب جداً في الخليج (4,500–6,000 ر.س) ويحتاج خبرة سنتين غالباً. ' +
  'وجّه الطالب دائماً لأدوات التطبيق: حاسبة عائد التعليم، المقارنة، اختبار الميول. ' +
  'لا تقدّم نفسك كبديل عن مرشد أكاديمي معتمد.';

interface ChatMsg { role: 'user' | 'assistant' | 'system'; content: string; }

export async function askOpenRouter(
  apiKey: string,
  userText: string,
  history: ChatMsg[],
  model: string = OPENROUTER_DEFAULT_MODEL,
): Promise<string> {
  const models = [model, OPENROUTER_FALLBACK_MODEL].filter((m, i, a) => m && a.indexOf(m) === i);
  let lastError = '';
  for (const m of models) {
    try {
      const res = await fetch(ENDPOINT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
          'HTTP-Referer': 'https://aboodhaymouni.github.io/murshidi-app/',
          'X-Title': 'Murshidi',
        },
        body: JSON.stringify({
          model: m,
          messages: [
            { role: 'system', content: AI_SYSTEM_PROMPT },
            ...history.slice(-6),
            { role: 'user', content: userText },
          ],
          temperature: 0.6,
          max_tokens: 700,
        }),
      });
      if (!res.ok) {
        lastError = `HTTP ${res.status}`;
        continue;
      }
      const data: unknown = await res.json();
      const text =
        data &&
        typeof data === 'object' &&
        'choices' in data &&
        Array.isArray((data as { choices: unknown[] }).choices)
          ? (data as { choices: Array<{ message?: { content?: unknown } }> }).choices[0]?.message?.content
          : null;
      if (typeof text === 'string' && text.trim()) return text.trim();
      lastError = 'empty';
    } catch (e) {
      lastError = e instanceof Error ? e.message : 'network';
    }
  }
  throw new Error(lastError || 'failed');
}
