"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";

import RecipePublishedModal from "@/src/app/components/modals/RecipePublishedModal";
import { appendUserRecipe } from "@/src/lib/user-recipes-storage";
import { buildUserRecipeCard } from "@/src/lib/build-user-recipe";

import RecipeCoverUpload from "./RecipeCoverUpload";
import RecipeEditableLists, {
  type RecipeEditableListsRef,
} from "./RecipeEditableLists";
import styles from "./create-recipe.module.css";

async function blobUrlToDataUrl(url: string): Promise<string | null> {
  if (!url.startsWith("blob:")) {
    return url;
  }
  try {
    const res = await fetch(url);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const r = new FileReader();
      r.onload = () => resolve(r.result as string);
      r.onerror = reject;
      r.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

type CreateRecipeClientProps = {
  userEmail: string;
};

export default function CreateRecipeClient({ userEmail }: CreateRecipeClientProps) {
  const router = useRouter();
  const listsRef = useRef<RecipeEditableListsRef>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverPreviewUrl, setCoverPreviewUrl] = useState<string | null>(null);
  const [publishedOpen, setPublishedOpen] = useState(false);

  const handleCoverPreviewChange = useCallback((url: string | null) => {
    setCoverPreviewUrl(url);
  }, []);

  useEffect(() => {
    if (!publishedOpen) {
      return;
    }
    const timer = window.setTimeout(() => {
      setPublishedOpen(false);
      router.push("/recipes");
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [publishedOpen, router]);

  async function handlePublish() {
    let image = "/add-photo.png";
    if (coverPreviewUrl?.startsWith("blob:")) {
      const dataUrl = await blobUrlToDataUrl(coverPreviewUrl);
      if (dataUrl) {
        image = dataUrl;
      }
    }

    const snapshot = listsRef.current?.getSnapshot();
    const recipe = buildUserRecipeCard({
      title,
      description,
      image,
      ingredientLines: snapshot?.ingredientLines ?? [],
      steps: snapshot?.steps ?? [],
    });

    appendUserRecipe(recipe);
    setPublishedOpen(true);
  }

  return (
    <>
      <div className={styles.wrapper}>
        <header className={styles.topbar}>
          <span className={styles.savedText}>Saved</span>

          <div className={styles.actions}>
            <button className={styles.deleteButton} type="button">
              <Image
                src="/trash.svg"
                alt=""
                width={22}
                height={22}
                className={styles.deleteIcon}
              />
              Delete
            </button>

            <button className={styles.secondaryButton} type="button">
              Save and close
            </button>

            <button
              className={styles.primaryButton}
              type="button"
              onClick={() => void handlePublish()}>
              Publish
            </button>
          </div>
        </header>

        <section className={styles.hero}>
          <RecipeCoverUpload onPreviewChange={handleCoverPreviewChange} />

          <div className={styles.heroContent}>
            <input
              className={styles.titleInput}
              placeholder="Title: Pea soup"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <div className={styles.authorRow}>
              <Image
                src="/cook.png"
                alt=""
                width={25}
                height={25}
                className={styles.authorAvatar}
              />
              <div className={styles.authorInfo}>
                <div className={styles.authorEmail}>{userEmail}</div>
              </div>
            </div>

            <textarea
              className={styles.description}
              placeholder="Tell us more about this dish. What or who inspired you to make it? What makes it special to you? Use @ to mention others. Feel free to add hashtags."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </section>

        <RecipeEditableLists ref={listsRef} />
      </div>

      <RecipePublishedModal
        isOpen={publishedOpen}
        onOpenChange={setPublishedOpen}
      />
    </>
  );
}
