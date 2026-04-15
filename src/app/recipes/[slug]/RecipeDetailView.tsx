"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { ComponentProps } from "react";

import { getUserRecipeBySlug } from "@/src/lib/user-recipes-storage";
import type { RecipeCard } from "@/src/mocks/ingredients";

import RecipeComments from "./RecipeComments";

import styles from "./recipe-detail.module.css";

type RecipeDetailViewProps = {
  slug: string;
  initialRecipe: RecipeCard | null;
  initialComments: ComponentProps<typeof RecipeComments>["initialComments"];
};

export default function RecipeDetailView({
  slug,
  initialRecipe,
  initialComments,
}: RecipeDetailViewProps) {
  const router = useRouter();
  const [recipe, setRecipe] = useState<RecipeCard | null>(initialRecipe);
  const [ready, setReady] = useState(!!initialRecipe);

  useEffect(() => {
    if (initialRecipe) {
      return;
    }
    const fromStorage = getUserRecipeBySlug(slug);
    setRecipe(fromStorage ?? null);
    setReady(true);
  }, [slug, initialRecipe]);

  useEffect(() => {
    if (!ready) {
      return;
    }
    if (recipe === null) {
      router.replace("/not-found");
    }
  }, [ready, recipe, router]);

  if (!ready) {
    return (
      <div className={styles.shell}>
        <div className={styles.inner} />
      </div>
    );
  }

  if (!recipe) {
    return null;
  }

  const instructionBlocks = recipe.instructions
    .split(/\n\n+/)
    .map((p) => p.trim())
    .filter(Boolean);

  const metaParts = [
    recipe.mealTypeLabel,
    recipe.cookingTimeLabel,
    recipe.difficultyLabel,
    ...recipe.dietLabels,
  ];

  const imageUnoptimized =
    recipe.image.startsWith("data:") || recipe.image.startsWith("blob:");

  return (
    <div className={styles.shell}>
      <div className={styles.inner}>
        <nav className={styles.nav}>
          <Link href="/recipes" className={styles.backLink}>
            <span aria-hidden className={styles.arrow}>
              ←
            </span>
            <span>All recipes</span>
          </Link>
        </nav>

        <article>
          <div className={styles.topRow}>
            <div className={styles.colFigure}>
              <figure className={styles.figure}>
                <Image
                  src={recipe.image}
                  alt={recipe.title}
                  fill
                  priority
                  sizes="540px"
                  unoptimized={imageUnoptimized}
                  className={styles.imageCover}
                />
              </figure>
            </div>

            <div className={styles.colAside}>
              <header className={styles.headerBlock}>
                <p className={styles.category}>{recipe.categoryLabel}</p>
                <h1 className={styles.title}>{recipe.title}</h1>
              </header>

              <section className={styles.ingredientsSection}>
                <h2 className={styles.sectionTitle}>Ingredients</h2>
                <ul className={styles.ingredientList}>
                  {recipe.ingredients.map((ing, index) => (
                    <li
                      key={`${ing.name}-${index}`}
                      className={styles.ingredientRow}>
                      <span className={styles.ingredientName}>{ing.name}</span>
                      <span className={styles.ingredientAmount}>
                        {ing.amount}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          <div className={styles.divider} />

          <div className={styles.intro}>
            <p className={styles.description}>{recipe.description}</p>
            <p className={styles.meta}>{metaParts.join(" · ")}</p>
          </div>

          <section className={styles.methodSection}>
            <h2 className={styles.methodTitle}>How to cook</h2>
            <ol className={styles.stepList}>
              {instructionBlocks.map((block, index) => (
                <li key={index}>
                  <div className={styles.stepItem}>
                    <span className={styles.stepBadge} aria-hidden>
                      {index + 1}
                    </span>
                    <p className={styles.stepText}>{block}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        </article>

        <RecipeComments slug={slug} initialComments={initialComments} />
      </div>
    </div>
  );
}
