const PREFIX = "saved_recipes_v1_";

export function savedRecipesStorageKey(userId: string): string {
  return `${PREFIX}${userId}`;
}

export function savedRecipesStorageKeyFromSession(
  session: {
    user?: { id?: string | null; email?: string | null } | null;
  } | null,
): string | null {
  const user = session?.user;
  if (!user) return null;
  const part = user.id ?? user.email;
  if (!part) return null;
  return savedRecipesStorageKey(String(part));
}
