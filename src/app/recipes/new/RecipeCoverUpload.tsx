"use client";

import Image from "next/image";

import styles from "./create-recipe.module.css";

type RecipeCoverUploadProps = {
  previewUrl: string | null;
  onFileSelect: (file: File) => void;
};

export default function RecipeCoverUpload({
  previewUrl,
  onFileSelect,
}: RecipeCoverUploadProps) {
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      return;
    }
    onFileSelect(file);
    e.target.value = "";
  }

  return (
    <label
      className={`${styles.photoBox} ${styles.photoBoxClickable}`}
      aria-label={previewUrl ? "Change recipe photo" : "Upload recipe photo"}>
      <input
        type="file"
        accept="image/*"
        className={styles.srOnly}
        onChange={handleChange}
      />

      {previewUrl ? (
        <div className={styles.photoPreview}>
          <Image
            src={previewUrl}
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
