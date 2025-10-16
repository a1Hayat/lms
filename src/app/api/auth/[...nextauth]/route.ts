import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import mysql from "mysql2/promise";

const handler = NextAuth({
  providers: [
    // ✅ Email + Password
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "m@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const connection = await mysql.createConnection({
          host: process.env.DB_HOST!,
          user: process.env.DB_USER!,
          password: process.env.DB_PASSWORD!,
          database: process.env.DB_NAME!,
        });

        const [rows]: any = await connection.execute(
          "SELECT * FROM users WHERE email = ? LIMIT 1",
          [credentials?.email]
        );

        const user = rows[0];
        if (!user) throw new Error("No user found");

        const isValid = await compare(credentials!.password, user.password);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        };
      },
    }),

    // ✅ Google OAuth
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
      }
      return token;
    },

    async session({ session, token }) {
      if (token) {
        session.user.role = token.role;
      }
      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
  },
});

export { handler as GET, handler as POST };
