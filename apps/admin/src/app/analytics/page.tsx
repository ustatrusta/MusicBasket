import { DashboardLayout } from '@/components/DashboardLayout';
import { adminApi } from '@/lib/api';

export default async function AnalyticsPage(): Promise<React.JSX.Element> {
  let count = 0;
  try {
    const rows = await adminApi.getTrending();
    count = rows.length;
  } catch {
    count = 0;
  }

  return (
    <DashboardLayout>
      <h1>Analytics</h1>
      <p>Trend kayıt sayısı: {count}</p>
      <p>Bu ekran gerçek /trending/songs endpoint'ine bağlıdır.</p>
    </DashboardLayout>
  );
}
