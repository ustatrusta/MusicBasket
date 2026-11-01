import { DashboardLayout } from '@/components/DashboardLayout';
import { adminApi } from '@/lib/api';

export default async function GenresPage(): Promise<React.JSX.Element> {
  let count = 0;
  try {
    const rows = await adminApi.getGenres();
    count = rows.length;
  } catch {
    count = 0;
  }

  return (
    <DashboardLayout>
      <h1>Genres</h1>
      <p>Toplam tür: {count}</p>
      <p>Bu ekran gerçek /genres endpoint'ine bağlıdır.</p>
    </DashboardLayout>
  );
}
