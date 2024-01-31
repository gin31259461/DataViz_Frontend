import { env } from '@/env.mjs';
import { type DefaultSession, type NextAuthOptions } from 'next-auth';
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
    signIn: async ({ user, account }) => {
      // TODO: 登入的時候會先呼叫這個 function，如果 return true 代表執行登入動作，現在需要處理 email 重複的狀況。
      // const signedAccount = await prismaWriter.account.findUnique({
      //   select: {
      //     provider: true,
      //     providerAccountId: true,
      //   },
      //   where: {
      //     provider_providerAccountId: {
      //       provider: account?.provider ?? '',
      //       providerAccountId: account?.providerAccountId ?? '',
      //     },
      //   },
      // });

      // const signedMember = await prismaWriter.member.findUnique({
      //   select: {
      //     MID: true,
      //     Account: true,
      //     EMail: true,
      //     Valid: true,
      //     CID: true,
      //   },
      //   where: {
      //     EMail: user.email ?? '',
      //   },
      // });

      // if (signedMember && signedMember.CID == null) {
      //   await prismaWriter.$executeRaw`exec [dbo].[xp_insertMemberClass] ${signedMember.MID}`;
      // }

      // if (signedMember && !signedAccount && account) {
      //   const obj = await prismaWriter.object.create({
      //     data: {
      //       Type: 2,
      //       CName: user.name,
      //       EDes: JSON.stringify(defaultSetting),
      //       Member: {
      //         create: {
      //           Valid: false,
      //           Status: 1,
      //           Image: user.image,
      //         },
      //       },
      //     },
      //     select: {
      //       OID: true,
      //     },
      //   });

      //   await prismaWriter.account.create({
      //     data: {
      //       MID: obj.OID,
      //       ...account,
      //     },
      //   });
      //   return `/signup?provider=${account?.provider}&username=${signedMember.Account}&email=${signedMember.EMail}&MID=${obj.OID}`;
      // } else if (signedMember && signedAccount && !signedMember.Valid) {
      //   return `/signup?provider=${account?.provider}&MID=${signedMember.MID}`;
      // }

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
