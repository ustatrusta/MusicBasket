import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Müzik Sepeti Admin',
  description: 'Phase 1 admin scaffold'
};

export default function RootLayout({ children }: { children: React.ReactNode }): React.JSX.Element {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  );
}
