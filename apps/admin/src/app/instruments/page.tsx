import { DashboardLayout } from '@/components/DashboardLayout';
import { adminApi } from '@/lib/api';

export default async function InstrumentsPage(): Promise<React.JSX.Element> {
  let count = 0;
  try {
    const rows = await adminApi.getInstruments();
    count = rows.length;
  } catch {
    count = 0;
  }

  return (
    <DashboardLayout>
      <h1>Instruments</h1>
      <p>Toplam enstrüman: {count}</p>
      <p>Bu ekran gerçek /instruments endpoint'ine bağlıdır.</p>
    </DashboardLayout>
  );
}
