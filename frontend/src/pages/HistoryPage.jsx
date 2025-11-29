import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ClockIcon, BuildingOfficeIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { getESHistory } from '../services/api';

function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      setIsLoading(true);
      const data = await getESHistory();
      setHistory(data);
    } catch (err) {
      setError('履歴の取得に失敗しました');
      console.error('History fetch error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const getScoreInfo = (score) => {
    if (score >= 80) return { color: 'text-emerald-600', bg: 'bg-emerald-50', gradient: 'from-emerald-500 to-green-500' };
    if (score >= 60) return { color: 'text-amber-600', bg: 'bg-amber-50', gradient: 'from-amber-500 to-yellow-500' };
    return { color: 'text-rose-600', bg: 'bg-rose-50', gradient: 'from-rose-500 to-red-500' };
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col justify-center items-center py-20">
        <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent mb-4"></div>
        <p className="text-gray-600 font-medium">読み込み中...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="card p-6 border-2 border-red-200 bg-red-50">
        <div className="flex items-center space-x-3">
          <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="mb-8">
          <div className="inline-flex p-4 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
            <ClockIcon className="w-16 h-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">まだ履歴がありません</h2>
          <p className="text-gray-600 mb-8">ESを分析すると、ここに履歴が表示されます</p>
        </div>
        <Link to="/" className="btn-primary inline-flex items-center space-x-2">
          <span>最初のESを分析する</span>
          <ChevronRightIcon className="w-5 h-5" />
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-4">
          <ClockIcon className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-sm font-semibold text-blue-600 pr-3">History</span>
        </div>
        <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3">
          分析履歴
        </h1>
        <p className="text-gray-600">過去に分析したESの一覧です（{history.length}件）</p>
      </div>

      <div className="space-y-4">
        {history.map((item, index) => {
          const avgScore = (item.logic_score + item.specificity_score + item.readability_score) / 3;
          const avgScoreInfo = getScoreInfo(avgScore);

          return (
            <Link
              key={item.id}
              to={`/detail/${item.id}`}
              className="card p-6 hover:scale-[1.02] transition-all duration-200 animate-slide-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <span className="badge bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-semibold">
                      {item.question_type}
                    </span>
                    {avgScore >= 80 && (
                      <span className="badge bg-gradient-to-r from-emerald-500 to-green-500 text-white text-xs">
                        優秀
                      </span>
                    )}
                  </div>
                  {(item.company_name || item.industry) && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600 mb-1">
                      <BuildingOfficeIcon className="w-4 h-4" />
                      <span>
                        {item.company_name && <span className="font-medium">{item.company_name}</span>}
                        {item.company_name && item.industry && <span className="mx-1">•</span>}
                        {item.industry && <span>{item.industry}</span>}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center space-x-2 text-xs text-gray-500">
                    <ClockIcon className="w-4 h-4" />
                    <span>{formatDate(item.created_at)}</span>
                  </div>
                </div>
                <ChevronRightIcon className="w-6 h-6 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
              </div>

              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: '論理性', score: item.logic_score },
                  { label: '具体性', score: item.specificity_score },
                  { label: '読みやすさ', score: item.readability_score }
                ].map(({ label, score }) => {
                  const info = getScoreInfo(score);
                  return (
                    <div key={label} className={`${info.bg} rounded-xl p-3 text-center`}>
                      <p className="text-xs text-gray-600 mb-1 font-medium">{label}</p>
                      <p className={`text-2xl font-bold ${info.color}`}>
                        {score.toFixed(0)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}

export default HistoryPage;
