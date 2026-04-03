"use client";

import {
  useCallback,
  useLayoutEffect,
  useState,
  type Dispatch,
  type SetStateAction,
} from "react";

function persistSlugs(storageKey: string, slugs: Set<string>) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(Array.from(slugs)));
  } catch {
    return;
  }
}

export function useSavedRecipeSlugs(storageKey: string | null) {
  const [savedSlugs, setSavedSlugsState] = useState<Set<string>>(
    () => new Set(),
  );

  useLayoutEffect(() => {
    if (!storageKey) return;

    try {
      const raw = localStorage.getItem(storageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown) : [];

      if (Array.isArray(parsed)) {
        const next = new Set(
          parsed.filter((x): x is string => typeof x === "string"),
        );
        setSavedSlugsState(next);
      } else {
        setSavedSlugsState(new Set());
      }
    } catch {
      setSavedSlugsState(new Set());
    }
  }, [storageKey]);

  const setSavedSlugs = useCallback(
    (value: SetStateAction<Set<string>>) => {
      if (!storageKey) return;

      setSavedSlugsState((prev) => {
        const next = typeof value === "function" ? value(prev) : value;
        persistSlugs(storageKey, next);
        return next;
      });
    },
    [storageKey],
  );

  return [savedSlugs, setSavedSlugs] as const satisfies [
    Set<string>,
    Dispatch<SetStateAction<Set<string>>>,
  ];
}
