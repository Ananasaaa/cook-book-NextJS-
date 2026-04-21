// import { prisma } from "../../../utils/prisma";
// import { auth } from "../../../auth/auth";
// import { recipes } from "../../../mocks/ingredients";

// import RecipeDetailView from "./RecipeDetailView";

// type RecipePageProps = {
//   params: Promise<{
//     slug: string;
//   }>;
// };

// export default async function RecipePage({ params }: RecipePageProps) {
//   const { slug } = await params;

//   const mockRecipe = recipes.find((item) => item.slug === slug) ?? null;

//   const session = await auth();

//   const userEmail =
//     typeof session?.user?.email === "string" && session.user.email.length > 0
//       ? session.user.email
//       : null;

//   let currentUserId = "";

//   if (userEmail) {
//     const currentUser = await prisma.user.findUnique({
//       where: { email: userEmail },
//       select: { id: true },
//     });

//     currentUserId = currentUser?.id ?? "";
//   }

//   const dbComments = await prisma.recipeComment.findMany({
//     where: {
//       recipeSlug: slug,
//     },
//     orderBy: {
//       createdAt: "desc",
//     },
//     include: {
//       user: {
//         select: {
//           id: true,
//           email: true,
//         },
//       },
//       _count: {
//         select: {
//           likes: true,
//         },
//       },
//       likes: {
//         where: {
//           userId: currentUserId,
//         },
//         select: {
//           id: true,
//         },
//       },
//     },
//   });

//   const initialComments = dbComments.map((comment) => ({
//     id: comment.id,
//     body: comment.body,
//     createdAt: comment.createdAt.toISOString(),
//     userId: comment.userId,
//     user: {
//       id: comment.user.id,
//       email: comment.user.email,
//     },
//     likesCount: comment._count.likes,
//     isLikedByMe: currentUserId !== "" && comment.likes.length > 0,
//   }));

//   return (
//     <RecipeDetailView
//       slug={slug}
//       initialRecipe={mockRecipe}
//       initialComments={initialComments}
//     />
//   );
// }

import { prisma } from "../../../utils/prisma";
import { auth } from "../../../auth/auth";
import type { RecipeCard, RecipeIngredient, Option } from "@/src/types/recipe";
import {
  mealTypes,
  cookingTimes,
  difficulties,
  diets as dietOptions,
} from "@/src/mocks/ingredients";

import RecipeDetailView from "./RecipeDetailView";

type RecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;

  const dbRecipe = await prisma.recipe.findUnique({
    where: {
      slug,
    },
    include: {
      ingredients: {
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  const initialRecipe: RecipeCard | null = dbRecipe
    ? {
        id: dbRecipe.id,
        slug: dbRecipe.slug,
        title: dbRecipe.title,
        categoryLabel:
          mealTypes.find((item) => item.key === dbRecipe.mealType)?.label ??
          dbRecipe.mealType,
        mealType: dbRecipe.mealType,
        mealTypeLabel:
          mealTypes.find((item) => item.key === dbRecipe.mealType)?.label ??
          dbRecipe.mealType,
        cookingTime: dbRecipe.cookingTime,
        cookingTimeLabel:
          cookingTimes.find((item) => item.key === dbRecipe.cookingTime)
            ?.label ?? dbRecipe.cookingTime,
        difficulty: dbRecipe.difficulty,
        difficultyLabel:
          difficulties.find((item) => item.key === dbRecipe.difficulty)
            ?.label ?? dbRecipe.difficulty,
        diets: dbRecipe.diets,
        dietLabels: dbRecipe.diets.map(
          (diet) =>
            dietOptions.find((item) => item.key === diet)?.label ?? diet,
        ),
        popularity: dbRecipe.popularity,
        image: dbRecipe.image,
        description: dbRecipe.description,
        ingredients: dbRecipe.ingredients.map((ingredient) => ({
          name: ingredient.name,
          amount: ingredient.amount,
        })),
        instructions: dbRecipe.instructions,
      }
    : null;

  const session = await auth();

  const userEmail =
    typeof session?.user?.email === "string" && session.user.email.length > 0
      ? session.user.email
      : null;

  let currentUserId = "";

  if (userEmail) {
    const currentUser = await prisma.user.findUnique({
      where: { email: userEmail },
      select: { id: true },
    });

    currentUserId = currentUser?.id ?? "";
  }

  const dbComments = await prisma.recipeComment.findMany({
    where: {
      recipeSlug: slug,
    },
    orderBy: {
      createdAt: "desc",
    },
    include: {
      user: {
        select: {
          id: true,
          email: true,
        },
      },
      _count: {
        select: {
          likes: true,
        },
      },
      likes: {
        where: {
          userId: currentUserId,
        },
        select: {
          id: true,
        },
      },
    },
  });

  const initialComments = dbComments.map((comment) => ({
    id: comment.id,
    body: comment.body,
    createdAt: comment.createdAt.toISOString(),
    userId: comment.userId,
    user: {
      id: comment.user.id,
      email: comment.user.email,
    },
    likesCount: comment._count.likes,
    isLikedByMe: currentUserId !== "" && comment.likes.length > 0,
  }));

  return (
    <RecipeDetailView
      slug={slug}
      initialRecipe={initialRecipe}
      initialComments={initialComments}
    />
  );
}
