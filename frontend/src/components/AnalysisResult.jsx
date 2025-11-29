import {
  ChartBarIcon,
  LightBulbIcon,
  DocumentTextIcon,
  SparklesIcon,
  ClipboardDocumentCheckIcon
} from '@heroicons/react/24/outline';
import { CheckCircleIcon } from '@heroicons/react/24/solid';

function AnalysisResult({ result }) {
  const { es_entry, analysis } = result;

  // 業界のアイコンマッピング
  const industryIcons = {
    'コンサルティング': '📊',
    'IT・エンジニア': '💻',
    '商社': '🌏',
    'メガベンチャー': '🚀',
    '金融': '💰',
    'メーカー': '🏭',
  };

  // スコアの色とラベルを決定
  const getScoreInfo = (score) => {
    if (score >= 80) return { color: 'emerald', label: '優秀', gradient: 'from-emerald-500 to-green-500' };
    if (score >= 60) return { color: 'amber', label: '良好', gradient: 'from-amber-500 to-yellow-500' };
    return { color: 'rose', label: '要改善', gradient: 'from-rose-500 to-red-500' };
  };

  const ScoreCard = ({ label, score, icon: Icon, delay }) => {
    const info = getScoreInfo(score);
    return (
      <div
        className="card p-6 animate-scale-in hover:scale-105 transition-transform duration-300"
        style={{ animationDelay: `${delay}s` }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className={`p-3 rounded-xl bg-gradient-to-br ${info.gradient} shadow-lg`}>
              <Icon className="w-6 h-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">{label}</p>
              <span className={`text-xs font-semibold px-2 py-1 rounded-full bg-${info.color}-100 text-${info.color}-700`}>
                {info.label}
              </span>
            </div>
          </div>
          <div className={`text-4xl font-bold bg-gradient-to-br ${info.gradient} bg-clip-text text-transparent`}>
            {score.toFixed(0)}
          </div>
        </div>
        <div className="relative h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${info.gradient} rounded-full transition-all duration-1000 ease-out`}
            style={{ width: `${score}%`, animationDelay: `${delay + 0.2}s` }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* 業界バッジ */}
      {es_entry.industry && (
        <div className="card p-6 animate-fade-in">
          <div className="flex items-center space-x-3">
            <span className="text-3xl">{industryIcons[es_entry.industry] || '🎯'}</span>
            <div>
              <p className="text-sm text-gray-600 font-medium mb-1">業界別最適化</p>
              <p className="text-xl font-bold text-gray-800">{es_entry.industry}</p>
            </div>
            <div className="ml-auto">
              <span className="badge bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-2 font-semibold">
                最適化済み
              </span>
            </div>
          </div>
        </div>
      )}

      {/* スコア一覧 */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <ScoreCard label="論理性" score={analysis.logic_score} icon={ChartBarIcon} delay={0} />
        <ScoreCard label="具体性" score={analysis.specificity_score} icon={LightBulbIcon} delay={0.1} />
        <ScoreCard label="読みやすさ" score={analysis.readability_score} icon={DocumentTextIcon} delay={0.2} />
        {analysis.consistency_score && (
          <ScoreCard label="業界一貫性" score={analysis.consistency_score} icon={ClipboardDocumentCheckIcon} delay={0.3} />
        )}
      </div>

      {/* 文章構造評価 */}
      <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.4s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-500 shadow-lg">
            <ChartBarIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">文章構造評価</h2>
        </div>
        <div className="flex items-center space-x-3 mb-4">
          <span className="badge bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 text-base font-semibold shadow-md">
            {analysis.structure_type}
          </span>
        </div>
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-xl">
          {analysis.structure_evaluation}
        </p>
      </div>

      {/* 改善ポイント */}
      {analysis.improvement_points && analysis.improvement_points.length > 0 && (
        <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.5s' }}>
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 shadow-lg">
              <LightBulbIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">改善ポイント</h2>
          </div>
          <div className="space-y-4">
            {analysis.improvement_points.map((point, index) => (
              <div
                key={index}
                className="flex items-start space-x-4 bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl hover:shadow-md transition-shadow duration-200"
              >
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center font-bold shadow-md">
                    {index + 1}
                  </div>
                </div>
                <p className="text-gray-700 leading-relaxed flex-1">{point}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 元のES */}
      <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.6s' }}>
        <div className="flex items-center space-x-3 mb-6">
          <div className="p-3 rounded-xl bg-gradient-to-br from-gray-500 to-gray-600 shadow-lg">
            <DocumentTextIcon className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800">元のES</h2>
        </div>
        <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{es_entry.content}</p>
        </div>
      </div>

      {/* 改善版ES */}
      <div className="card p-8 animate-slide-up" style={{ animationDelay: '0.7s' }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 rounded-xl bg-gradient-to-br from-green-500 to-emerald-500 shadow-lg">
              <SparklesIcon className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800">AI改善版ES</h2>
          </div>
          <button
            onClick={() => {
              navigator.clipboard.writeText(analysis.improved_content);
              const btn = event.target;
              const originalText = btn.textContent;
              btn.textContent = 'コピーしました！';
              btn.classList.add('bg-green-600');
              setTimeout(() => {
                btn.textContent = originalText;
                btn.classList.remove('bg-green-600');
              }, 2000);
            }}
            className="btn-secondary flex items-center space-x-2"
          >
            <ClipboardDocumentCheckIcon className="w-5 h-5" />
            <span>コピー</span>
          </button>
        </div>
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-6 rounded-xl border-2 border-green-200 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-green-200/30 to-emerald-200/30 rounded-full blur-3xl" />
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed relative z-10">
            {analysis.improved_content}
          </p>
        </div>
        <div className="mt-4 flex items-center space-x-2 text-sm text-gray-600">
          <CheckCircleIcon className="w-5 h-5 text-green-600" />
          <span>AIが論理性・具体性・読みやすさを改善しました</span>
        </div>
      </div>
    </div>
  );
}

export default AnalysisResult;
