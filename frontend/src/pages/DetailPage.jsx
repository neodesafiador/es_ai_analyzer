import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ChevronLeftIcon, BuildingOfficeIcon, BriefcaseIcon, CalendarIcon } from '@heroicons/react/24/outline';
import { getESDetail } from '../services/api';
import AnalysisResult from '../components/AnalysisResult';

function DetailPage() {
  const { id } = useParams();
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDetail();
  }, [id]);

  const fetchDetail = async () => {
    try {
      setIsLoading(true);
      const data = await getESDetail(id);
      setResult(data);
    } catch (err) {
      setError('詳細情報の取得に失敗しました');
      console.error('Detail fetch error:', err);
    } finally {
      setIsLoading(false);
    }
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
      <div className="max-w-2xl mx-auto">
        <div className="card p-6 border-2 border-red-200 bg-red-50 mb-6">
          <div className="flex items-center space-x-3">
            <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        </div>
        <Link to="/history" className="btn-secondary inline-flex items-center space-x-2">
          <ChevronLeftIcon className="w-5 h-5" />
          <span>履歴に戻る</span>
        </Link>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="text-center py-20">
        <p className="text-gray-600 mb-6 text-lg">データが見つかりませんでした</p>
        <Link to="/history" className="btn-secondary inline-flex items-center space-x-2">
          <ChevronLeftIcon className="w-5 h-5" />
          <span>履歴に戻る</span>
        </Link>
      </div>
    );
  }

  const { es_entry } = result;
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

  return (
    <div className="max-w-6xl mx-auto">
      {/* 戻るボタン */}
      <div className="mb-8 animate-fade-in">
        <Link
          to="/history"
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-blue-600 font-medium transition-colors group"
        >
          <ChevronLeftIcon className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>履歴に戻る</span>
        </Link>
      </div>

      {/* ES情報カード */}
      <div className="card p-8 mb-8 animate-slide-up">
        <div className="flex items-start justify-between mb-6">
          <div className="flex-1">
            <div className="flex items-center space-x-3 mb-4">
              <span className="badge bg-gradient-to-r from-blue-500 to-indigo-500 text-white text-lg font-semibold px-4 py-2">
                {es_entry.question_type}
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              {es_entry.question_text}
            </h1>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-4">
          {es_entry.company_name && (
            <div className="flex items-center space-x-3 bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl">
              <BuildingOfficeIcon className="w-6 h-6 text-blue-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">企業名</p>
                <p className="text-gray-800 font-semibold">{es_entry.company_name}</p>
              </div>
            </div>
          )}
          {es_entry.industry && (
            <div className="flex items-center space-x-3 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl">
              <BriefcaseIcon className="w-6 h-6 text-purple-600 flex-shrink-0" />
              <div>
                <p className="text-xs text-gray-600 font-medium mb-1">業界</p>
                <p className="text-gray-800 font-semibold">{es_entry.industry}</p>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-3 bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-xl">
            <svg className="w-6 h-6 text-green-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">文字数</p>
              <p className="text-gray-800 font-semibold">{es_entry.word_count}文字</p>
            </div>
          </div>
          <div className="flex items-center space-x-3 bg-gradient-to-r from-amber-50 to-yellow-50 p-4 rounded-xl">
            <CalendarIcon className="w-6 h-6 text-amber-600 flex-shrink-0" />
            <div>
              <p className="text-xs text-gray-600 font-medium mb-1">分析日時</p>
              <p className="text-gray-800 font-semibold">{formatDate(es_entry.created_at)}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 分析結果 */}
      <AnalysisResult result={result} />
    </div>
  );
}

export default DetailPage;
