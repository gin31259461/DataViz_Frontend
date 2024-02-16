import Dashboard from '@/components/dashboard';
import AccountBoxRoundedIcon from '@mui/icons-material/AccountBoxRounded';
import DatasetRoundedIcon from '@mui/icons-material/DatasetRounded';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import ShowChartRoundedIcon from '@mui/icons-material/ShowChartRounded';
import { ReactNode } from 'react';

const items = ['資料', '專案', '個人', '帳戶', '設定'];
const icons = [
  <DatasetRoundedIcon key={0} />,
  <ShowChartRoundedIcon key={1} />,
  <AccountBoxRoundedIcon key={2} />,
  <ManageAccountsRoundedIcon key={3} />,
  <SettingsRoundedIcon key={4} />,
];
const href = [
  '/management/data',
  '/management/project',
  '/management/profile',
  '/management/account',
  '/management/settings',
];

interface ManagementDashBoardProps {
  children: ReactNode;
}

export default function ManagementDashBoard(props: ManagementDashBoardProps) {
  return (
    <Dashboard navigatorHref={href} navigatorIcons={icons} navigatorItems={items}>
      {props.children}
    </Dashboard>
  );
}
