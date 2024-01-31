import { CommandModal } from '@/components/modal/command-modal';
import Navbar from '@/components/navbar';
import { NavbarProvider } from '@/components/navbar/navbar-provider';
import { env } from '@/env.mjs';
import { authOptions } from '@/server/auth/auth';
import '@/styles/global.scss';
import { getServerSession, Session } from 'next-auth';
import { Provider } from '../components/provider';
import { TrpcProvider } from '../components/provider/trpc-provider';
import style from '../styles/rootLayout.module.scss';

export const metadata = {
  title: 'DataViz',
  description: 'Analyze data and generate beautiful infographic',
  icons: {
    icon: '/favicon.ico',
  },
  // 'og:title':
  // 'og:image':
  // 'og:description':
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
  session: Session;
}) {
  const session = await getServerSession(authOptions);

  return (
    <html lang="en" className={style['custom-font']}>
      <body className="scrollbar-container">
        <TrpcProvider httpBatchLink={env.TRPC_CLIENT_HTTP_BATCH_LINK}>
          <Provider session={session}>
            <div>
              <NavbarProvider>
                <Navbar />
                <CommandModal />
                {children}
              </NavbarProvider>
            </div>
          </Provider>
        </TrpcProvider>
      </body>
    </html>
  );
}
