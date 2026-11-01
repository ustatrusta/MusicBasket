import { DashboardLayout } from '@/components/DashboardLayout';
import { adminApi } from '@/lib/api';

export default async function SongsPage(): Promise<React.JSX.Element> {
  let count = 0;
  try {
    const result = await adminApi.getSongs();
    count = result.data.length;
  } catch {
    count = 0;
  }

  return (
    <DashboardLayout>
      <h1>Songs</h1>
      <p>Toplam kayıt: {count}</p>
      <p>Henüz içerik yoksa bu normaldir. Bu ekran gerçek API uç noktasına bağlıdır.</p>
    </DashboardLayout>
  );
}
