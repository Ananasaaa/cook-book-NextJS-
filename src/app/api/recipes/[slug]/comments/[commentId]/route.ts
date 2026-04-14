import { NextResponse } from "next/server";
import { auth } from "../../../../../../auth/auth";
import { prisma } from "../../../../../../utils/prisma";

type RouteContext = {
  params: Promise<{
    slug: string;
    commentId: string;
  }>;
};

export async function DELETE(_request: Request, { params }: RouteContext) {
  const session = await auth();

  const email =
    typeof session?.user?.email === "string" && session.user.email.length > 0
      ? session.user.email
      : null;

  if (!email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug, commentId } = await params;

  try {
    const user = await prisma.user.findUnique({
      where: { email },
      select: { id: true },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const comment = await prisma.recipeComment.findFirst({
      where: {
        id: commentId,
        recipeSlug: slug,
      },
      select: {
        id: true,
        userId: true,
      },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    if (comment.userId !== user.id) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    await prisma.recipeComment.delete({
      where: {
        id: commentId,
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { message: "Failed to delete comment" },
      { status: 500 },
    );
  }
}
