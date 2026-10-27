import {
  AlertCircle,
  CheckCircle2,
  CornerDownLeft,
  Flame,
  Frown,
  Loader2,
  Meh,
  Send,
  Smile,
  Sparkles,
  X,
  Zap,
} from 'lucide-react';
import { useRef, useState } from 'react';
import { analyzeText } from '../api';

const SAMPLE_TWEETS = [
  {
    type: 'Positive',
    text: "I absolutely love the new design! It's so clean, fast, and pleasant to use 🎉",
    emoji: '✨',
  },
  {
    type: 'Positive',
    text: "Just had the most incredible dinner with my family and friends ❤️",
    emoji: '🌟',
  },
  {
    type: 'Neutral',
    text: "The quarterly product update is scheduled for Wednesday at 10 AM EST.",
    emoji: '📅',
  },
  {
    type: 'Neutral',
    text: "The package was dispatched from the sorting center at 2 PM today.",
    emoji: '📦',
  },
  {
    type: 'Negative',
    text: "Can't believe they cancelled my flight again with zero warning. Terrible service.",
    emoji: '💢',
  },
  {
    type: 'Negative',
    text: "The app keeps crashing after the latest update. Extremely frustrating experience.",
    emoji: '📉',
  },
];

const MAX_CHARS = 500;

export default function AnalyzePanel({ onResult, text: parentText, onTextChange }) {
  const [internalText, setInternalText] = useState('');
  const text = parentText !== undefined ? parentText : internalText;
  const setText = onTextChange || setInternalText;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const textareaRef = useRef(null);

  const handleAnalyze = async () => {
    const trimmed = text.trim();
    if (!trimmed) {
      setError('Please enter a tweet or statement to analyze.');
      textareaRef.current?.focus();
      return;
    }

    setLoading(true);
    setError('');

    try {
      const data = await analyzeText(trimmed);
      onResult({
        ...data,
        text: trimmed,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
          'Inference service unavailable. Please check that both server and model are running.'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      handleAnalyze();
    }
  };

  const handleSampleClick = (sampleText) => {
    setText(sampleText);
    setError('');
    textareaRef.current?.focus();
  };

  const remaining = MAX_CHARS - text.length;
  const charPct = (text.length / MAX_CHARS) * 100;

  const filteredSamples =
    categoryFilter === 'All'
      ? SAMPLE_TWEETS
      : SAMPLE_TWEETS.filter((s) => s.type === categoryFilter);

  return (
    <div className="card-premium p-6 md:p-7 animate-fade-in-up">
      {/* Header Row */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-[#F0E5DA]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#F07824] to-[#D96317] flex items-center justify-center text-white shadow-[0_2px_8px_rgba(240,120,36,0.3)]">
            <Sparkles size={18} />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#211D19] leading-tight">
              Tweet Sentiment Analyzer
            </h2>
            <p className="text-xs text-[#817568] font-medium">
              TF-IDF N-Gram Vectorizer · Logistic Regression Classifier
            </p>
          </div>
        </div>

        <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#FAF6F0] border border-[#F0E5DA] text-[11px] font-semibold text-[#817568]">
          <Zap size={13} className="text-[#F07824]" />
          <span>Instant Inference</span>
        </div>
      </div>

      {/* Textarea Input Area */}
      <div className="relative mb-3">
        <textarea
          ref={textareaRef}
          value={text}
          onChange={(e) => {
            setText(e.target.value.slice(0, MAX_CHARS));
            if (error) setError('');
          }}
          onKeyDown={handleKeyDown}
          placeholder="Paste or write a tweet, customer review, or sentiment statement here…"
          rows={5}
          className="w-full resize-none rounded-2xl border border-[#F0E5DA] bg-[#FFFCF8] p-4 text-sm font-medium text-[#211D19] placeholder:text-[#A89F95] focus-orange transition-all leading-relaxed"
        />

        {text && (
          <button
            onClick={() => {
              setText('');
              setError('');
              textareaRef.current?.focus();
            }}
            className="absolute top-3 right-3 p-1.5 rounded-lg text-[#A89F95] hover:text-[#211D19] hover:bg-[#FAF6F0] transition-all"
            title="Clear text"
          >
            <X size={15} />
          </button>
        )}
      </div>

      {/* Progress & Character Count Bar */}
      <div className="flex items-center justify-between mb-4 text-xs font-semibold">
        <div className="flex items-center gap-2">
          <div className="w-20 h-1.5 bg-[#FAF6F0] rounded-full overflow-hidden border border-[#F0E5DA]">
            <div
              className={`h-full transition-all duration-300 ${
                remaining < 50
                  ? 'bg-[#DC2626]'
                  : remaining < 100
                  ? 'bg-[#F07824]'
                  : 'bg-[#15803D]'
              }`}
              style={{ width: `${charPct}%` }}
            />
          </div>
          <span
            className={
              remaining < 50
                ? 'text-[#DC2626]'
                : remaining < 100
                ? 'text-[#F07824]'
                : 'text-[#817568]'
            }
          >
            {text.length} / {MAX_CHARS} characters
          </span>
        </div>

        <div className="hidden sm:flex items-center gap-1 text-[#A89F95] text-[11px]">
          <CornerDownLeft size={12} />
          <span>Press Ctrl+Enter to predict</span>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="flex items-start gap-2.5 bg-[#FEF2F2] border border-[#FECACA] rounded-xl p-3.5 mb-4 text-xs font-medium text-[#DC2626] animate-fade-in-up">
          <AlertCircle size={16} className="text-[#DC2626] mt-0.5 flex-shrink-0" />
          <p className="flex-1 leading-normal">{error}</p>
        </div>
      )}

      {/* Primary Analyze Button */}
      <button
        onClick={handleAnalyze}
        disabled={loading || !text.trim()}
        className="w-full btn-orange-primary py-3.5 px-6 flex items-center justify-center gap-2.5 text-sm cursor-pointer"
      >
        {loading ? (
          <>
            <Loader2 size={18} className="animate-spin text-white" />
            <span>Analyzing Sentiment & Calculating Probabilities…</span>
          </>
        ) : (
          <>
            <Send size={16} />
            <span>Analyze Sentiment</span>
          </>
        )}
      </button>

      {/* Quick Example Tweets Section */}
      <div className="mt-6 pt-5 border-t border-[#F0E5DA]">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Flame size={14} className="text-[#F07824]" />
            <span className="text-xs font-bold text-[#817568] uppercase tracking-wider">
              Quick Test Prompts
            </span>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-1">
            {['All', 'Positive', 'Neutral', 'Negative'].map((cat) => (
              <button
                key={cat}
                onClick={() => setCategoryFilter(cat)}
                className={`text-[10px] font-bold px-2 py-0.5 rounded-md transition-all ${
                  categoryFilter === cat
                    ? 'bg-[#F07824] text-white'
                    : 'text-[#817568] hover:bg-[#FAF6F0]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {filteredSamples.map((sample, idx) => {
            const isPos = sample.type === 'Positive';
            const isNeu = sample.type === 'Neutral';

            return (
              <button
                key={idx}
                onClick={() => handleSampleClick(sample.text)}
                className="group flex items-start gap-2 text-left p-2.5 rounded-xl bg-[#FAF6F0] hover:bg-[#FFF1E6] border border-[#F0E5DA] hover:border-[#FCD8BE] transition-all cursor-pointer"
              >
                <span className="text-sm mt-0.5">{sample.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1 mb-0.5">
                    <span
                      className={`text-[10px] font-bold ${
                        isPos
                          ? 'text-[#15803D]'
                          : isNeu
                          ? 'text-[#78716C]'
                          : 'text-[#DC2626]'
                      }`}
                    >
                      {sample.type}
                    </span>
                    <span className="text-[10px] text-[#A89F95] group-hover:text-[#F07824] transition-colors">
                      Click to load
                    </span>
                  </div>
                  <p className="text-xs text-[#211D19] font-medium line-clamp-1 group-hover:text-[#D96317] transition-colors">
                    {sample.text}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
