"use server";

import { signIn } from "../auth/auth";

export async function signInWithCredentials(
  email: string,
  password: string
): Promise<{ ok: boolean; error?: string }> {
  try {
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return {
      ok: result?.ok ?? false,
      error: result?.error ?? undefined,
    };
  } catch {
    return { ok: false, error: "SignInFailed" };
  }
}
