import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";

export const authOptions = {
  session: { strategy: "jwt" },
  providers: [
    CredentialsProvider({
      name: "Admin",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const adminEmail = process.env.ADMIN_EMAIL;
        const adminHash = process.env.ADMIN_PASSWORD_HASH;

        if (!credentials?.email || !credentials?.password) return null;
        if (credentials.email !== adminEmail) return null;

        const ok = await bcrypt.compare(credentials.password, adminHash || "");
        if (!ok) return null;

        // return user object
        return { id: "admin-1", name: "Admin", email: adminEmail, isAdmin: true };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.isAdmin = user.isAdmin;
      return token;
    },
    async session({ session, token }) {
      session.user = session.user || {};
      session.user.isAdmin = !!token.isAdmin;
      return session;
    },
  },
  pages: {
    signIn: "/admin-login",
  },
};

export default NextAuth(authOptions);
