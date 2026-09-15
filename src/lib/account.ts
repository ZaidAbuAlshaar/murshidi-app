// Local-first accounts for Murshidi (offline capable, no backend).
// Users + session live in this device's localStorage. Passwords are
// SHA-256 hashed (WebCrypto) — never stored in plain text.

export interface Account {
  id: string;
  name: string;
  grade: number | null;
  city: string;
  passHash: string;
  createdAt: string; // ISO
}

const USERS_KEY = 'murshidi.accounts.v1';
const SESSION_KEY = 'murshidi.session.v1';
const ONBOARDED_KEY = 'murshidi.onboarded.v1';

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

export function getUsers(): Account[] {
  const users = read<Account[]>(USERS_KEY, []);
  return Array.isArray(users) ? users : [];
}

export function getSessionUser(): Account | null {
  const id = read<string | null>(SESSION_KEY, null);
  if (!id) return null;
  return getUsers().find((u) => u.id === id) || null;
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

export interface AuthResult {
  ok: boolean;
  user?: Account;
  error?: 'name-taken' | 'not-found' | 'wrong-password' | 'invalid' | 'storage';
}

export async function signUp(name: string, grade: number | null, city: string, password: string): Promise<AuthResult> {
  const cleanName = name.trim().replace(/\s+/g, ' ');
  if (cleanName.length < 2 || password.length < 4) return { ok: false, error: 'invalid' };
  const users = getUsers();
  if (users.some((u) => u.name.trim().toLowerCase() === cleanName.toLowerCase())) {
    return { ok: false, error: 'name-taken' };
  }
  const user: Account = {
    id: `u_${Date.now().toString(36)}_${Math.floor(Math.random() * 1e6).toString(36)}`,
    name: cleanName,
    grade,
    city,
    passHash: await sha256(password),
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  if (!write(USERS_KEY, users) || !write(SESSION_KEY, user.id)) return { ok: false, error: 'storage' };
  return { ok: true, user };
}

export async function signIn(name: string, password: string): Promise<AuthResult> {
  const cleanName = name.trim().toLowerCase();
  if (!cleanName || !password) return { ok: false, error: 'invalid' };
  const user = getUsers().find((u) => u.name.trim().toLowerCase() === cleanName);
  if (!user) return { ok: false, error: 'not-found' };
  if ((await sha256(password)) !== user.passHash) return { ok: false, error: 'wrong-password' };
  if (!write(SESSION_KEY, user.id)) return { ok: false, error: 'storage' };
  return { ok: true, user };
}

export function signOut(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* sign-out is best-effort */
  }
}

export function initialsOf(name: string, lang: 'ar' | 'en'): string {
  const parts = name.trim().split(/\s+/);
  if (lang === 'ar') {
    const chars = name.trim().replace(/\s+/g, '');
    return chars.slice(0, 2);
  }
  const first = parts[0]?.[0] || 'M';
  const last = parts.length > 1 ? parts[parts.length - 1][0] : '';
  return `${first}${last}`.toUpperCase();
}
