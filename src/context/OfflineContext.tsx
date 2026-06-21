import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface OfflineContextType {
  isOnline: boolean;
  isOffline: boolean;
}

const OfflineContext = createContext<OfflineContextType>({
  isOnline: true,
  isOffline: false,
});

export function OfflineProvider({ children }: { children: ReactNode }) {
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return (
    <OfflineContext.Provider value={{ isOnline, isOffline: !isOnline }}>
      {children}
    </OfflineContext.Provider>
  );
}

export function useOffline() {
  return useContext(OfflineContext);
}
