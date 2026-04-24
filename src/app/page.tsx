import { Suspense } from "react";
import Cards from "./components/cards/Cards";
import Banner from "./components/home/Banner";
import HeroSearch from "./components/home/HeroSearch";
import RecipesList from "./recipes/RecipesList";
import { getInitialRecipeCards } from "@/src/lib/get-initial-recipe-cards";

export default async function Home() {
  const initialRecipes = await getInitialRecipeCards();

  return (
    <>
      <Suspense fallback={null}>
        <HeroSearch />
      </Suspense>
      <Banner />
      <Cards />
      <RecipesList initialRecipes={initialRecipes} embedded />
    </>
  );
}
