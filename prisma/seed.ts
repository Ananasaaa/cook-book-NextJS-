import { PrismaClient } from "../src/generated/prisma/client";
import { recipes } from "../src/mocks/ingredients";

const prisma = new PrismaClient();

async function main() {
  for (const recipe of recipes) {
    await prisma.recipe.upsert({
      where: {
        slug: recipe.slug,
      },
      update: {
        title: recipe.title,
        description: recipe.description,
        image: recipe.image,
        mealType: recipe.mealType,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        diets: recipe.diets,
        popularity: recipe.popularity,
        instructions: recipe.instructions,
      },
      create: {
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        image: recipe.image,
        mealType: recipe.mealType,
        cookingTime: recipe.cookingTime,
        difficulty: recipe.difficulty,
        diets: recipe.diets,
        popularity: recipe.popularity,
        instructions: recipe.instructions,
      },
    });

    const dbRecipe = await prisma.recipe.findUnique({
      where: {
        slug: recipe.slug,
      },
      select: {
        id: true,
      },
    });

    if (!dbRecipe) {
      continue;
    }

    await prisma.recipeIngredient.deleteMany({
      where: {
        recipeId: dbRecipe.id,
      },
    });

    if (recipe.ingredients.length > 0) {
      await prisma.recipeIngredient.createMany({
        data: recipe.ingredients.map((ingredient, index) => ({
          recipeId: dbRecipe.id,
          name: ingredient.name,
          amount: ingredient.amount,
          sortOrder: index,
        })),
      });
    }
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
