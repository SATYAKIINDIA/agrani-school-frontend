/**
 * LoadingOverlay Component
 * 
 * A full-screen or container overlay with spinner during loading states.
 * Prevents user interaction while loading.
 * 
 * @example
 * ```tsx
 * <LoadingOverlay isLoading={loading} message="Processing..." />
 * ```
 */
interface LoadingOverlayProps {
  isLoading: boolean;
  message?: string;
  fullScreen?: boolean;
}

export default function LoadingOverlay({ isLoading, message, fullScreen = false }: LoadingOverlayProps) {
  if (!isLoading) return null;

  const overlayClass = fullScreen
    ? 'fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm'
    : 'absolute inset-0 z-10 flex items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg';

  return (
    <div className={overlayClass}>
      <div className="flex flex-col items-center">
        <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        {message && <p className="mt-3 text-sm text-gray-600">{message}</p>}
      </div>
    </div>
  );
}
