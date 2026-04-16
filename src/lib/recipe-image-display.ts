export function normalizeRecipeImageSrc(
  raw: string | undefined | null,
): string {
  if (raw == null || typeof raw !== "string") {
    return "/add-photo.png";
  }
  let s = raw.trim();
  if (s.length === 0) {
    return "/add-photo.png";
  }
  if (s.charCodeAt(0) === 0xfeff) {
    s = s.slice(1);
  }
  s = s.replace(/^[\u200B-\u200D\uFEFF]+/, "");
  if (s.length === 0) {
    return "/add-photo.png";
  }
  if (/^data:/i.test(s)) {
    return s.replace(/^data:/i, "data:");
  }
  return s;
}

export function isInlineRecipeImageSrc(src: string): boolean {
  const t = src.trim();
  return /^data:/i.test(t) || t.startsWith("blob:");
}
