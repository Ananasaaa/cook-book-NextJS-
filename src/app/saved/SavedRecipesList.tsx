// "use client";

// import { useEffect, useMemo } from "react";
// import Image from "next/image";
// import Link from "next/link";
// import { useRouter } from "next/navigation";
// import { useSession } from "next-auth/react";

// import BookmarkIcon from "../components/recipes/BookmarkIcon";
// import { recipes } from "../../mocks/ingredients";
// import { savedRecipesStorageKeyFromSession } from "../../lib/saved-recipes-storage";
// import { useSavedRecipeSlugs } from "../../hooks/useSavedRecipeSlugs";

// export default function SavedRecipesList() {
//   const router = useRouter();
//   const { data: session, status } = useSession();

//   const storageKey = savedRecipesStorageKeyFromSession(session);

//   const [savedSlugs, setSavedSlugs] = useSavedRecipeSlugs(storageKey);

//   useEffect(() => {
//     if (status === "unauthenticated") {
//       router.replace("/");
//     }
//   }, [status, router]);

//   const savedRecipes = useMemo(() => {
//     const bySlug = new Map(recipes.map((r) => [r.slug, r]));
//     return Array.from(savedSlugs)
//       .map((slug) => bySlug.get(slug))
//       .filter((r): r is NonNullable<typeof r> => r != null)
//       .sort((a, b) => b.popularity - a.popularity);
//   }, [savedSlugs]);

//   const handleSaveToggle = (slug: string) => {
//     if (!storageKey) return;

//     setSavedSlugs((prev) => {
//       const next = new Set(prev);
//       if (next.has(slug)) next.delete(slug);
//       else next.add(slug);
//       return next;
//     });
//   };

//   if (status === "loading") {
//     return (
//       <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
//         <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
//           <div className="h-12 max-w-md animate-pulse rounded-xl bg-brand-gold/25" />
//           <div className="mt-8 h-32 animate-pulse rounded-[24px] bg-brand-gold/20" />
//         </div>
//       </main>
//     );
//   }

//   if (status !== "authenticated" || !storageKey) {
//     return null;
//   }

//   return (
//     <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
//       <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
//         <header className="mb-6">
//           <h1 className="text-[30px] font-semibold leading-tight text-brand-deep xs:text-[38px] md:text-[46px]">
//             Box recipes ({savedRecipes.length})
//           </h1>
//           <p className="mt-2 text-sm text-brand-deep/75 md:text-base">
//             Recipes you saved — open any card to cook or remove from your box.
//           </p>
//         </header>

//         {savedRecipes.length === 0 ? (
//           <div className="rounded-[22px] border border-brand-gold bg-[#fffaf3] p-8 text-center text-brand-deep/70">
//             <p className="text-lg font-medium text-brand-deep">
//               Your box is empty
//             </p>
//             <p className="mt-2 text-sm">
//               Save recipes from the list — they will appear here.
//             </p>
//             <Link
//               href="/recipes"
//               className="mt-6 inline-flex rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-deep transition hover:bg-brand-primary hover:text-brand-cream"
//             >
//               Browse recipes
//             </Link>
//           </div>
//         ) : (
//           <div className="flex flex-col gap-4">
//             {savedRecipes.map((item) => {
//               const saved = savedSlugs.has(item.slug);
//               const excerpt =
//                 item.description.length > 90
//                   ? `${item.description.slice(0, 90)}...`
//                   : item.description;

//               return (
//                 <div
//                   key={item.id}
//                   className="group flex items-start justify-between gap-4 rounded-[24px] border border-brand-gold bg-[#fffaf3] p-4 transition-transform duration-300 hover:-translate-y-1"
//                 >
//                   <Link
//                     href={`/recipes/${item.slug}`}
//                     className="flex min-w-0 flex-1 items-center gap-4"
//                   >
//                     <div className="h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[22px] border border-brand-gold bg-white/30">
//                       <Image
//                         src={item.image}
//                         alt={item.title}
//                         width={88}
//                         height={88}
//                         className="h-full w-full object-cover"
//                       />
//                     </div>

//                     <div className="min-w-0 flex-1">
//                       <h3 className="truncate text-[20px] font-semibold text-brand-deep">
//                         {item.title}
//                       </h3>
//                       <p className="mt-1 truncate text-sm text-brand-deep/75">
//                         {excerpt}
//                       </p>
//                       <div className="mt-2 flex flex-wrap gap-2">
//                         <span className="rounded-full border border-brand-gold bg-white px-3 py-1 text-xs text-brand-deep">
//                           {item.mealTypeLabel}
//                         </span>
//                         <span className="rounded-full border border-brand-gold bg-white px-3 py-1 text-xs text-brand-deep">
//                           {item.cookingTimeLabel}
//                         </span>
//                         <span className="rounded-full border border-brand-gold bg-white px-3 py-1 text-xs text-brand-deep">
//                           {item.difficultyLabel}
//                         </span>
//                       </div>
//                     </div>
//                   </Link>

//                   <button
//                     type="button"
//                     onClick={() => handleSaveToggle(item.slug)}
//                     className={[
//                       "mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border transition-all duration-300",
//                       saved
//                         ? "border-brand-gold bg-brand-gold/20 text-brand-deep"
//                         : "border-brand-gold/70 bg-white/40 text-brand-deep",
//                       "hover:scale-105 hover:bg-white/70",
//                     ].join(" ")}
//                     aria-label="Remove from Box recipes"
//                     title={saved ? "Remove from Box recipes" : "Save"}
//                   >
//                     <BookmarkIcon saved={saved} />
//                   </button>
//                 </div>
//               );
//             })}
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }
"use client";

import { useEffect, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

import BookmarkIcon from "../components/recipes/BookmarkIcon";
import type { RecipeCard } from "@/src/types/recipe";

import {
  isInlineRecipeImageSrc,
  normalizeRecipeImageSrc,
} from "../../lib/recipe-image-display";
import { savedRecipesStorageKeyFromSession } from "../../lib/saved-recipes-storage";
import { useSavedRecipeSlugs } from "../../hooks/useSavedRecipeSlugs";

type SavedRecipesListProps = {
  initialRecipes: RecipeCard[];
};

export default function SavedRecipesList({
  initialRecipes,
}: SavedRecipesListProps) {
  const router = useRouter();
  const { data: session, status } = useSession();

  const storageKey = savedRecipesStorageKeyFromSession(session);
  const [savedSlugs, setSavedSlugs] = useSavedRecipeSlugs(storageKey);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.replace("/");
    }
  }, [status, router]);

  const savedRecipes = useMemo(() => {
    const bySlug = new Map(
      initialRecipes.map((recipe) => [recipe.slug, recipe]),
    );

    return Array.from(savedSlugs)
      .map((slug) => bySlug.get(slug))
      .filter((recipe): recipe is NonNullable<typeof recipe> => recipe != null)
      .sort((a, b) => b.popularity - a.popularity);
  }, [savedSlugs, initialRecipes]);

  const handleSaveToggle = (slug: string) => {
    if (!storageKey) return;

    setSavedSlugs((prev) => {
      const next = new Set(prev);

      if (next.has(slug)) next.delete(slug);
      else next.add(slug);

      return next;
    });
  };

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
        <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
          <div className="h-12 max-w-md animate-pulse rounded-xl bg-brand-gold/25" />
          <div className="mt-8 h-32 animate-pulse rounded-[24px] bg-brand-gold/20" />
        </div>
      </main>
    );
  }

  if (status !== "authenticated" || !storageKey) {
    return null;
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
      <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
        <header className="mb-6">
          <h1 className="text-[30px] font-semibold leading-tight text-brand-deep xs:text-[38px] md:text-[46px]">
            Box recipes ({savedRecipes.length})
          </h1>
          <p className="mt-2 text-sm text-brand-deep/75 md:text-base">
            Recipes you saved — open any card to cook or remove from your box.
          </p>
        </header>

        {savedRecipes.length === 0 ? (
          <div className="rounded-[22px] border border-brand-gold bg-[#fffaf3] p-8 text-center text-brand-deep/70">
            <p className="text-lg font-medium text-brand-deep">
              Your box is empty
            </p>
            <p className="mt-2 text-sm">
              Save recipes from the list — they will appear here.
            </p>
            <Link
              href="/recipes"
              className="mt-6 inline-flex rounded-full bg-brand-gold px-6 py-2.5 text-sm font-semibold text-brand-deep transition hover:bg-brand-primary hover:text-brand-cream">
              Browse recipes
            </Link>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {savedRecipes.map((item) => {
              const saved = savedSlugs.has(item.slug);
              const excerpt =
                item.description.length > 90
                  ? `${item.description.slice(0, 90)}...`
                  : item.description;

              const thumb = normalizeRecipeImageSrc(item.image);
              const thumbIsDataOrBlob = isInlineRecipeImageSrc(thumb);

              return (
                <div
                  key={item.slug}
                  className="group flex items-start justify-between gap-4 rounded-[24px] border border-brand-gold bg-[#fffaf3] p-4 transition-transform duration-300 hover:-translate-y-1">
                  <Link
                    href={`/recipes/${item.slug}`}
                    className="flex min-w-0 flex-1 items-center gap-4">
                    <div className="relative flex h-[88px] w-[88px] min-h-[88px] min-w-[88px] max-h-[88px] max-w-[88px] shrink-0 items-center justify-center overflow-hidden rounded-[22px] border border-brand-gold bg-white/30">
                      {thumbIsDataOrBlob ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={thumb}
                          alt={item.title}
                          width={88}
                          height={88}
                          className="block h-[88px] w-[88px] shrink-0 rounded-[22px] border border-brand-gold bg-white/30 object-cover"
                          onError={(e) => {
                            const el = e.currentTarget;
                            el.onerror = null;
                            el.src = "/add-photo.png";
                          }}
                        />
                      ) : (
                        <div className="relative h-[88px] w-[88px] shrink-0 overflow-hidden rounded-[22px] border border-brand-gold bg-white/30">
                          <Image
                            src={thumb}
                            alt={item.title}
                            width={88}
                            height={88}
                            sizes="88px"
                            className="block h-full w-full object-cover"
                          />
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <h3 className="truncate text-[20px] font-semibold text-brand-deep">
                        {item.title}
                      </h3>

                      <p className="mt-1 truncate text-sm text-brand-deep/75">
                        {excerpt}
                      </p>

                      <div className="mt-2 flex flex-wrap gap-2">
                        <span className="rounded-full border border-brand-gold bg-white px-3 py-1 text-xs text-brand-deep">
                          {item.mealTypeLabel}
                        </span>
                        <span className="rounded-full border border-brand-gold bg-white px-3 py-1 text-xs text-brand-deep">
                          {item.cookingTimeLabel}
                        </span>
                        <span className="rounded-full border border-brand-gold bg-white px-3 py-1 text-xs text-brand-deep">
                          {item.difficultyLabel}
                        </span>
                      </div>
                    </div>
                  </Link>

                  <button
                    type="button"
                    onClick={() => handleSaveToggle(item.slug)}
                    className={[
                      "mt-1 flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-300",
                      saved
                        ? "border-brand-gold bg-brand-gold/20 text-brand-deep"
                        : "border-brand-gold/70 bg-white/40 text-brand-deep",
                      "hover:scale-105 hover:bg-white/70",
                    ].join(" ")}
                    aria-label="Remove saved recipe"
                    title={saved ? "Saved" : "Save"}>
                    <BookmarkIcon saved={saved} />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
