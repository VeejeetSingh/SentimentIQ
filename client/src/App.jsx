import { useEffect, useState } from 'react';
import { getHealth } from './api';
import AnalyzePanel from './components/AnalyzePanel';
import Header from './components/Header';
import HistoryPanel from './components/HistoryPanel';
import ResultCard from './components/ResultCard';
import Sidebar from './components/Sidebar';
import StatsView from './components/StatsView';

const MAX_HISTORY = 20;

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [modelReady, setModelReady] = useState(false);

  useEffect(() => {
    let interval;
    const check = async () => {
      try {
        const h = await getHealth();
        setModelReady(h.model_ready);
      } catch {
        setModelReady(false);
      }
    };
    check();
    interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleResult = (data) => {
    setResult(data);
    setHistory((prev) => [data, ...prev].slice(0, MAX_HISTORY));
    // On mobile auto-switch to result after analyze
    if (page === 'analyze') return; // already there, result shows below
  };

  const handleHistorySelect = (item) => {
    setResult(item);
    setPage('analyze');
  };

  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            {/* Page title */}
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Welcome to SentimentIQ — AI-powered tweet sentiment analysis
              </p>
            </div>

            {/* Quick analyze inline */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AnalyzePanel onResult={(d) => { handleResult(d); setPage('analyze'); }} />
              <HistoryPanel
                history={history}
                onClear={() => setHistory([])}
                onSelect={handleHistorySelect}
              />
            </div>
          </div>
        );

      case 'analyze':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Analyze</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Enter any tweet or text to get an instant sentiment prediction
              </p>
            </div>
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
              <AnalyzePanel onResult={handleResult} />
              {result ? (
                <ResultCard result={result} />
              ) : (
                <div className="card p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-4">
                    <span className="text-3xl">🤖</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-700">Ready to analyze</p>
                  <p className="text-xs text-slate-400 mt-1">
                    Your results will appear here after analysis
                  </p>
                </div>
              )}
            </div>
          </div>
        );

      case 'history':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">History</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Your recent sentiment analyses this session
              </p>
            </div>
            <HistoryPanel
              history={history}
              onClear={() => setHistory([])}
              onSelect={handleHistorySelect}
            />
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-6">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Statistics</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Session analytics and model performance overview
              </p>
            </div>
            <StatsView history={history} />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={page} onChange={setPage} modelReady={modelReady} />
      <div className="flex-1 flex flex-col min-w-0">
        <Header active={page} onChange={setPage} />
        <main className="flex-1 px-4 md:px-8 py-6 max-w-6xl w-full mx-auto">
          {renderContent()}
        </main>
        <footer className="text-center py-4 text-xs text-slate-300 border-t border-slate-100">
          SentimentIQ · TF-IDF + Logistic Regression · 1.6M tweet training set · 81.58% accuracy
        </footer>
      </div>
    </div>
  );
}
