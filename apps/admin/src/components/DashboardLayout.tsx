import Link from 'next/link';
import React, { PropsWithChildren } from 'react';

const links = [
  ['songs', 'Songs'],
  ['genres', 'Genres'],
  ['regions', 'Regions'],
  ['instruments', 'Instruments'],
  ['tuning', 'Tuning'],
  ['submissions', 'Submissions'],
  ['analytics', 'Analytics'],
  ['audit', 'Audit']
] as const;

export function DashboardLayout({ children }: PropsWithChildren): React.JSX.Element {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '240px 1fr', minHeight: '100vh' }}>
      <aside style={{ padding: 16, background: '#121417', color: '#F5F2EC' }}>
        <h2>Müzik Sepeti Admin</h2>
        <nav style={{ display: 'grid', gap: 8 }}>
          {links.map(([href, label]) => (
            <Link key={href} href={`/${href}`} style={{ color: '#D6A45B' }}>
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main style={{ padding: 24 }}>{children}</main>
    </div>
  );
}
