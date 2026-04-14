import { NextResponse } from "next/server";
import { auth } from "../../../../../auth/auth";
import { prisma } from "../../../../../utils/prisma";

const MAX_LEN = 4000;

type RouteContext = {
  params: Promise<{
    slug: string;
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

export async function GET(_request: Request, { params }: RouteContext) {
  const { slug } = await params;
  const currentUserId = (await getCurrentUserId()) ?? "";

  try {
    const comments = await prisma.recipeComment.findMany({
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

    const serializedComments = comments.map((comment) => ({
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

    return NextResponse.json(serializedComments);
  } catch {
    return NextResponse.json(
      { message: "Failed to load comments" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request, { params }: RouteContext) {
  const userId = await getCurrentUserId();

  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;

  try {
    const body = await request.json();
    const text = typeof body?.body === "string" ? body.body.trim() : "";

    if (!text) {
      return NextResponse.json(
        { message: "Comment text is required" },
        { status: 400 },
      );
    }

    if (text.length > MAX_LEN) {
      return NextResponse.json(
        { message: `Comment is too long. Max length is ${MAX_LEN}` },
        { status: 400 },
      );
    }

    const comment = await prisma.recipeComment.create({
      data: {
        recipeSlug: slug,
        body: text,
        userId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(
      {
        id: comment.id,
        body: comment.body,
        createdAt: comment.createdAt.toISOString(),
        userId: comment.userId,
        user: {
          id: comment.user.id,
          email: comment.user.email,
        },
        likesCount: 0,
        isLikedByMe: false,
      },
      { status: 201 },
    );
  } catch {
    return NextResponse.json(
      { message: "Failed to create comment" },
      { status: 500 },
    );
  }
}
