import { useState } from 'react';
import { PencilSquareIcon, BuildingOfficeIcon, BriefcaseIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

function ESForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    question_type: 'ガクチカ',
    question_text: '',
    content: '',
    word_count: 0,
    company_name: '',
    industry: '',
  });

  // 業界の選択肢とその説明
  const industries = [
    {
      value: 'コンサルティング',
      label: 'コンサル',
      description: '論理性・フレームワーク重視',
      icon: '📊',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      value: 'IT・エンジニア',
      label: 'IT/エンジニア',
      description: '技術力・課題解決重視',
      icon: '💻',
      color: 'from-green-500 to-emerald-500'
    },
    {
      value: '商社',
      label: '商社',
      description: '行動力・コミュ力重視',
      icon: '🌏',
      color: 'from-orange-500 to-red-500'
    },
    {
      value: 'メガベンチャー',
      label: 'メガベンチャー',
      description: '主体性・成長意欲重視',
      icon: '🚀',
      color: 'from-purple-500 to-pink-500'
    },
    {
      value: '金融',
      label: '金融',
      description: '正確性・誠実性重視',
      icon: '💰',
      color: 'from-yellow-500 to-amber-500'
    },
    {
      value: 'メーカー',
      label: 'メーカー',
      description: 'ものづくり・改善重視',
      icon: '🏭',
      color: 'from-indigo-500 to-blue-500'
    },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;

    // contentが変更された場合、文字数も更新
    if (name === 'content') {
      setFormData(prev => ({
        ...prev,
        [name]: value,
        word_count: value.length
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // バリデーション
    if (!formData.question_text.trim() || !formData.content.trim()) {
      alert('設問内容とES本文は必須です');
      return;
    }

    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 card p-8 animate-slide-up">
      {/* 設問タイプ */}
      <div className="animate-fade-in">
        <label htmlFor="question_type" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <PencilSquareIcon className="w-5 h-5 mr-2 text-blue-600" />
          設問タイプ
        </label>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {['ガクチカ', '志望動機', '自己PR', 'その他'].map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, question_type: type }))}
              className={`py-3 px-4 rounded-xl font-medium transition-all duration-200 ${
                formData.question_type === type
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg transform scale-105'
                  : 'bg-gray-50 text-gray-700 hover:bg-gray-100 hover:shadow-md'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* 設問内容 */}
      <div className="animate-fade-in" style={{ animationDelay: '0.1s' }}>
        <label htmlFor="question_text" className="block text-sm font-semibold text-gray-700 mb-3">
          設問内容 <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          id="question_text"
          name="question_text"
          value={formData.question_text}
          onChange={handleChange}
          placeholder="例：学生時代に最も力を入れて取り組んだことを教えてください"
          className="input-field"
          required
        />
      </div>

      {/* ES本文 */}
      <div className="animate-fade-in" style={{ animationDelay: '0.2s' }}>
        <div className="flex justify-between items-center mb-3">
          <label htmlFor="content" className="block text-sm font-semibold text-gray-700">
            ES本文 <span className="text-red-500">*</span>
          </label>
          <span className={`text-sm font-medium px-3 py-1 rounded-full ${
            formData.word_count === 0
              ? 'bg-gray-100 text-gray-500'
              : formData.word_count < 200
              ? 'bg-yellow-100 text-yellow-700'
              : 'bg-green-100 text-green-700'
          }`}>
            {formData.word_count}文字
          </span>
        </div>
        <textarea
          id="content"
          name="content"
          value={formData.content}
          onChange={handleChange}
          rows="12"
          placeholder="ESの内容を入力してください..."
          className="input-field resize-none"
          required
        />
        <p className="text-xs text-gray-500 mt-2">
          より詳しく具体的に書くと、AIがより的確な分析を行えます
        </p>
      </div>

      {/* 業界選択 */}
      <div className="animate-fade-in" style={{ animationDelay: '0.3s' }}>
        <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <BriefcaseIcon className="w-5 h-5 mr-2 text-purple-600" />
          志望業界（任意・選択すると業界別に最適化）
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-4">
          {industries.map((ind) => (
            <button
              key={ind.value}
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, industry: prev.industry === ind.value ? '' : ind.value }))}
              className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                formData.industry === ind.value
                  ? `bg-gradient-to-r ${ind.color} text-white border-transparent shadow-lg transform scale-105`
                  : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-md'
              }`}
            >
              <div className="flex items-center space-x-2 mb-1">
                <span className="text-2xl">{ind.icon}</span>
                <span className="font-bold text-sm">{ind.label}</span>
              </div>
              <p className={`text-xs ${formData.industry === ind.value ? 'text-white/90' : 'text-gray-600'}`}>
                {ind.description}
              </p>
            </button>
          ))}
        </div>
        {formData.industry && (
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-xl border border-blue-200 animate-slide-up">
            <div className="flex items-start space-x-2">
              <InformationCircleIcon className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-gray-700">
                <p className="font-semibold text-blue-900 mb-1">
                  {formData.industry}業界向けに最適化されます
                </p>
                <p className="text-gray-600">
                  {industries.find(i => i.value === formData.industry)?.description}の観点で分析・改善提案を行います
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* 企業名 */}
      <div className="animate-fade-in" style={{ animationDelay: '0.35s' }}>
        <label htmlFor="company_name" className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
          <BuildingOfficeIcon className="w-5 h-5 mr-2 text-indigo-600" />
          企業名（任意）
        </label>
        <input
          type="text"
          id="company_name"
          name="company_name"
          value={formData.company_name}
          onChange={handleChange}
          placeholder="例：株式会社〇〇"
          className="input-field"
        />
      </div>

      {/* 送信ボタン */}
      <button
        type="submit"
        disabled={isLoading}
        className={`w-full py-4 px-6 rounded-xl text-white font-semibold text-lg shadow-lg transform transition-all duration-200 animate-fade-in ${
          isLoading
            ? 'bg-gray-400 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 hover:shadow-xl hover:-translate-y-0.5'
        }`}
        style={{ animationDelay: '0.4s' }}
      >
        {isLoading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            分析中...
          </span>
        ) : (
          'AI分析を開始'
        )}
      </button>
    </form>
  );
}

export default ESForm;
