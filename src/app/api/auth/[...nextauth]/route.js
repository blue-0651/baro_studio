import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

/** @type {import('next-auth').NextAuthOptions} */
export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        adminId: { label: "Admin ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        try {
          if (!credentials?.adminId || !credentials?.password) {
            return null;
          }
          const manager = await prisma.manager.findUnique({
            where: { id: credentials.adminId },
          });
          if (!manager || !manager.password) {
            return null;
          }
          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            manager.password
          );
          if (!isPasswordValid) {
            return null;
          }
          // Return only the necessary identifier
          return { id: manager.id };
        } catch (error) {
          // Log the error on the server for debugging if needed
          // console.error("Authorize error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    /**
     * @param {object} params
     * @param {import("next-auth/jwt").JWT} params.token
     * @param {import("next-auth").User} params.user
     * @returns {Promise<import("next-auth/jwt").JWT>}
     */
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    /**
     * @param {object} params
     * @param {import("next-auth").Session} params.session
     * @param {import("next-auth/jwt").JWT} params.token
     * @returns {Promise<import("next-auth").Session>}
     */
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1 day
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  // debug: process.env.NODE_ENV === 'development', // Uncomment for development debugging
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
