import { Suspense } from "react";
import RecipesList from "./RecipesList";

export default function RecipesPage() {
  return (
    <Suspense fallback={null}>
      <RecipesList />
    </Suspense>
  );
}

