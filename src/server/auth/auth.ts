import { env } from '@/env.mjs';
import { getServerSession, type DefaultSession, type NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import FacebookProvider from 'next-auth/providers/facebook';
import GitHubProvider from 'next-auth/providers/github';
import GoogleProvider from 'next-auth/providers/google';
import { prismaWriter } from '../db';
import { I3SPrismaAdapter } from './i3s-prisma-adapter';
import WKESSOProvider from './wke-sso-provider';

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: {
      id: string;
      username: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession['user'];
  }

  interface User {
    // ...other properties
    // role: UserRole;
  }
}

export const authOptions: NextAuthOptions = {
  pages: {
    newUser: '/management/profile',
  },
  callbacks: {
    session: async ({ session, user }) => {
      const member = await prismaWriter.member.findUnique({
        select: {
          Account: true,
        },
        where: {
          EMail: user.email,
        },
      });

      return {
        ...session,
        user: {
          ...session.user,
          id: user.id,
          username: member?.Account,
        },
      };
    },
    signIn: async () => {
      return true;
    },
  },
  adapter: I3SPrismaAdapter(prismaWriter),
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
      httpOptions: {
        timeout: 5000,
      },
      allowDangerousEmailAccountLinking: true,
    }),
    GitHubProvider({
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    FacebookProvider({
      clientId: env.FACEBOOK_CLIENT_ID,
      clientSecret: env.FACEBOOK_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    DiscordProvider({
      clientId: env.DISCORD_CLIENT_ID,
      clientSecret: env.DISCORD_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
    WKESSOProvider({
      clientId: env.WKESSO_CLIENT_ID,
      clientSecret: env.WKESSO_CLIENT_SECRET,
      allowDangerousEmailAccountLinking: true,
    }),
  ],
};

export const getServerAuthSession = () => getServerSession(authOptions);
