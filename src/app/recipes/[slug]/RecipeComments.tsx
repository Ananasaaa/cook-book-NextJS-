"use client";

import Image from "next/image";
import { useState, type FormEvent } from "react";
import { useSession } from "next-auth/react";
import styles from "./recipe-detail.module.css";

type RecipeComment = {
  id: string;
  body: string;
  createdAt: string;
  userId: string;
  user: {
    id: string;
    email: string;
  };
  likesCount: number;
  isLikedByMe: boolean;
};

type RecipeCommentsProps = {
  slug: string;
  initialComments: RecipeComment[];
};

const MAX_LEN = 4000;

export default function RecipeComments({
  slug,
  initialComments,
}: RecipeCommentsProps) {
  const { data: session, status } = useSession();

  const [comments, setComments] = useState<RecipeComment[]>(initialComments);
  const [text, setText] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [likeLoadingId, setLikeLoadingId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  const trimmed = text.trim();

  const userEmail =
    typeof session?.user?.email === "string" && session.user.email.length > 0
      ? session.user.email
      : null;

  const canSubmit =
    status === "authenticated" &&
    trimmed.length > 0 &&
    trimmed.length <= MAX_LEN &&
    !isSubmitting;

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!canSubmit) {
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage("");

      const response = await fetch(`/api/recipes/${slug}/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          body: trimmed,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to create comment");
      }

      setComments((prev) => [data, ...prev]);
      setText("");
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to create comment",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete(commentId: string) {
    try {
      setErrorMessage("");

      const response = await fetch(
        `/api/recipes/${slug}/comments/${commentId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to delete comment");
      }

      setComments((prev) => prev.filter((comment) => comment.id !== commentId));
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to delete comment",
      );
    }
  }

  async function handleToggleLike(commentId: string, isLikedByMe: boolean) {
    if (status !== "authenticated") {
      setErrorMessage("Only authorized users can like comments.");
      return;
    }

    try {
      setLikeLoadingId(commentId);
      setErrorMessage("");

      const response = await fetch(
        `/api/recipes/${slug}/comments/${commentId}/like`,
        {
          method: isLikedByMe ? "DELETE" : "POST",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.message || "Failed to update like");
      }

      setComments((prev) =>
        prev.map((comment) =>
          comment.id === commentId
            ? {
                ...comment,
                likesCount: data.likesCount,
                isLikedByMe: data.isLikedByMe,
              }
            : comment,
        ),
      );
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "Failed to update like",
      );
    } finally {
      setLikeLoadingId(null);
    }
  }

  return (
    <section
      className={styles.commentsSection}
      aria-labelledby="recipe-comments-heading">
      <h2 id="recipe-comments-heading" className={styles.commentsTitle}>
        Comments
      </h2>

      {status === "unauthenticated" ? (
        <p className={styles.commentHint}>
          Only authorized users can leave comments and like them.
        </p>
      ) : null}

      <form className={styles.commentForm} onSubmit={handleSubmit}>
        <label className={styles.commentLabel} htmlFor="recipe-comment-input">
          Your comment
        </label>

        <textarea
          id="recipe-comment-input"
          className={styles.commentTextarea}
          placeholder="Share your thoughts…"
          rows={4}
          autoComplete="off"
          maxLength={MAX_LEN}
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={status !== "authenticated" || isSubmitting}
        />

        <button
          type="submit"
          className={styles.commentSubmit}
          disabled={!canSubmit}>
          {isSubmitting ? "Posting..." : "Post comment"}
        </button>
      </form>

      {errorMessage ? (
        <p className={styles.commentError}>{errorMessage}</p>
      ) : null}

      {comments.length === 0 ? (
        <p className={styles.commentEmpty}>No comments yet.</p>
      ) : (
        <ul className={styles.commentList}>
          {comments.map((comment) => {
            const canDelete =
              userEmail !== null && comment.user.email === userEmail;

            const isLikeLoading = likeLoadingId === comment.id;

            return (
              <li key={comment.id} className={styles.commentCard}>
                <div className={styles.commentCardTop}>
                  <p className={styles.commentMeta}>
                    <span className={styles.commentAuthor}>
                      {comment.user.email}
                    </span>
                    <span className={styles.commentDate} aria-hidden>
                      {" · "}
                    </span>
                    <time
                      className={styles.commentDate}
                      dateTime={comment.createdAt}>
                      {new Date(comment.createdAt).toLocaleString(undefined, {
                        dateStyle: "medium",
                        timeStyle: "short",
                      })}
                    </time>
                  </p>

                  <div className={styles.commentCardActions}>
                    {canDelete ? (
                      <button
                        type="button"
                        className={styles.commentDelete}
                        aria-label="Delete"
                        onClick={() => handleDelete(comment.id)}>
                        <Image
                          src="/trash.svg"
                          alt=""
                          width={22}
                          height={22}
                          className={styles.commentDeleteIcon}
                        />
                      </button>
                    ) : null}
                    <button
                      type="button"
                      className={`${styles.likeButton} ${
                        comment.isLikedByMe ? styles.likeButtonActive : ""
                      }`}
                      onClick={() =>
                        handleToggleLike(comment.id, comment.isLikedByMe)
                      }
                      disabled={isLikeLoading}
                      aria-pressed={comment.isLikedByMe}>
                      <Image
                        src="/like.png"
                        alt="Like"
                        width={18}
                        height={18}
                        className={styles.likeIcon}
                      />
                      <span>{comment.likesCount}</span>
                    </button>
                  </div>
                </div>

                <p className={styles.commentBody}>{comment.body}</p>
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}
