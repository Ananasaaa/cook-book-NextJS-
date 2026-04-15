"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

import styles from "./create-recipe.module.css";

type RecipeCoverUploadProps = {
  onPreviewChange?: (url: string | null) => void;
};

export default function RecipeCoverUpload({
  onPreviewChange,
}: RecipeCoverUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    onPreviewChange?.(preview);
  }, [preview, onPreviewChange]);

  useEffect(() => {
    return () => {
      if (preview?.startsWith("blob:")) {
        URL.revokeObjectURL(preview);
      }
    };
  }, [preview]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    setPreview((prev) => {
      if (prev?.startsWith("blob:")) {
        URL.revokeObjectURL(prev);
      }
      return URL.createObjectURL(file);
    });
    e.target.value = "";
  }

  return (
    <label
      className={`${styles.photoBox} ${styles.photoBoxClickable}`}
      aria-label={preview ? "Change recipe photo" : "Upload recipe photo"}>
      <input
        type="file"
        accept="image/*"
        className={styles.srOnly}
        onChange={handleChange}
      />

      {preview ? (
        <div className={styles.photoPreview}>
          <Image
            src={preview}
            alt="Recipe cover preview"
            fill
            unoptimized
            sizes="396px"
            className={styles.photoPreviewImg}
          />
        </div>
      ) : (
        <div className={styles.photoContent}>
          <Image
            src="/add-photo.png"
            alt=""
            width={52}
            height={52}
            className={styles.addPhotoImage}
          />
          <h3>Upload photo</h3>
          <p>* Please use only your own original photos</p>
        </div>
      )}
    </label>
  );
}
