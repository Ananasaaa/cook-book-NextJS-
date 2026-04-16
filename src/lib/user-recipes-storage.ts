import type { RecipeCard } from "@/src/mocks/ingredients";

import { compressDataUrlToJpegDataUrl } from "@/src/lib/compress-image-to-data-url";
import {
  isInlineRecipeImageSrc,
  normalizeRecipeImageSrc,
} from "@/src/lib/recipe-image-display";

const STORAGE_KEY = "recipe-kitchen-user-recipes-v1";

export const USER_RECIPES_CHANGED_EVENT = "recipe-kitchen-user-recipes-changed";

export function loadUserRecipes(): RecipeCard[] {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    return JSON.parse(raw) as RecipeCard[];
  } catch {
    return [];
  }
}

export function saveUserRecipes(list: RecipeCard[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export async function appendUserRecipe(recipe: RecipeCard): Promise<void> {
  let current: RecipeCard = recipe;

  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const list = loadUserRecipes();
      list.unshift(current);
      saveUserRecipes(list);
      if (typeof window !== "undefined") {
        window.dispatchEvent(new Event(USER_RECIPES_CHANGED_EVENT));
      }
      return;
    } catch {
      const img = normalizeRecipeImageSrc(current.image);
      if (isInlineRecipeImageSrc(img) && /^data:/i.test(img)) {
        const maxSide = Math.max(200, 520 - attempt * 36);
        const quality = Math.max(0.55, 0.78 - attempt * 0.03);
        const smaller = await compressDataUrlToJpegDataUrl(img, maxSide, quality);
        current = {
          ...current,
          image: smaller ?? "/add-photo.png",
        };
      } else {
        current = { ...current, image: "/add-photo.png" };
      }
    }
  }

  try {
    const list = loadUserRecipes();
    list.unshift({ ...recipe, image: "/add-photo.png" });
    saveUserRecipes(list);
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event(USER_RECIPES_CHANGED_EVENT));
    }
  } catch {
    // quota or storage unavailable
  }
}

export function getUserRecipeBySlug(slug: string): RecipeCard | undefined {
  return loadUserRecipes().find((r) => r.slug === slug);
}
