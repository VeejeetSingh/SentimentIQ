import { useEffect, useState } from 'react';
import { analyzeText, getHealth } from './api';
import AnalyzePanel from './components/AnalyzePanel';
import Header from './components/Header';
import Hero from './components/Hero';
import HistoryPanel from './components/HistoryPanel';
import ModelInfoCard from './components/ModelInfoCard';
import OngoingAnalytics from './components/OngoingAnalytics';
import ResultCard from './components/ResultCard';
import Sidebar from './components/Sidebar';
import StatsCards from './components/StatsCards';
import StatsView from './components/StatsView';
import { Bot, Check, CheckCircle2, ChevronRight, Sparkles, X, Zap } from 'lucide-react';

const MAX_HISTORY = 30;

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [modelReady, setModelReady] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [inputText, setInputText] = useState('');
  const [toastMessage, setToastMessage] = useState(null);

  // Health check on startup and periodically
  useEffect(() => {
    let interval;
    const check = async () => {
      try {
        const h = await getHealth();
        setModelReady(Boolean(h.model_ready));
      } catch {
        setModelReady(false);
      }
    };
    check();
    interval = setInterval(check, 15000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3200);
  };

  const handleResult = (data) => {
    setResult(data);
    setHistory((prev) => [data, ...prev].slice(0, MAX_HISTORY));
    showToast(`Sentiment classified: ${data.sentiment} (${Math.round((data.confidence || 0) * 100)}%)`);
  };

  const handleHistorySelect = (item) => {
    setResult(item);
    setInputText(item.text || '');
    setPage('analyze');
    showToast(`Loaded analysis from history`);
  };

  // Distinct Handler 1: Focus analyzer and scroll smoothly for custom input
  const handleAnalyzeClick = () => {
    const analyzerElem = document.getElementById('analyzer-section');
    if (analyzerElem) {
      analyzerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    const textarea = document.querySelector('textarea');
    if (textarea) {
      textarea.focus();
    }
    showToast(`Ready: Type your custom tweet in the analyzer`);
  };

  // Distinct Handler 2: Instant Demo Prediction (directly executes ML inference & reveals result)
  const handleInstantDemo = async () => {
    const demoSamples = [
      "The new SentimentIQ dashboard is stunning, lightning fast and exceptionally well engineered! 🚀✨",
      "I love the clean orange and white SaaS design. Real-time inference under 50ms is so impressive! 🎯",
      "Just had the most incredible dinner with my family and friends, grateful for these moments ❤️",
      "The quarterly performance update has been scheduled for Wednesday at 10 AM EST.",
      "Can't believe they cancelled our flight with zero notice. Extremely frustrating experience.",
    ];
    const sample = demoSamples[Math.floor(Math.random() * demoSamples.length)];
    setInputText(sample);
    showToast('Executing instant live inference…');

    try {
      const data = await analyzeText(sample);
      const res = {
        ...data,
        text: sample,
        timestamp: new Date().toISOString(),
      };
      setResult(res);
      setHistory((prev) => [res, ...prev].slice(0, MAX_HISTORY));

      const analyzerElem = document.getElementById('analyzer-section');
      if (analyzerElem) {
        analyzerElem.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      showToast(`Instant Demo Analyzed: ${res.sentiment} (${Math.round((res.confidence || 0) * 100)}% Conf)`);
    } catch {
      showToast('Loaded demo sample into analyzer. Click Analyze to run.');
    }
  };

  const renderContent = () => {
    switch (page) {
      case 'dashboard':
        return (
          <div className="space-y-7 animate-fade-in-up">
            {/* 1. Hero Section with Distinct Actions */}
            <Hero
              onAnalyzeClick={handleAnalyzeClick}
              onDemoClick={handleInstantDemo}
            />

            {/* 2. Four Premium Statistics Cards */}
            <StatsCards history={history} />

            {/* 3. Ongoing Intelligence & Live Activity Section (Inspired by User Reference) */}
            <OngoingAnalytics history={history} />

            {/* 4. Main Tweet Sentiment Analyzer & Active Result */}
            <div id="analyzer-section" className="grid grid-cols-1 xl:grid-cols-12 gap-7">
              <div className="xl:col-span-7">
                <AnalyzePanel
                  onResult={handleResult}
                  text={inputText}
                  onTextChange={setInputText}
                />
              </div>

              <div className="xl:col-span-5 flex flex-col">
                {result ? (
                  <ResultCard result={result} />
                ) : (
                  <div className="card-premium p-8 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-[#FFF1E6] border border-[#FCD8BE] flex items-center justify-center mb-4 text-[#F07824] shadow-sm animate-float-gentle">
                      <Sparkles size={30} />
                    </div>
                    <h3 className="text-base font-black text-[#211D19] mb-1">
                      Ready For Sentiment Analysis
                    </h3>
                    <p className="text-xs text-[#817568] max-w-xs font-medium leading-relaxed mb-4">
                      Type or paste a tweet in the analyzer to see instant tri-class probabilities, confidence metrics, and linguistic breakdowns.
                    </p>
                    <div className="flex items-center gap-2 text-[11px] font-bold text-[#15803D] bg-[#EDFAF1] px-3 py-1 rounded-full border border-[#C6F0D2]">
                      <Zap size={12} />
                      <span>TF-IDF + Logistic Reg Active</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 4. Model Architecture & 5-Step Pipeline */}
            <ModelInfoCard />

            {/* 5. Recent Session History Preview */}
            <div className="grid grid-cols-1 gap-7">
              <HistoryPanel
                history={history}
                onClear={() => {
                  setHistory([]);
                  showToast('History cleared');
                }}
                onSelect={handleHistorySelect}
                searchFilter={searchQuery}
              />
            </div>
          </div>
        );

      case 'analyze':
        return (
          <div className="space-y-7 animate-fade-in-up">
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-7">
              <div className="xl:col-span-6">
                <AnalyzePanel
                  onResult={handleResult}
                  text={inputText}
                  onTextChange={setInputText}
                />
              </div>

              <div className="xl:col-span-6 flex flex-col">
                {result ? (
                  <ResultCard result={result} />
                ) : (
                  <div className="card-premium p-10 h-full flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 rounded-3xl bg-[#FFF1E6] border border-[#FCD8BE] flex items-center justify-center mb-4 text-[#F07824] shadow-sm animate-float-gentle">
                      <Sparkles size={30} />
                    </div>
                    <h3 className="text-base font-black text-[#211D19] mb-1">
                      Live Result Display
                    </h3>
                    <p className="text-xs text-[#817568] max-w-xs font-medium leading-relaxed">
                      Your sentiment prediction, probability breakdown bars, and contextual explanation will appear here immediately after analysis.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Model Info Card */}
            <ModelInfoCard />
          </div>
        );

      case 'history':
        return (
          <div className="space-y-7 animate-fade-in-up">
            <HistoryPanel
              history={history}
              onClear={() => {
                setHistory([]);
                showToast('History cleared');
              }}
              onSelect={handleHistorySelect}
              searchFilter={searchQuery}
            />
          </div>
        );

      case 'stats':
        return (
          <div className="space-y-7 animate-fade-in-up">
            <StatsCards history={history} />
            <StatsView
              history={history}
              onNavigateToAnalyze={() => setPage('analyze')}
            />
            <ModelInfoCard />
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-[#FFFCF8] text-[#211D19]">
      {/* Sidebar Navigation */}
      <Sidebar
        active={page}
        onChange={setPage}
        modelReady={modelReady}
        historyCount={history.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <Header
          active={page}
          onChange={setPage}
          modelReady={modelReady}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        <main className="flex-1 px-4 sm:px-6 md:px-8 py-7 max-w-7xl w-full mx-auto">
          {renderContent()}
        </main>

        {/* Global Footer */}
        <footer className="mt-auto border-t border-[#F0E5DA] bg-white py-5 px-6">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-[#817568]">
            <div className="flex items-center gap-2 font-medium">
              <span className="font-extrabold text-[#211D19]">Sentiment<span className="text-[#F07824]">IQ</span></span>
              <span>·</span>
              <span>AI-Powered Tweet Sentiment Intelligence</span>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-semibold">
              <span className="text-[#15803D]">● 81.58% Test Accuracy</span>
              <span>·</span>
              <span>Sentiment140 (1.6M Tweets)</span>
              <span>·</span>
              <span>TF-IDF + Logistic Regression</span>
            </div>
          </div>
        </footer>
      </div>

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-[#211D19] text-white px-4 py-2.5 rounded-2xl shadow-2xl flex items-center gap-2.5 text-xs font-semibold animate-scale-in border border-[#F07824]/40">
          <span className="w-2 h-2 rounded-full bg-[#F07824] pulse-orange" />
          <span>{toastMessage}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="text-white/60 hover:text-white p-0.5 ml-1"
          >
            <X size={13} />
          </button>
        </div>
      )}
    </div>
  );
}
