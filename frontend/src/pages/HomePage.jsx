import { useState } from 'react';
import { SparklesIcon, CheckCircleIcon, ChartBarIcon, LightBulbIcon } from '@heroicons/react/24/outline';
import ESForm from '../components/ESForm';
import AnalysisResult from '../components/AnalysisResult';
import { analyzeES } from '../services/api';

function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (formData) => {
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await analyzeES(formData);
      setResult(data);
      // 結果が表示された位置までスクロール
      setTimeout(() => {
        const resultSection = document.getElementById('result-section');
        if (resultSection) {
          resultSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (err) {
      setError(err.response?.data?.detail || 'エラーが発生しました。もう一度お試しください。');
      console.error('Analysis error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* ヒーローセクション */}
      <div className="text-center mb-12 animate-fade-in">
        <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-full mb-6">
          <SparklesIcon className="w-6 h-6 text-blue-600 mr-2" />
          <span className="text-sm font-semibold text-blue-600 pr-3">AI-Powered ES Analysis</span>
        </div>
        <h1 className="text-5xl font-bold mb-4">
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            就活ESを
          </span>
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
            AIが徹底分析
          </span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          エントリーシートをAIが分析し、論理性・具体性・文章構造を評価。
          <br />
          <span className="font-semibold text-blue-600">業界別最適化で</span>改善提案と改善版ESを自動生成します。
        </p>

        {/* 特徴カード */}
        <div className="grid md:grid-cols-4 gap-4 mb-12 max-w-5xl mx-auto">
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex p-3 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl mb-4">
              <ChartBarIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">4項目で評価</h3>
            <p className="text-sm text-gray-600">論理性・具体性・読みやすさ・業界一貫性</p>
          </div>
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.15s' }}>
            <div className="inline-flex p-3 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl mb-4">
              <span className="text-2xl">🎯</span>
            </div>
            <h3 className="font-bold text-gray-800 mb-2">業界別最適化</h3>
            <p className="text-sm text-gray-600">コンサル・IT・商社など6業界対応</p>
          </div>
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <div className="inline-flex p-3 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl mb-4">
              <LightBulbIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">具体的な改善案</h3>
            <p className="text-sm text-gray-600">箇条書きで分かりやすく提示</p>
          </div>
          <div className="card p-6 text-center animate-slide-up" style={{ animationDelay: '0.25s' }}>
            <div className="inline-flex p-3 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl mb-4">
              <CheckCircleIcon className="w-8 h-8 text-white" />
            </div>
            <h3 className="font-bold text-gray-800 mb-2">改善版を自動生成</h3>
            <p className="text-sm text-gray-600">そのまま使える高品質なES</p>
          </div>
        </div>
      </div>

      {/* ESフォーム */}
      <ESForm onSubmit={handleSubmit} isLoading={isLoading} />

      {/* エラーメッセージ */}
      {error && (
        <div className="mt-8 card p-6 border-2 border-red-200 bg-red-50 animate-slide-up">
          <div className="flex items-start space-x-3">
            <svg className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <div>
              <p className="font-semibold text-red-800 mb-1">エラーが発生しました</p>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* 分析結果 */}
      {result && (
        <div id="result-section" className="mt-16">
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-600 mr-2" />
              <span className="text-sm font-semibold text-green-600 pr-3">分析完了</span>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent mb-2">
              AI分析結果
            </h2>
            <p className="text-gray-600">
              あなたのESを詳しく分析しました
            </p>
          </div>
          <AnalysisResult result={result} />
        </div>
      )}
    </div>
  );
}

export default HomePage;
