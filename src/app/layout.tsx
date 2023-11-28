import { CommandModal } from '@/components/Modal/CommandModal';
import Navbar from '@/components/Navbar';
import { env } from '@/env.mjs';
import { authOptions } from '@/server/auth/auth';
import '@/styles/global.scss';
import { getServerSession, Session } from 'next-auth';
import { Provider } from '../components/Provider';
import { TrpcProvider } from '../components/Provider/TrpcProvider';
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
              <Navbar />
              <CommandModal />
              {children}
            </div>
          </Provider>
        </TrpcProvider>
      </body>
    </html>
  );
}
