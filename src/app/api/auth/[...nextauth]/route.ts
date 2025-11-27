import NextAuth, { NextAuthOptions, User } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import { compare } from "bcryptjs";
import mysql from "mysql2/promise";
import type { RowDataPacket } from "mysql2";

// Define the shape of the database user row
interface UserRow extends RowDataPacket {
  id: number;
  name: string;
  email: string;
  password?: string;
  role?: string;
}

// Define custom user interface to include role
interface CustomUser extends User {
  role?: string;
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" as const },

  providers: [
    // --- Email + Password ---
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "you@example.com" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password)
          throw new Error("Missing email or password");

        const connection = await mysql.createConnection({
          host: process.env.DB_HOST!,
          user: process.env.DB_USER!,
          password: process.env.DB_PASSWORD!,
          database: process.env.DB_NAME!,
        });

        const [rows] = await connection.execute<UserRow[]>(
          "SELECT id, name, email, password, role FROM users WHERE email = ? LIMIT 1",
          [credentials.email]
        );
        await connection.end();

        const user = rows[0];
        if (!user) throw new Error("No user found");

        const isValid = await compare(credentials.password, user.password as string);
        if (!isValid) throw new Error("Invalid password");

        return {
          id: String(user.id),
          name: user.name,
          email: user.email,
          role: user.role || "student",
        };
      },
    }),

    // --- Google OAuth ---
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
  ],

  callbacks: {
    // --- Store role in JWT ---
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        // Fix: Cast to CustomUser interface instead of 'any'
        token.role = (user as CustomUser).role || "student";
      }
      return token;
    },

    // --- Expose role in session ---
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        // Fix: Cast to CustomUser interface instead of 'any'
        (session.user as CustomUser).role = token.role as string;
      }
      return session;
    },

    // --- Redirect after login ---
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      if (url.startsWith("/")) return `${baseUrl}${url}`;

      try {
        const role = new URL(url).searchParams.get("role");
        if (role === "admin") return `${baseUrl}/dashboard/admin`;
        if (role === "cash_user") return `${baseUrl}/dashboard/cash`;
        return `${baseUrl}/dashboard/student`;
      } catch {
        return `${baseUrl}/dashboard/student`;
      }
    },
  },

  pages: {
    signIn: "/login",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };