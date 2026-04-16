"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import RecipePublishedModal from "@/src/app/components/modals/RecipePublishedModal";
import { buildStoredRecipeCoverDataUrl } from "@/src/lib/compress-image-to-data-url";
import { appendUserRecipe } from "@/src/lib/user-recipes-storage";
import { buildUserRecipeCard } from "@/src/lib/build-user-recipe";

import RecipeCoverUpload from "./RecipeCoverUpload";
import RecipeEditableLists, {
  type RecipeEditableListsRef,
} from "./RecipeEditableLists";
import styles from "./create-recipe.module.css";

type CreateRecipeClientProps = {
  userEmail: string;
};

export default function CreateRecipeClient({ userEmail }: CreateRecipeClientProps) {
  const router = useRouter();
  const listsRef = useRef<RecipeEditableListsRef>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [publishedOpen, setPublishedOpen] = useState(false);

  const coverPreviewUrl = useMemo(() => {
    if (!coverFile) {
      return null;
    }
    return URL.createObjectURL(coverFile);
  }, [coverFile]);

  useEffect(() => {
    if (!coverPreviewUrl) {
      return;
    }
    return () => {
      URL.revokeObjectURL(coverPreviewUrl);
    };
  }, [coverPreviewUrl]);

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
    if (coverFile) {
      try {
        image = await buildStoredRecipeCoverDataUrl(coverFile);
      } catch {
        image = "/add-photo.png";
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

    await appendUserRecipe(recipe);
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
          <RecipeCoverUpload
            previewUrl={coverPreviewUrl}
            onFileSelect={setCoverFile}
          />

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
