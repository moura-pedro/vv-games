import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { AlertCircle, RefreshCw } from 'lucide-react';

function ErrorFallback({ error, resetErrorBoundary }: {
  error: Error;
  resetErrorBoundary: () => void;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-red-600 to-red-700 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 max-w-md w-full text-center">
        <AlertCircle className="mx-auto mb-4 text-red-300" size={48} />
        <h2 className="text-xl font-bold text-white mb-2">Something went wrong</h2>
        <p className="text-white/80 mb-6">{error.message}</p>
        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:bg-white/90 transition-colors w-full"
        >
          <RefreshCw size={20} />
          Try again
        </button>
      </div>
    </div>
  );
}

export function ErrorBoundary({ children }: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={ErrorFallback}>
      {children}
    </ReactErrorBoundary>
  );
}