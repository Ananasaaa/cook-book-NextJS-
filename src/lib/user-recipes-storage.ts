import type { RecipeCard } from "@/src/mocks/ingredients";

const STORAGE_KEY = "recipe-kitchen-user-recipes-v1";

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

export function appendUserRecipe(recipe: RecipeCard): void {
  const list = loadUserRecipes();
  list.unshift(recipe);
  saveUserRecipes(list);
}

export function getUserRecipeBySlug(slug: string): RecipeCard | undefined {
  return loadUserRecipes().find((r) => r.slug === slug);
}
