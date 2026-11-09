// Auth API layer.
//
// Real mode (VITE_USE_MOCK=false) calls the Spring Boot endpoints below:
//   POST /auth/register          { fullName, email, phone, role, password }
//   POST /auth/login             { email, password }            -> { token, user }
//   POST /auth/forgot-password   { email }
//   POST /auth/reset-password    { token, newPassword }
//   GET  /users/me                                              -> user
//   PUT  /users/me               { fullName, email, phone }     -> user
//   PUT  /users/me/password      { currentPassword, newPassword }
// Errors should come back as { message, fieldErrors?: { field: "msg" } }.
//
// Mock mode (default) keeps accounts in localStorage so every screen works
// without a backend. Nothing in the UI changes when you switch modes.

const USE_MOCK = import.meta.env.VITE_USE_MOCK !== 'false';
const BASE_URL = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'tirahan_token';

export const isMockMode = USE_MOCK;
export const getToken = () => localStorage.getItem(TOKEN_KEY);
const setToken = (t) => (t ? localStorage.setItem(TOKEN_KEY, t) : localStorage.removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(message, fieldErrors = {}, status = 400) {
    super(message);
    this.fieldErrors = fieldErrors;
    this.status = status;
  }
}

/* ---------------------------- Real API ---------------------------- */

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (auth && getToken()) headers.Authorization = `Bearer ${getToken()}`;
  let res;
  try {
    res = await fetch(`${BASE_URL}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new ApiError('Cannot reach the server. Check your connection and try again.', {}, 0);
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new ApiError(data.message || 'Something went wrong. Try again.', data.fieldErrors || {}, res.status);
  return data;
}

const realApi = {
  register: (payload) => request('/auth/register', { method: 'POST', body: payload }),
  async login(payload) {
    const data = await request('/auth/login', { method: 'POST', body: payload });
    setToken(data.token);
    return data.user;
  },
  forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: { email } }),
  resetPassword: (token, newPassword) => request('/auth/reset-password', { method: 'POST', body: { token, newPassword } }),
  getMe: () => request('/users/me', { auth: true }),
  updateMe: (payload) => request('/users/me', { method: 'PUT', body: payload, auth: true }),
  changePassword: (payload) => request('/users/me/password', { method: 'PUT', body: payload, auth: true }),
  logout: async () => setToken(null),
};

/* ---------------------------- Mock API ---------------------------- */

const USERS_KEY = 'tirahan_mock_users';
const RESETS_KEY = 'tirahan_mock_resets';
const wait = (ms = 450) => new Promise((r) => setTimeout(r, ms));
const load = (k) => JSON.parse(localStorage.getItem(k) || '[]');
const save = (k, v) => localStorage.setItem(k, JSON.stringify(v));

async function hash(text) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
  return Array.from(new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('');
}
const publicUser = ({ passwordHash, ...u }) => u;
const normEmail = (e) => e.trim().toLowerCase();
const randomToken = () => crypto.randomUUID().replace(/-/g, '');

function currentMockUser() {
  const token = getToken();
  if (!token) throw new ApiError('Your session has expired. Sign in again.', {}, 401);
  const user = load(USERS_KEY).find((u) => u.id === token);
  if (!user) {
    setToken(null);
    throw new ApiError('Your session has expired. Sign in again.', {}, 401);
  }
  return user;
}

const mockApi = {
  async register({ fullName, email, phone, role, password }) {
    await wait();
    const users = load(USERS_KEY);
    if (users.some((u) => u.email === normEmail(email))) {
      throw new ApiError('That email is already registered.', { email: 'This email is already registered. Sign in instead.' }, 409);
    }
    users.push({
      id: crypto.randomUUID(),
      fullName: fullName.trim(),
      email: normEmail(email),
      phone: phone.replace(/[\s-]/g, ''),
      role,
      passwordHash: await hash(password),
      createdAt: new Date().toISOString(),
    });
    save(USERS_KEY, users);
    return { message: 'Account created.' };
  },

  async login({ email, password }) {
    await wait();
    const user = load(USERS_KEY).find((u) => u.email === normEmail(email));
    if (!user || user.passwordHash !== (await hash(password))) {
      throw new ApiError('Email or password is incorrect.', {}, 401);
    }
    setToken(user.id);
    return publicUser(user);
  },

  async forgotPassword(email) {
    await wait();
    const user = load(USERS_KEY).find((u) => u.email === normEmail(email));
    // Same response whether or not the email exists, so accounts can't be probed.
    if (!user) return { message: 'sent' };
    const resets = load(RESETS_KEY).filter((r) => r.userId !== user.id);
    const token = randomToken();
    resets.push({ token, userId: user.id, expiresAt: Date.now() + 15 * 60 * 1000 });
    save(RESETS_KEY, resets);
    // Mock mode has no email server, so the link is returned for display on screen.
    return { message: 'sent', devResetLink: `${window.location.origin}/reset-password?token=${token}` };
  },

  async resetPassword(token, newPassword) {
    await wait();
    const resets = load(RESETS_KEY);
    const entry = resets.find((r) => r.token === token);
    if (!entry || entry.expiresAt < Date.now()) {
      throw new ApiError('This reset link is invalid or has expired. Request a new one.', {}, 400);
    }
    const users = load(USERS_KEY);
    const user = users.find((u) => u.id === entry.userId);
    user.passwordHash = await hash(newPassword);
    save(USERS_KEY, users);
    save(RESETS_KEY, resets.filter((r) => r.token !== token));
    return { message: 'Password updated.' };
  },

  async getMe() {
    await wait(150);
    return publicUser(currentMockUser());
  },

  async updateMe({ fullName, email, phone }) {
    await wait();
    const me = currentMockUser();
    const users = load(USERS_KEY);
    if (users.some((u) => u.id !== me.id && u.email === normEmail(email))) {
      throw new ApiError('That email is already registered.', { email: 'Another account already uses this email.' }, 409);
    }
    const user = users.find((u) => u.id === me.id);
    Object.assign(user, { fullName: fullName.trim(), email: normEmail(email), phone: phone.replace(/[\s-]/g, '') });
    save(USERS_KEY, users);
    return publicUser(user);
  },

  async changePassword({ currentPassword, newPassword }) {
    await wait();
    const me = currentMockUser();
    if (me.passwordHash !== (await hash(currentPassword))) {
      throw new ApiError('Current password is incorrect.', { currentPassword: 'Current password is incorrect.' }, 400);
    }
    const users = load(USERS_KEY);
    users.find((u) => u.id === me.id).passwordHash = await hash(newPassword);
    save(USERS_KEY, users);
    return { message: 'Password updated.' };
  },

  async logout() {
    setToken(null);
  },
};

export const authApi = USE_MOCK ? mockApi : realApi;
