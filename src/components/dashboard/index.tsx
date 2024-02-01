import LeftBoard from './left-board';
import TopBoard from './top-board';

interface DashboardProps {
  navigatorItems: string[];
  navigatorIcons: React.ReactNode[];
  navigatorHref: string[];
  children: React.ReactNode;
}

export default function Dashboard(props: DashboardProps) {
  return (
    <div>
      <TopBoard
        href={props.navigatorHref}
        items={props.navigatorItems}
        icons={props.navigatorIcons}
      />
      <div style={{ display: 'flex', position: 'relative' }}>
        <LeftBoard
          href={props.navigatorHref}
          items={props.navigatorItems}
          icons={props.navigatorIcons}
        />
        <main style={{ width: '100%' }}>{props.children}</main>
      </div>
    </div>
  );
}
