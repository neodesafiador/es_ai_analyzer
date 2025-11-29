import { BrowserRouter as Router, Routes, Route, Link, useLocation } from 'react-router-dom';
import { SparklesIcon, ClockIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import HomePage from './pages/HomePage';
import HistoryPage from './pages/HistoryPage';
import DetailPage from './pages/DetailPage';

function Navigation() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className="flex space-x-2">
      <Link
        to="/"
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
          isActive('/')
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-white/50 hover:shadow-md'
        }`}
      >
        <SparklesIcon className="w-5 h-5" />
        <span>分析する</span>
      </Link>
      <Link
        to="/history"
        className={`flex items-center space-x-2 px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
          isActive('/history')
            ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-lg'
            : 'text-gray-700 hover:bg-white/50 hover:shadow-md'
        }`}
      >
        <ClockIcon className="w-5 h-5" />
        <span>履歴</span>
      </Link>
    </nav>
  );
}

function App() {
  return (
    <Router>
      <div className="min-h-screen">
        {/* ヘッダー */}
        <header className="bg-white/70 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-gray-200/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex justify-between items-center">
              <Link to="/" className="flex items-center space-x-3 group">
                <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-2 rounded-xl shadow-lg group-hover:shadow-xl transform group-hover:scale-105 transition-all duration-200">
                  <DocumentTextIcon className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    ES Analyzer
                  </h1>
                  <p className="text-xs text-gray-500">AI-Powered Essay Analysis</p>
                </div>
              </Link>
              <Navigation />
            </div>
          </div>
        </header>

        {/* メインコンテンツ */}
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-fade-in">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/history" element={<HistoryPage />} />
            <Route path="/detail/:id" element={<DetailPage />} />
          </Routes>
        </main>

        {/* フッター */}
        <footer className="bg-white/50 backdrop-blur-sm border-t border-gray-200/50 mt-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="text-center">
              <p className="text-gray-600 text-sm mb-2">
                就活生のためのES分析ツール
              </p>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
