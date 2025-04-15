import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "@/lib/prisma";
import bcrypt from "bcrypt";

const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        adminId: { label: "Admin ID", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        if (!credentials?.adminId || !credentials?.password) return null;

        const manager = await prisma.manager.findUnique({
          where: { id: credentials.adminId },
        });

        if (!manager || !manager.password) return null;

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          manager.password
        );

        return isPasswordValid ? { id: manager.id } : null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token?.sub && session.user) {
        session.user.id = token.sub;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60,
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// 👇 이렇게만 export 해주세요
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
