import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { type GetServerSidePropsContext } from "next";
import { getServerSession, type NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { encode, decode } from "next-auth/jwt";
import bcrypt from "bcrypt";

import { env } from "~/env.mjs";
import { db } from "~/server/db";
import { type User } from "@prisma/client";
import { type JWTEncodeParams } from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
interface AuthUser extends Omit<User, "Password"> {
  token: string;
}
const tokenOneDay = 24 * 60 * 60;
const tokenOnWeek = tokenOneDay * 7;

const craeteJWT = (token: any, duration: number) =>
  encode({
    token,
    secret: env.JWT_SECRET,
    maxAge: duration,
    salt: "10",
  } as JWTEncodeParams);

const jwtHelper = {
  createAcessToken: (token: AuthUser) => craeteJWT(token, tokenOneDay),
  createRefreshToken: (token: AuthUser) => craeteJWT(token, tokenOnWeek),
  verifyToken: (token: string) => decode({ token, secret: env.JWT_SECRET }),
};

declare module "next-auth" {
  interface User {
    userId?: string;
    username?: string;
    userRole?: string;
  }

  interface Session {
    user: {
      userId?: string;
      username?: string;
      userRole?: string;
    };
    error?: "RefreshAccessTokenError";
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    user: AuthUser;
    accessToken: string;
    refreshToken: string;
    accessTokenExpired: number;
    refreshTokenExpired: number;
    error?: "RefreshAccessTokenError";
  }
}
/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(db),
  session: {
    strategy: "jwt",
    maxAge: 60 * 60,
  },
  pages: {
    signIn: "/auth/signIn",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, _req) {
        try {
          const user = await db.user.findFirst({
            where: {
              username: credentials?.username,
            },
          });

          if (user && credentials) {
            const validPassword = await bcrypt.compare(
              credentials?.password,
              user.password,
            );

            if (validPassword) {
              return {
                id: user.id,
                username: user.username,
              };
            }
          }
        } catch (error) {
          console.log(error);
        }
        return null;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // credentials provider:  Save the access token and refresh token in the JWT on the initial login
      if (user) {
        const authUser = {
          id: user.id,
          username: user.username,
        } as AuthUser;

        const accessToken = await jwtHelper.createAcessToken(authUser);
        const refreshToken = await jwtHelper.createRefreshToken(authUser);
        const accessTokenExpired = Date.now() / 1000 + tokenOneDay;
        const refreshTokenExpired = Date.now() / 1000 + tokenOnWeek;

        return {
          ...token,
          accessToken,
          refreshToken,
          accessTokenExpired,
          refreshTokenExpired,
          user: authUser,
        };
      } else {
        if (token) {
          // In subsequent requests, check access token has expired, try to refresh it
          if (Date.now() / 1000 > token.accessTokenExpired) {
            const verifyToken = await jwtHelper.verifyToken(token.refreshToken);

            if (verifyToken) {
              const user = await db.user.findFirst({
                where: {
                  username: token.user.username,
                },
              });

              if (user) {
                const accessToken = await jwtHelper.createAcessToken(
                  token.user,
                );
                const accessTokenExpired = Date.now() / 1000 + tokenOneDay;

                return { ...token, accessToken, accessTokenExpired };
              }
            }

            return { ...token, error: "RefreshAccessTokenError" };
          }
        }
      }

      return token;
    },

    session({ session, token }) {
      if (token) {
        session.user = {
          username: token.user.username,
          userId: token.user.id,
          userRole: token.user.role
        };
      }
      session.error = token.error;
      return session;
    },
  },
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return getServerSession(ctx.req, ctx.res, authOptions);
};
