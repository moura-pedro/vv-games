import { Toaster } from 'react-hot-toast';
import GameTracker from './components/GameTracker/GameTracker';
import { ErrorBoundary } from './components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-b from-purple-500 to-indigo-600">
        <GameTracker />
        <Toaster position="top-center" />
      </div>
    </ErrorBoundary>
  );
}

export default App;