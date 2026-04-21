import { NextResponse } from "next/server";

import { auth } from "@/src/auth/auth";
import { prisma } from "@/src/utils/prisma";

type CreateRecipePayload = {
  title?: string;
  description?: string;
  image?: string;
  ingredientLines?: Array<{
    kind: "ingredient" | "chapter";
    value: string;
  }>;
  steps?: Array<{
    value: string;
  }>;
  mealTypeKey?: string;
  difficultyKey?: string;
};

function slugify(title: string): string {
  const s = title
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  return s.length > 0 ? s : "recipe";
}

function linesToIngredients(
  lines: Array<{ kind: "ingredient" | "chapter"; value: string }> = [],
) {
  const out: Array<{ name: string; amount: string; sortOrder: number }> = [];

  for (const line of lines) {
    const v = line.value.trim();

    if (!v) {
      continue;
    }

    if (line.kind === "chapter") {
      out.push({
        name: v,
        amount: "—",
        sortOrder: out.length,
      });
      continue;
    }

    const tabIdx = v.indexOf("\t");

    if (tabIdx !== -1) {
      out.push({
        name: v.slice(0, tabIdx).trim(),
        amount: v.slice(tabIdx + 1).trim(),
        sortOrder: out.length,
      });
      continue;
    }

    const dash = v.match(/^(.+?)\s*[–—-]\s*(.+)$/);

    if (dash) {
      out.push({
        name: dash[1].trim(),
        amount: dash[2].trim(),
        sortOrder: out.length,
      });
      continue;
    }

    out.push({
      name: v,
      amount: "qs",
      sortOrder: out.length,
    });
  }

  if (out.length === 0) {
    out.push({
      name: "Ingredients as listed",
      amount: "—",
      sortOrder: 0,
    });
  }

  return out;
}

function stepsToInstructions(steps: Array<{ value: string }> = []) {
  const blocks = steps.map((step) => step.value.trim()).filter(Boolean);

  return blocks.length > 0 ? blocks.join("\n\n") : "Add your cooking steps.";
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const currentUser = await prisma.user.findUnique({
      where: {
        email: session.user.email,
      },
      select: {
        id: true,
      },
    });

    if (!currentUser) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const body = (await request.json()) as CreateRecipePayload;

    const title = body.title?.trim() || "Untitled recipe";
    const description =
      body.description?.trim() || "A recipe you added from Recipe & Kitchen.";
    const image = body.image?.trim() || "/add-photo.png";
    const mealType = body.mealTypeKey?.trim() || "snack";
    const difficulty = body.difficultyKey?.trim() || "easy";

    const slug = `${slugify(title)}-${Date.now()}`;
    const instructions = stepsToInstructions(body.steps ?? []);
    const ingredients = linesToIngredients(body.ingredientLines ?? []);

    const recipe = await prisma.recipe.create({
      data: {
        title,
        slug,
        description,
        image,
        mealType,
        cookingTime: "15to30",
        difficulty,
        diets: [],
        popularity: 60,
        instructions,
        authorId: currentUser.id,
        ingredients: {
          create: ingredients,
        },
      },
      select: {
        slug: true,
      },
    });

    return NextResponse.json(
      {
        slug: recipe.slug,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create recipe", error);

    return NextResponse.json(
      {
        message: "Failed to create recipe",
      },
      { status: 500 },
    );
  }
}
