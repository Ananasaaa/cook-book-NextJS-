import RecipesList from "./RecipesList";
import { getInitialRecipeCards } from "@/src/lib/get-initial-recipe-cards";

export default async function RecipesPage() {
  const initialRecipes = await getInitialRecipeCards();

  return <RecipesList initialRecipes={initialRecipes} />;
}
