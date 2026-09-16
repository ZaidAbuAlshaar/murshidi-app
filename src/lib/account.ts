// Local-first accounts for Murshidi. There is no backend: every account, the
// active session and the guest flag live in this device's localStorage.
//
// Honest note about what this is and is not:
// passwords are stored as a SHA-256 digest (WebCrypto) rather than plain text,
// which keeps a casual reader of localStorage from seeing the password itself.
// It is NOT protection against someone who holds the unlocked device — there is
// no salt, no key-stretching and no encryption of the profile fields. The UI
// copy in src/i18n/ns/auth.ts says exactly that; do not upgrade the claim here
// or there.

export type BranchId =
  | 'scientific'
  | 'literary'
  | 'health'
  | 'industrial'
  | 'commercial'
  | 'shariah'
  | 'informatics'
  | 'hotel'
  | 'agricultural';

export const BRANCH_IDS: readonly BranchId[] = [
  'scientific',
  'literary',
  'health',
  'industrial',
  'commercial',
  'shariah',
  'informatics',
  'hotel',
  'agricultural',
];

export function isBranchId(value: unknown): value is BranchId {
  return typeof value === 'string' && (BRANCH_IDS as readonly string[]).includes(value);
}

/** The account fields the app is allowed to read and show. Never contains the hash. */
export interface StudentProfile {
  id: string;
  name: string;
  grade: number | null; // Tawjihi average 0–100
  city: string; // governorate label, in the language chosen at signup
  branch: BranchId | null; // Tawjihi stream
  createdAt: string; // ISO
}

/** The stored record: a profile plus the password digest. */
export interface Account extends StudentProfile {
  passHash: string;
}

export type AuthError = 'name-taken' | 'not-found' | 'wrong-password' | 'invalid' | 'storage';

export interface AuthResult {
  ok: boolean;
  user?: StudentProfile;
  error?: AuthError;
}

export interface SignUpInput {
  name: string;
  password: string;
  grade: number | null;
  city: string;
  branch: BranchId | null;
}

const USERS_KEY = 'murshidi.accounts.v1';
const SESSION_KEY = 'murshidi.session.v1';
const ONBOARDED_KEY = 'murshidi.onboarded.v1';
const GUEST_KEY = 'murshidi.guest.v1';

/** The 12 governorates of Jordan, in the order used by the signup select. */
export const GOVERNORATES_AR = [
  'عمّان', 'إربد', 'الزرقاء', 'البلقاء', 'المفرق', 'جرش',
  'عجلون', 'مادبا', 'الكرك', 'الطفيلة', 'معان', 'العقبة',
] as const;

export const GOVERNORATES_EN = [
  'Amman', 'Irbid', 'Zarqa', 'Balqa', 'Mafraq', 'Jerash',
  'Ajloun', 'Madaba', 'Karak', 'Tafilah', 'Maan', 'Aqaba',
] as const;

export function governorates(lang: 'ar' | 'en'): readonly string[] {
  return lang === 'ar' ? GOVERNORATES_AR : GOVERNORATES_EN;
}

/**
 * Cities are stored as the label picked at signup. This maps a stored label to
 * the label of the current language so the profile still reads correctly after
 * the user switches language. Unknown labels are returned untouched.
 */
export function localizeCity(city: string, lang: 'ar' | 'en'): string {
  if (!city) return '';
  const ar = GOVERNORATES_AR as readonly string[];
  const en = GOVERNORATES_EN as readonly string[];
  const index = ar.indexOf(city) >= 0 ? ar.indexOf(city) : en.indexOf(city);
  if (index < 0) return city;
  return lang === 'ar' ? ar[index] : en[index];
}

function read<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

function write(key: string, value: unknown): boolean {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

function removeKey(key: string): void {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage may be unavailable; nothing else to do */
  }
}

async function sha256(text: string): Promise<string> {
  try {
    const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`murshidi:${text}`));
    return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
  } catch {
    // Fallback for non-secure contexts: non-cryptographic hash (demo-grade only).
    let h1 = 0xdeadbeef;
    const s = `murshidi:${text}`;
    for (let i = 0; i < s.length; i++) {
      h1 = Math.imul(h1 ^ s.charCodeAt(i), 2654435761);
    }
    return `fnv${(h1 >>> 0).toString(16)}`;
  }
}

/** Accounts written before the branch field existed are normalised on read. */
function normalise(raw: unknown): Account | null {
  if (!raw || typeof raw !== 'object') return null;
  const r = raw as Record<string, unknown>;
  if (typeof r.id !== 'string' || typeof r.name !== 'string') return null;
  return {
    id: r.id,
    name: r.name,
    grade: typeof r.grade === 'number' && Number.isFinite(r.grade) ? r.grade : null,
    city: typeof r.city === 'string' ? r.city : '',
    branch: isBranchId(r.branch) ? r.branch : null,
    createdAt: typeof r.createdAt === 'string' ? r.createdAt : new Date(0).toISOString(),
    passHash: typeof r.passHash === 'string' ? r.passHash : '',
  };
}

/** Strips the password digest. Every screen and every export uses this shape. */
export function toProfile(account: Account): StudentProfile {
  return {
    id: account.id,
    name: account.name,
    grade: account.grade,
    city: account.city,
    branch: account.branch,
    createdAt: account.createdAt,
  };
}

export function getUsers(): Account[] {
  const users = read<unknown[]>(USERS_KEY, []);
  if (!Array.isArray(users)) return [];
  return users.map(normalise).filter((u): u is Account => u !== null);
}

export function getSessionAccount(): Account | null {
  const id = read<string | null>(SESSION_KEY, null);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
}

/** Profile of the signed-in user, or null. Safe for any screen to call. */
export function getSessionUser(): StudentProfile | null {
  const account = getSessionAccount();
  return account ? toProfile(account) : null;
}

export function getSessionUserId(): string | null {
  return getSessionAccount()?.id ?? null;
}

export function isOnboarded(): boolean {
  try {
    return localStorage.getItem(ONBOARDED_KEY) === '1';
  } catch {
    return false;
  }
}

export function setOnboarded(): void {
  try {
    localStorage.setItem(ONBOARDED_KEY, '1');
  } catch {
    /* onboarding flag is best-effort */
  }
}

export function isGuestMode(): boolean {
  try {
    return localStorage.getItem(GUEST_KEY) === '1';
  } catch {
    return false;
  }
}

export function setGuestMode(on: boolean): void {
  try {
    if (on) localStorage.setItem(GUEST_KEY, '1');
    else localStorage.removeItem(GUEST_KEY);
  } catch {
    /* guest flag is best-effort */
  }
}

/** True when no other account on this device already uses that name. */
export function isNameAvailable(name: string, exceptId?: string): boolean {
  const clean = name.trim().replace(/\s+/g, ' ').toLowerCase();
  if (!clean) return false;
  return !getUsers().some((u) => u.id !== exceptId && u.name.trim().toLowerCase() === clean);
}

export function validateGrade(value: string): { ok: boolean; grade: number | null } {
  const trimmed = value.trim();
  if (trimmed === '') return { ok: true, grade: null };
  const n = Number(trimmed);
  if (!Number.isFinite(n) || n < 0 || n > 100) return { ok: false, grade: null };
  return { ok: true, grade: Math.round(n * 100) / 100 };
}

export async function signUp(input: SignUpInput): Promise<AuthResult> {
  const cleanName = input.name.trim().replace(/\s+/g, ' ');
  if (cleanName.length < 2 || input.password.length < 4) return { ok: false, error: 'invalid' };
  const users = getUsers();
  if (users.some((u) => u.name.trim().toLowerCase() === cleanName.toLowerCase())) {
    return { ok: false, error: 'name-taken' };
  }
  const account: Account = {
    id: `u_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`,
    name: cleanName,
    grade: input.grade,
    city: input.city,
    branch: input.branch,
    createdAt: new Date().toISOString(),
    passHash: await sha256(input.password),
  };
  users.push(account);
  if (!write(USERS_KEY, users) || !write(SESSION_KEY, account.id)) return { ok: false, error: 'storage' };
  setGuestMode(false);
  return { ok: true, user: toProfile(account) };
}

export async function signIn(name: string, password: string): Promise<AuthResult> {
  const cleanName = name.trim().toLowerCase();
  if (!cleanName || !password) return { ok: false, error: 'invalid' };
  const account = getUsers().find((u) => u.name.trim().toLowerCase() === cleanName);
  if (!account) return { ok: false, error: 'not-found' };
  if ((await sha256(password)) !== account.passHash) return { ok: false, error: 'wrong-password' };
  if (!write(SESSION_KEY, account.id)) return { ok: false, error: 'storage' };
  setGuestMode(false);
  return { ok: true, user: toProfile(account) };
}

/** Ends the session and leaves guest mode, so the next screen asks who you are. */
export function signOut(): void {
  removeKey(SESSION_KEY);
  setGuestMode(false);
}

export function updateAccount(
  id: string,
  patch: Partial<Omit<StudentProfile, 'id' | 'createdAt'>>,
): StudentProfile | null {
  const users = getUsers();
  const index = users.findIndex((u) => u.id === id);
  if (index < 0) return null;
  const current = users[index];
  const nextName = patch.name === undefined ? current.name : patch.name.trim().replace(/\s+/g, ' ');
  if (nextName.length < 2) return null;
  const taken = users.some((u, i) => i !== index && u.name.trim().toLowerCase() === nextName.toLowerCase());
  if (taken) return null;
  const next: Account = {
    ...current,
    name: nextName,
    grade: patch.grade === undefined ? current.grade : patch.grade,
    city: patch.city === undefined ? current.city : patch.city,
    branch: patch.branch === undefined ? current.branch : patch.branch,
  };
  users[index] = next;
  if (!write(USERS_KEY, users)) return null;
  return toProfile(next);
}

/** Removes the account record and its session. Activity data is cleared by the caller. */
export function deleteAccount(id: string): boolean {
  const users = getUsers().filter((u) => u.id !== id);
  const saved = write(USERS_KEY, users);
  removeKey(SESSION_KEY);
  setGuestMode(false);
  return saved;
}

export function initialsOf(name: string, lang: 'ar' | 'en'): string {
  const trimmed = name.trim();
  if (!trimmed) return lang === 'ar' ? 'ض' : 'G';
  if (lang === 'ar') {
    return trimmed.replace(/\s+/g, '').slice(0, 2);
  }
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] || 'M';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}
