"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQueryState } from "nuqs";
import { useSession } from "next-auth/react";

import AuthModal from "../components/modals/AuthModal";
import BookmarkIcon from "../components/recipes/BookmarkIcon";

import { recipes, type RecipeCard } from "../../mocks/ingredients";
import {
  isInlineRecipeImageSrc,
  normalizeRecipeImageSrc,
} from "../../lib/recipe-image-display";
import {
  loadUserRecipes,
  USER_RECIPES_CHANGED_EVENT,
} from "../../lib/user-recipes-storage";
import { savedRecipesStorageKeyFromSession } from "../../lib/saved-recipes-storage";
import { useSavedRecipeSlugs } from "../../hooks/useSavedRecipeSlugs";

type AuthMode = "login" | "signup" | null;

const formatSearchTitle = (value: string) => {
  const normalized = value.trim();
  const first = normalized[0]?.toUpperCase() ?? "";
  const rest = normalized.slice(1);
  return `${first}${rest}`;
};

export default function RecipesList() {
  const [search] = useQueryState("search", { defaultValue: "" });
  const { data: session, status } = useSession();

  const [authMode, setAuthMode] = useState<AuthMode>(null);
  const isAuthModalOpen = authMode !== null;

  const storageKey = savedRecipesStorageKeyFromSession(session);

  const [savedSlugs, setSavedSlugs] = useSavedRecipeSlugs(storageKey);

  const [userRecipes, setUserRecipes] = useState<RecipeCard[]>([]);

  useEffect(() => {
    const sync = () => {
      queueMicrotask(() => {
        setUserRecipes(loadUserRecipes());
      });
    };
    sync();
    window.addEventListener(USER_RECIPES_CHANGED_EVENT, sync);
    return () => {
      window.removeEventListener(USER_RECIPES_CHANGED_EVENT, sync);
    };
  }, []);

  const effectiveSavedSlugs =
    status === "authenticated" ? savedSlugs : new Set<string>();

  const allRecipes = useMemo(() => [...userRecipes, ...recipes], [userRecipes]);

  const filteredRecipes = useMemo(() => {
    const normalized = search.trim().toLowerCase();
    const list = !normalized
      ? allRecipes
      : allRecipes.filter((item) =>
          item.title.toLowerCase().includes(normalized),
        );

    return [...list].sort((a, b) => b.popularity - a.popularity);
  }, [search, allRecipes]);

  const handleSaveToggle = (slug: string) => {
    if (status !== "authenticated" || !storageKey) {
      setAuthMode("login");
      return;
    }

    setSavedSlugs((prev) => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const searchValue = search.trim();
  const titleText = searchValue
    ? `${formatSearchTitle(searchValue)} (${filteredRecipes.length})`
    : `All recipes (${allRecipes.length})`;
  const emptyTitle = searchValue ? `No recipes for '${searchValue}'` : null;

  return (
    <>
      <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
        <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
          <header className="mb-6">
            <h1 className="text-[30px] font-semibold leading-tight text-brand-deep xs:text-[38px] md:text-[46px]">
              {titleText}
            </h1>
          </header>

          <section>
            {filteredRecipes.length === 0 ? (
              <div className="rounded-[22px] border border-brand-gold bg-[#fffaf3] p-8 text-center text-brand-deep/70">
                {emptyTitle}
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {filteredRecipes.map((item) => {
                  const saved = effectiveSavedSlugs.has(item.slug);
                  const thumb = normalizeRecipeImageSrc(item.image);
                  const thumbIsDataOrBlob = isInlineRecipeImageSrc(thumb);

                  const excerpt =
                    item.description.length > 90
                      ? `${item.description.slice(0, 90)}...`
                      : item.description;

                  return (
                    <div
                      key={item.slug}
                      className="group flex items-start justify-between gap-4 rounded-[24px] border border-brand-gold bg-[#fffaf3] p-4 transition-transform duration-300 hover:-translate-y-1">
                      <Link
                        href={`/recipes/${item.slug}`}
                        className="flex flex-1 items-center gap-4 min-w-0">
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
                          status === "authenticated"
                            ? "hover:scale-105 hover:bg-white/70"
                            : "hover:bg-white/70",
                        ].join(" ")}
                        aria-label="Save recipe"
                        title={
                          status === "authenticated"
                            ? saved
                              ? "Saved"
                              : "Save"
                            : "Login to save"
                        }>
                        <BookmarkIcon saved={saved} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </section>
        </div>
      </main>

      <AuthModal
        mode={authMode}
        isOpen={isAuthModalOpen}
        onOpenChange={(open) => {
          if (!open) setAuthMode(null);
        }}
        onModeChange={(nextMode) => setAuthMode(nextMode)}
      />
    </>
  );
}
