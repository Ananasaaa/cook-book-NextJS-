import type { RecipeCard, RecipeIngredient } from "@/src/mocks/ingredients";

export type DraftIngredientLine = {
  kind: "ingredient" | "chapter";
  value: string;
};

export type DraftStepLine = {
  value: string;
};

function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return s.length > 0 ? s : "recipe";
}

function linesToIngredients(lines: DraftIngredientLine[]): RecipeIngredient[] {
  const out: RecipeIngredient[] = [];
  for (const line of lines) {
    const v = line.value.trim();
    if (!v) {
      continue;
    }
    if (line.kind === "chapter") {
      out.push({ name: v, amount: "—" });
      continue;
    }
    const tabIdx = v.indexOf("\t");
    if (tabIdx !== -1) {
      out.push({
        name: v.slice(0, tabIdx).trim(),
        amount: v.slice(tabIdx + 1).trim(),
      });
      continue;
    }
    const dash = v.match(/^(.+?)\s*[–—-]\s*(.+)$/);
    if (dash) {
      out.push({ name: dash[1].trim(), amount: dash[2].trim() });
      continue;
    }
    out.push({ name: v, amount: "qs" });
  }
  if (out.length === 0) {
    out.push({ name: "Ingredients as listed", amount: "—" });
  }
  return out;
}

function stepsToInstructions(steps: DraftStepLine[]): string {
  const blocks = steps.map((s) => s.value.trim()).filter(Boolean);
  return blocks.length > 0 ? blocks.join("\n\n") : "Add your cooking steps.";
}

export function buildUserRecipeCard(input: {
  title: string;
  description: string;
  image: string;
  ingredientLines: DraftIngredientLine[];
  steps: DraftStepLine[];
}): RecipeCard {
  const title = input.title.trim() || "Untitled recipe";
  const slug = `${slugify(title)}-${Date.now()}`;
  const description =
    input.description.trim() || "A recipe you added from Recipe & Kitchen.";

  return {
    id: Date.now(),
    slug,
    title,
    categoryLabel: "My recipes",
    mealType: "snack",
    mealTypeLabel: "Snack",
    cookingTime: "15to30",
    cookingTimeLabel: "30 min",
    difficulty: "easy",
    difficultyLabel: "Easy",
    diets: [],
    dietLabels: [],
    popularity: 60,
    image: input.image,
    description,
    ingredients: linesToIngredients(input.ingredientLines),
    instructions: stepsToInstructions(input.steps),
  };
}
