import { PropsWithChildren, useEffect } from 'react';
import { useAuthStore } from '../stores/auth.store';

export function AuthBootstrap({ children }: PropsWithChildren): React.JSX.Element {
  const refresh = useAuthStore((state) => state.refresh);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  return <>{children}</>;
}
