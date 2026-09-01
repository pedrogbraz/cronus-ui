/**
 * DEMO auth adapter. Gold-path apps replace `lib/auth-adapter.ts` with a
 * Better-Auth implementation that keeps the same named exports
 * (`signInEmail`, `signUpEmail`, `requestPasswordReset`, `resetPassword`).
 *
 * PURE TS (zero React / hooks / DOM). Gallery and store demos fake success
 * after client-side validation — no network.
 */

/** Email + password used by sign-in (and as the base of sign-up). */
export interface AuthCredentials {
  email: string;
  password: string;
}

/** Sign-up payload — same credentials, optional display name. */
export interface SignUpInput extends AuthCredentials {
  name?: string;
}

const DEMO_LATENCY_MS = 200;

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

function requireEmail(email: string): void {
  const trimmed = email.trim();
  if (!trimmed) {
    throw new Error("Email is required.");
  }
  if (!trimmed.includes("@")) {
    throw new Error("Enter a valid email address.");
  }
}

function requirePassword(password: string): void {
  if (password.length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
}

/** Demo sign-in: validate, wait briefly, resolve. No network. */
export async function signInEmail(input: AuthCredentials): Promise<void> {
  requireEmail(input.email);
  requirePassword(input.password);
  await wait(DEMO_LATENCY_MS);
}

/** Demo sign-up: validate, wait briefly, resolve. No network. */
export async function signUpEmail(input: SignUpInput): Promise<void> {
  requireEmail(input.email);
  requirePassword(input.password);
  await wait(DEMO_LATENCY_MS);
}

/** Demo password-reset request: validate email, wait briefly, resolve. No network. */
export async function requestPasswordReset(input: { email: string }): Promise<void> {
  requireEmail(input.email);
  await wait(DEMO_LATENCY_MS);
}

/** Demo password reset: require a token and a valid password, wait, resolve. */
export async function resetPassword(input: { token: string; newPassword: string }): Promise<void> {
  if (!input.token.trim()) {
    throw new Error("Reset link is missing or expired.");
  }
  requirePassword(input.newPassword);
  await wait(DEMO_LATENCY_MS);
}
