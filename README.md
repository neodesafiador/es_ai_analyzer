# ES Analyzer - エントリーシート分析ツール

就活生向けのエントリーシート（ES）を AI が自動分析し、改善提案を行う Web アプリケーションです。

## 機能

### MVP（最小実装）機能

1. **ES入力フォーム**
   - 設問タイプ（ガクチカ、志望動機、自己PR など）
   - 設問内容
   - ES本文（自動文字数カウント）
   - 企業名・業界（任意）

2. **AI による ES 診断**
   - 論理性スコア（0-100）
   - 具体性スコア（0-100）
   - 読みやすさスコア（0-100）
   - 業界一貫性スコア（0-100）
   - 文章構造評価（PREP法、STAR法など）

3. **改善案の生成**
   - 改善ポイントの箇条書き
   - 改善版 ES 全文の自動生成

4. **履歴保存**
   - 過去の ES 分析履歴の一覧表示
   - 各履歴の詳細表示
   - スコア推移の確認

## 技術スタック

### バックエンド
- **Python 3.10+**
- **FastAPI**: 高速な Web フレームワーク
- **SQLAlchemy**: ORM
- **PostgreSQL**: データベース
- **OpenAI API**: GPT を使った ES 分析

### フロントエンド
- **React 18**: UI ライブラリ
- **Vite**: ビルドツール
- **Tailwind CSS**: スタイリング
- **React Router**: ルーティング
- **Axios**: HTTP クライアント

## セットアップ

### 前提条件

- Python 3.10 以上
- Node.js 18 以上
- PostgreSQL 14 以上
- OpenAI API キー

### 1. リポジトリのクローン

```bash
cd es_analyzer
```

### 2. バックエンドのセットアップ

#### 2.1 PostgreSQL データベースの作成

```bash
# PostgreSQL に接続
psql -U postgres

# データベースを作成
CREATE DATABASE es_analyzer;

# ユーザーを作成（必要に応じて）
CREATE USER your_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE es_analyzer TO your_user;
```

#### 2.2 Python 環境のセットアップ

```bash
cd backend

# 仮想環境の作成
python -m venv venv

# 仮想環境の有効化
# macOS/Linux:
source venv/bin/activate
# Windows:
# venv\Scripts\activate

# パッケージのインストール
pip install -r requirements.txt
```

#### 2.3 環境変数の設定

```bash
# .env ファイルを作成
cp .env.example .env

# .env ファイルを編集
# DATABASE_URL=postgresql://user:password@localhost:5432/es_analyzer
# OPENAI_API_KEY=your_openai_api_key_here
```

#### 2.4 バックエンドサーバーの起動

```bash
# backend ディレクトリで実行
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

API ドキュメント: http://localhost:8000/docs

### 3. フロントエンドのセットアップ

```bash
cd frontend

# パッケージのインストール
npm install

# 開発サーバーの起動
npm run dev
```

フロントエンド: http://localhost:5173

## 使い方

### 1. ES を分析する

1. トップページ（http://localhost:5173）にアクセス
2. 設問タイプを選択
3. 設問内容と ES 本文を入力
4. 企業名・業界を入力（任意）
5. 「AI分析を開始」ボタンをクリック
6. 分析結果（スコア、改善ポイント、改善版 ES）が表示されます

### 2. 履歴を確認する

1. ヘッダーの「履歴」をクリック
2. 過去の分析履歴が一覧表示されます
3. 各履歴をクリックすると詳細が表示されます

## プロジェクト構造

```
es_analyzer/
├── backend/                # バックエンド
│   ├── app/
│   │   ├── main.py        # FastAPI アプリ
│   │   ├── models.py      # データベースモデル
│   │   ├── schemas.py     # Pydantic スキーマ
│   │   ├── database.py    # DB 接続設定
│   │   ├── crud.py        # CRUD 操作
│   │   ├── services/
│   │   │   └── es_analyzer.py  # AI 分析サービス
│   │   └── routers/
│   │       └── es.py      # API エンドポイント
│   ├── requirements.txt
│   └── .env
├── frontend/              # フロントエンド
│   ├── src/
│   │   ├── components/   # React コンポーネント
│   │   ├── pages/        # ページコンポーネント
│   │   ├── services/     # API 通信
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## API エンドポイント

### POST /api/es/analyze
ES を分析して結果を返す

**リクエストボディ:**
```json
{
  "question_type": "ガクチカ",
  "question_text": "学生時代に最も力を入れたことは？",
  "content": "ES本文...",
  "word_count": 400,
  "company_name": "株式会社〇〇",
  "industry": "IT・通信"
}
```

### GET /api/es/history
ES 分析履歴の一覧を取得

**クエリパラメータ:**
- `skip`: スキップ数（デフォルト: 0）
- `limit`: 取得件数（デフォルト: 50）

### GET /api/es/{entry_id}
特定の ES エントリと分析結果を取得

## 開発

### バックエンドのテスト

```bash
cd backend
pytest
```

### フロントエンドのビルド

```bash
cd frontend
npm run build
```

## トラブルシューティング

### データベース接続エラー

- PostgreSQL が起動しているか確認
- `.env` ファイルの `DATABASE_URL` が正しいか確認

### OpenAI API エラー

- API キーが正しいか確認
- OpenAI のアカウントに残高があるか確認
- API の利用制限に達していないか確認

