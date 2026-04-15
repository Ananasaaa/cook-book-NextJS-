import { prisma } from "../../../utils/prisma";
import { auth } from "../../../auth/auth";
import { recipes } from "../../../mocks/ingredients";

import RecipeDetailView from "./RecipeDetailView";

type RecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;

  const mockRecipe = recipes.find((item) => item.slug === slug) ?? null;

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
      initialRecipe={mockRecipe}
      initialComments={initialComments}
    />
  );
}
