import { redirect } from "next/navigation";

import { auth } from "@/src/auth/auth";

import CreateRecipeClient from "./CreateRecipeClient";
import styles from "./create-recipe.module.css";

export default async function CreateRecipePage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/recipes");
  }

  const userEmail =
    typeof session.user.email === "string" && session.user.email.length > 0
      ? session.user.email
      : "—";

  return (
    <main className={styles.page}>
      <CreateRecipeClient userEmail={userEmail} />
    </main>
  );
}
