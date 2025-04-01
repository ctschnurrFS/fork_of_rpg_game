import NextAuth, { type DefaultSession } from "next-auth";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import { db } from "@/lib/db/drizzle";
import * as schema from "@/lib/db/schema";
import { eq } from "drizzle-orm";

// Type extension for session that matches your schema exactly
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      role?: "owner" | "admin" | "regular" | null;
      class?:
        | "Fighter"
        | "Rogue"
        | "Barbarian"
        | "Warlock"
        | "Druid"
        | "Paladin"
        | "Sorcerer"
        | null;
    } & DefaultSession["user"];
  }
}

// Custom adapter with proper type handling
const customAdapter = {
  ...DrizzleAdapter(db, {
    usersTable: schema.users as any,
    accountsTable: schema.accounts as any,
    sessionsTable: schema.sessions as any,
    verificationTokensTable: schema.verificationTokens as any,
  }),
};

export const {
  handlers: { GET, POST },
  auth,
  signIn,
  signOut,
} = NextAuth({
  adapter: customAdapter,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        // Add required fields
        session.user.id = user.id;

        // Fetch additional user data with proper null handling
        const dbUser = await db.query.users.findFirst({
          where: eq(schema.users.id, Number(user.id)),
        });

        if (dbUser) {
          session.user.role = dbUser.role ?? undefined;
          session.user.class = dbUser.class ?? undefined;
        }
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
});
