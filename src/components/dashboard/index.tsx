import LeftBoard from './left-board';
import TopBoard from './top-board';

interface DashboardProps {
  children: React.ReactNode;
}

export default function Dashboard({ children }: DashboardProps) {
  return (
    <div>
      <TopBoard />
      <div style={{ display: 'flex', position: 'relative' }}>
        <LeftBoard />
        <main style={{ width: '100%' }}>{children}</main>
      </div>
    </div>
  );
}
