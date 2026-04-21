// import SavedRecipesList from "./SavedRecipesList";

// export default function SavedRecipesPage() {
//   return <SavedRecipesList />;
// }
import { prisma } from "../../utils/prisma";
import type { RecipeCard } from "@/src/types/recipe";
import {
  mealTypes,
  cookingTimes,
  difficulties,
  diets as dietOptions,
} from "@/src/mocks/ingredients";

import SavedRecipesList from "./SavedRecipesList";

export default async function SavedRecipesPage() {
  const dbRecipes = await prisma.recipe.findMany({
    include: {
      ingredients: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
    orderBy: {
      popularity: "desc",
    },
  });

  const initialRecipes: RecipeCard[] = dbRecipes.map((recipe) => {
    const mealTypeLabel =
      mealTypes.find((item) => item.value === recipe.mealType)?.label ??
      recipe.mealType;

    const cookingTimeLabel =
      cookingTimes.find((item) => item.value === recipe.cookingTime)?.label ??
      recipe.cookingTime;

    const difficultyLabel =
      difficulties.find((item) => item.value === recipe.difficulty)?.label ??
      recipe.difficulty;

    const dietLabels = recipe.diets.map(
      (diet) => dietOptions.find((item) => item.value === diet)?.label ?? diet,
    );

    return {
      id: recipe.id,
      slug: recipe.slug,
      title: recipe.title,
      categoryLabel: mealTypeLabel,
      mealType: recipe.mealType,
      mealTypeLabel,
      cookingTime: recipe.cookingTime,
      cookingTimeLabel,
      difficulty: recipe.difficulty,
      difficultyLabel,
      diets: recipe.diets,
      dietLabels,
      popularity: recipe.popularity,
      image: recipe.image,
      description: recipe.description,
      ingredients: recipe.ingredients.map((ingredient) => ({
        name: ingredient.name,
        amount: ingredient.amount,
      })),
      instructions: recipe.instructions,
    };
  });

  return <SavedRecipesList initialRecipes={initialRecipes} />;
}
