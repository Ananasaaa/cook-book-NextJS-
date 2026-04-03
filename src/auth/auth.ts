import NextAuth from "next-auth";
import { ZodError } from "zod";
import Credentials from "next-auth/providers/credentials";
import { signInSchema } from "../schema/zod";
import { getUserFromDb } from "../utils/user";
import bcrypt from "bcryptjs";

export const { handlers, auth, signIn, signOut } = NextAuth({
  session: {
    strategy: "jwt",
    maxAge: 3600,
  },
  secret: process.env.AUTH_SECRET,
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials) => {
        try {
          if (!credentials?.email || !credentials?.password) {
            return null;
          }

          const { email, password } =
            await signInSchema.parseAsync(credentials);

          const user = await getUserFromDb(email);

          if (!user || !user.password) {
            return null;
          }

          const isPasswordValid = await bcrypt.compare(password, user.password);

          if (!isPasswordValid) {
            return null;
          }

          return {
            id: String(user.id),
            email: user.email,
          };
        } catch (error) {
          if (error instanceof ZodError) {
            return null;
          }

          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = String(user.id);
      }
      if (!token.id && token.sub) {
        token.id = token.sub;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        const id = token.id ?? token.sub;
        if (id) {
          session.user.id = String(id);
        }
      }
      return session;
    },
  },
});
