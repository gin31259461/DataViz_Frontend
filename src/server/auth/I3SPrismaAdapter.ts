import type { Prisma, PrismaClient } from '@prisma/client';
import type { Adapter, AdapterAccount } from 'next-auth/adapters';

const selectUserOpts = {
  MID: true,
  EMail: true,
  emailVerified: true,
  Image: true,
  Object: {
    select: {
      CName: true,
    },
  },
};

export function I3SPrismaAdapter(p: PrismaClient): Adapter {
  return {
    async createUser(data) {
      const username = data.email.split('@')[0];
      const user = await p.member.findUnique({
        select: {
          Account: true,
        },
        where: {
          Account: username,
        },
      });
      const obj = await p.object.create({
        data: {
          Type: 2, // Type = 2 represents Member in I3S
          CName: data.name,
          Member: {
            create: {
              Account: user?.Account ? data.email : username,
              Valid: true,
              Status: 1,
              EMail: data.email,
              emailVerified: data.emailVerified,
              Image: data.image,
            },
          },
        },
        select: {
          OID: true,
        },
      });

      return {
        ...data,
        id: obj.OID.toString(),
      };
    },

    async getUser(id) {
      const user = await p.member.findUnique({
        where: { MID: parseInt(id) },
        select: selectUserOpts,
      });
      return (
        user && {
          id: user.MID.toString(),
          email: user.EMail,
          emailVerified: user.emailVerified,
          name: user.Object.CName,
          image: user.Image,
        }
      );
    },

    async getUserByEmail(email) {
      const user = await p.member.findUnique({
        where: { EMail: email },
        select: selectUserOpts,
      });

      // email is necessary here
      return (
        user && {
          id: user.MID.toString(),
          email: user.EMail,
          emailVerified: user.emailVerified,
          name: user.Object.CName,
          image: user.Image,
        }
      );
    },

    async getUserByAccount(provider_providerAccountId) {
      const account = await p.account.findUnique({
        where: { provider_providerAccountId },
        select: {
          Member: {
            select: selectUserOpts,
          },
        },
      });

      const user = account?.Member || null; // if no member, return null
      return (
        user && {
          id: user.MID.toString(),
          email: user.EMail,
          emailVerified: user.emailVerified,
          name: user.Object.CName,
          image: user.Image,
        }
      );
    },

    async updateUser({ id, ...data }) {
      const _id = id ? parseInt(id) : undefined;
      const obj = await p.object.update({
        where: { OID: _id },
        data: {
          CName: data.name,
          Member: {
            update: {
              EMail: data.email,
              emailVerified: data.emailVerified,
              Image: data.image,
            },
          },
        },
        select: {
          CName: true,
          Member: {
            select: {
              MID: true,
              EMail: true,
              emailVerified: true,
              Image: true,
            },
          },
        },
      });

      const user = obj.Member!;

      return {
        id: user.MID.toString(),
        email: user.EMail,
        emailVerified: user.emailVerified,
        name: obj.CName,
        image: user.Image,
      };
    },

    async deleteUser(id) {
      await p.object.delete({
        where: { OID: parseInt(id) },
      });
    },

    async linkAccount({ userId, ...data }) {
      return (await p.account.create({
        data: {
          MID: parseInt(userId),
          ...data,
        },
      })) as unknown as AdapterAccount;
    },

    unlinkAccount: (provider_providerAccountId) =>
      p.account.delete({
        where: { provider_providerAccountId },
      }) as unknown as AdapterAccount,

    async getSessionAndUser(sessionToken) {
      const userAndSession = await p.mSession.findUnique({
        where: {
          PassportCode: sessionToken,
        },
        select: {
          PassportCode: true,
          ExpiredDT: true,
          Member: {
            select: selectUserOpts,
          },
        },
      });
      if (!userAndSession) return null;
      const { Member, ...session } = userAndSession;
      return new Promise((resolve, reject) => {
        resolve({
          user: {
            id: Member.MID.toString(),
            image: Member.Image,
            name: Member.Object.CName,
            email: Member.EMail,
            emailVerified: Member.emailVerified,
          },
          session: {
            userId: Member.MID.toString(),
            sessionToken: session.PassportCode,
            expires: session.ExpiredDT,
          },
        });
      });
    },

    async createSession(data) {
      // const IpData = await getClientIp();
      const session = await p.mSession.create({
        data: {
          MID: parseInt(data.userId),
          PassportCode: data.sessionToken,
          // IP: IpData?.ip ?? '::1',
          IP: '::1',
          ExpiredDT: data.expires,
        },
      });
      return {
        userId: session.MID.toString(),
        sessionToken: session.PassportCode,
        expires: session.ExpiredDT,
      };
    },

    async updateSession(data) {
      const session = await p.mSession.update({
        where: {
          PassportCode: data.sessionToken,
        },
        data: {
          PassportCode: data.sessionToken,
        },
      });
      return {
        userId: session.MID.toString(),
        sessionToken: session.PassportCode,
        expires: session.ExpiredDT,
      };
    },

    async deleteSession(sessionToken) {
      const session = await p.mSession.update({
        where: {
          PassportCode: sessionToken,
        },
        data: {
          ExpiredDT: new Date(),
        },
      });
      return {
        userId: session.MID.toString(),
        sessionToken: sessionToken,
        expires: session.ExpiredDT,
      };
    },

    async createVerificationToken(data) {
      const verificationToken = await p.verificationToken.create({ data });
      // @ts-expect-errors // MongoDB needs an ID, but we don't
      if (verificationToken.id) delete verificationToken.id;
      return verificationToken;
    },

    async useVerificationToken(identifier_token) {
      try {
        const verificationToken = await p.verificationToken.delete({
          where: { identifier_token },
        });
        // @ts-expect-errors // MongoDB needs an ID, but we don't
        if (verificationToken.id) delete verificationToken.id;
        return verificationToken;
      } catch (error) {
        // If token already used/deleted, just return null
        // https://www.prisma.io/docs/reference/api-reference/error-reference#p2025
        if ((error as Prisma.PrismaClientKnownRequestError).code === 'P2025') return null;
        throw error;
      }
    },
  };
}
