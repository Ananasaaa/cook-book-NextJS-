// import { Suspense } from "react";
// import RecipesList from "./RecipesList";

// export default function RecipesPage() {
//   return (
//     <Suspense fallback={null}>
//       <RecipesList />
//     </Suspense>
//   );
// }

import RecipesList from "./RecipesList";
import { prisma } from "../../utils/prisma";
import type { RecipeCard, RecipeIngredient, Option } from "@/src/types/recipe";
import {
  mealTypes,
  cookingTimes,
  difficulties,
  diets as dietOptions,
} from "@/src/mocks/ingredients";

export default async function RecipesPage() {
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
      mealTypes.find((item) => item.key === recipe.mealType)?.label ??
      recipe.mealType;

    const cookingTimeLabel =
      cookingTimes.find((item) => item.key === recipe.cookingTime)?.label ??
      recipe.cookingTime;

    const difficultyLabel =
      difficulties.find((item) => item.key === recipe.difficulty)?.label ??
      recipe.difficulty;

    const dietLabels = recipe.diets.map(
      (diet) => dietOptions.find((item) => item.key === diet)?.label ?? diet,
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

  return <RecipesList initialRecipes={initialRecipes} />;
}
