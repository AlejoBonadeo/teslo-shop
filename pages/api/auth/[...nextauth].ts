import NextAuth from "next-auth";
import GithubProvider from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { dbUsers } from "../../../database";

export default NextAuth({
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    Credentials({
      name: "Custom login",
      credentials: {
        email: {
          label: "Correo",
          type: "email",
          placeholder: "Correo",
        },
        password: {
          label: "Contraseña",
          type: "password",
          placeholder: "Contraseña",
        },
      },
      async authorize(crednetials) {
        return await dbUsers.checkEmailPassword(
          crednetials!.email,
          crednetials!.password
        );
      },
    }),
  ],
  pages: {
      signIn: '/auth/login',
      newUser: '/auth/register',
  },
  session: {
    maxAge: 2592000,
    strategy: 'jwt',
    updateAge: 86400, 

  },
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token;
        switch (account.type) {
          case "credentials":
            token.user = user;
            break;
          case "oauth":
            token.user = await dbUsers.createOauthUser(
              user?.email || "",
              user?.name || ""
            );
            break;
          default:
            break;
        }
      }
      return token;
    },
    async session({ token, user, session }) {
      session.accessToken = token.accessToken;
      session.user = token.user as any;
      return session;
    },
  },
});
