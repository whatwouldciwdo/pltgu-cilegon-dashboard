import { getAllApplications } from '@/lib/apps';
import DashboardClient from '@/components/DashboardClient';

export const metadata = {
  title: 'Dashboard Internal Unit PLTGU - PLN Indonesia Power',
  description: 'Portal navigasi aplikasi korporat, aplikasi operasional unit, dan IT Area PLTGU',
};

export default function HomePage() {
  const allApps = getAllApplications();

  return <DashboardClient initialApps={allApps} />;
}
