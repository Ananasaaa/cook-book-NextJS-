import { NextResponse } from "next/server";
import { auth } from "../../../../../../../auth/auth";
import { prisma } from "../../../../../../../utils/prisma";

type RouteContext = {
  params: Promise<{
    commentId: string;
  }>;
};

async function getCurrentUserId() {
  const session = await auth();

  const email =
    typeof session?.user?.email === "string" && session.user.email.length > 0
      ? session.user.email
      : null;

  if (!email) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true },
  });

  return user?.id ?? null;
}

export async function POST(_request: Request, { params }: RouteContext) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await params;

  try {
    const comment = await prisma.recipeComment.findUnique({
      where: { id: commentId },
      select: { id: true },
    });

    if (!comment) {
      return NextResponse.json(
        { message: "Comment not found" },
        { status: 404 },
      );
    }

    const existingLike = await prisma.commentLike.findUnique({
      where: {
        commentId_userId: {
          commentId,
          userId,
        },
      },
      select: { id: true },
    });

    if (!existingLike) {
      await prisma.commentLike.create({
        data: {
          commentId,
          userId,
        },
      });
    }

    const likesCount = await prisma.commentLike.count({
      where: { commentId },
    });

    return NextResponse.json({
      success: true,
      isLikedByMe: true,
      likesCount,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to like comment" },
      { status: 500 },
    );
  }
}

export async function DELETE(_request: Request, { params }: RouteContext) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { commentId } = await params;

  try {
    await prisma.commentLike.deleteMany({
      where: {
        commentId,
        userId,
      },
    });

    const likesCount = await prisma.commentLike.count({
      where: { commentId },
    });

    return NextResponse.json({
      success: true,
      isLikedByMe: false,
      likesCount,
    });
  } catch {
    return NextResponse.json(
      { message: "Failed to unlike comment" },
      { status: 500 },
    );
  }
}
