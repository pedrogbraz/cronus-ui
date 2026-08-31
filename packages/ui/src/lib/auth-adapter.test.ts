import { describe, expect, it } from "vitest";
import { requestPasswordReset, signInEmail, signUpEmail } from "./auth-adapter.js";

const valid = { email: "mara@cronus.io", password: "password1" };

describe("auth-adapter (demo)", () => {
  it("signInEmail throws when email is empty", async () => {
    await expect(signInEmail({ email: "", password: valid.password })).rejects.toThrow(
      "Email is required.",
    );
    await expect(signInEmail({ email: "   ", password: valid.password })).rejects.toThrow(
      "Email is required.",
    );
  });

  it("signInEmail throws when email has no @", async () => {
    await expect(signInEmail({ email: "not-an-email", password: valid.password })).rejects.toThrow(
      "Enter a valid email address.",
    );
  });

  it("signInEmail throws when password is shorter than 8 characters", async () => {
    await expect(signInEmail({ email: valid.email, password: "short" })).rejects.toThrow(
      "Password must be at least 8 characters.",
    );
    await expect(signInEmail({ email: valid.email, password: "" })).rejects.toThrow(
      "Password must be at least 8 characters.",
    );
  });

  it("signInEmail resolves for valid credentials", async () => {
    await expect(signInEmail(valid)).resolves.toBeUndefined();
  });

  it("signUpEmail validates like sign-in and accepts an optional name", async () => {
    await expect(signUpEmail({ email: "", password: valid.password })).rejects.toThrow(
      "Email is required.",
    );
    await expect(signUpEmail({ email: valid.email, password: "1234567" })).rejects.toThrow(
      "Password must be at least 8 characters.",
    );
    await expect(signUpEmail(valid)).resolves.toBeUndefined();
    await expect(signUpEmail({ ...valid, name: "Mara Castillo" })).resolves.toBeUndefined();
  });

  it("requestPasswordReset validates email only", async () => {
    await expect(requestPasswordReset({ email: "" })).rejects.toThrow("Email is required.");
    await expect(requestPasswordReset({ email: "nope" })).rejects.toThrow(
      "Enter a valid email address.",
    );
    await expect(requestPasswordReset({ email: valid.email })).resolves.toBeUndefined();
  });
});
