import { object, string } from "zod";

export const signInSchema = object({
  email: string({
    error: (issue) =>
      issue.input === undefined ? "Email is required" : "Invalid email",
  })
    .min(1, { error: "Email is required" })
    .email({ error: "Invalid email" }),

  password: string({
    error: (issue) =>
      issue.input === undefined ? "Password is required" : "Invalid password",
  })
    .min(1, { error: "Password is required" })
    .min(6, { error: "Password must be at least 6 characters" })
    .max(32, { error: "Password must be less than 32 characters" }),
});
