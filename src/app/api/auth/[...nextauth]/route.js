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

        // ✅ `adminId` 사용하여 관리자 정보 가져오기
        const manager = await prisma.manager.findUnique({
          where: { id: credentials.adminId }, // adminId 사용
        });

        if (!manager || !manager.password) return null;

        // ✅ 비밀번호 확인
        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          manager.password
        );

        if (!isPasswordValid) return null;

        // ✅ 최소한 id, name, email 포함
        return {
          id: manager.id,
          name: manager.name ?? manager.id,
          email: manager.email ?? `${manager.id}@example.com`,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 24 * 60 * 60, // 1일
  },
  pages: {
    signIn: "/login", // 커스텀 로그인 페이지
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
