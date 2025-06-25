# SoloSlack

一人用のSlack風チャットアプリケーション

## 概要

SoloSlackは、個人開発者や一人で作業するユーザー向けに設計されたチャットツールです。Slackのような使いやすいインターフェースを提供しながら、メモ、アイデア、タスク管理を統合した個人用ワークスペースとして機能します。

## 特徴

- 📝 **メッセージ機能**: テキストメッセージの送信・表示
- 🏷️ **タグ機能**: 投稿にタグを付けて分類
- 🔍 **フィルタ機能**: タグによる絞り込み表示
- 💾 **ローカル保存**: SQLiteデータベースで永続化
- 🚀 **高速動作**: 軽量な設計で高速レスポンス
- 🔒 **プライバシー**: 完全ローカル実行、データは自分のPCに保存

## 技術スタック

- **バックエンド**: Python (FastAPI)
- **フロントエンド**: HTML/CSS/JavaScript (Vanilla JS)
- **データベース**: SQLite
- **コンテナ化**: Docker

## セットアップ

### 前提条件

- Python 3.8以上
- Docker (オプション)

### 方法1: ローカル環境での実行

1. リポジトリのクローン
```bash
git clone <repository-url>
cd SoloSlack
```

2. 依存関係のインストール
```bash
pip install -r requirements.txt
```

3. アプリケーションの起動
```bash
python -m uvicorn app.main:app --reload
```

4. ブラウザでアクセス
```
http://localhost:8000
```

### 方法2: Dockerでの実行

1. Docker Composeで起動
```bash
docker-compose up -d
```

2. ブラウザでアクセス
```
http://localhost:8000
```

## 使用方法

### 基本的な使い方

1. **投稿の作成**
   - 名前、タグ、内容を入力
   - 「投稿する」ボタンをクリック

2. **投稿の閲覧**
   - 最新の投稿が上から表示
   - スクロールで過去の投稿を確認

3. **フィルタリング**
   - タグボタンをクリックして絞り込み
   - 「全表示」で全ての投稿を表示

### タグの活用例

- **work**: 仕事関連のメモ
- **idea**: アイデアや発想
- **study**: 学習記録
- **memo**: その他のメモ

## プロジェクト構造

```
SoloSlack/
├── app/
│   ├── main.py              # FastAPIアプリケーション
│   │   ├── models/
│   │   │   └── post.py          # データベースモデル
│   │   ├── api/
│   │   │   └── posts.py         # APIエンドポイント
│   │   ├── database/
│   │   │   ├── database.py      # データベース接続
│   │   │   └── init_db.py       # データベース初期化
│   │   ├── static/
│   │   │   ├── css/
│   │   │   │   └── style.css    # スタイルシート
│   │   │   └── js/
│   │   │       └── app.js       # フロントエンドJavaScript
│   │   └── templates/
│   │       └── index.html       # メインHTMLテンプレート
│   ├── database/
│   │   └── soloslack.db         # SQLiteデータベースファイル
│   ├── requirements.txt         # Python依存関係
│   ├── Dockerfile              # Docker設定
│   ├── docker-compose.yml      # Docker Compose設定
│   ├── requirements.md         # 要件定義
│   ├── basic_design.md         # 基本設計書
│   └── README.md               # プロジェクト概要
├── requirements.txt         # Python依存関係
├── Dockerfile              # Docker設定
├── docker-compose.yml      # Docker Compose設定
├── requirements.md         # 要件定義
├── basic_design.md         # 基本設計書
└── README.md               # プロジェクト概要
```

## API仕様

### エンドポイント

| メソッド | エンドポイント | 説明 |
|---------|---------------|------|
| GET | `/` | メインページ表示 |
| GET | `/api/posts` | 投稿一覧取得 |
| POST | `/api/posts` | 新規投稿作成 |
| GET | `/api/posts?tag={tag}` | タグによる投稿フィルタ |
| GET | `/health` | ヘルスチェック |

### リクエスト例

```bash
# 投稿一覧取得
curl http://localhost:8000/api/posts

# タグによるフィルタ
curl http://localhost:8000/api/posts?tag=work

# 新規投稿作成
curl -X POST http://localhost:8000/api/posts \
  -H "Content-Type: application/json" \
  -d '{"name":"開発者A","content":"テスト投稿","tag":"work"}'
```

## 開発

### 開発環境のセットアップ

1. 依存関係のインストール
```bash
pip install -r requirements.txt
```

2. 開発サーバーの起動
```bash
python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### データベースの初期化

```bash
python -c "from app.database.init_db import init_db; init_db()"
```

## ライセンス

MIT License

## 作者

SoloSlack開発チーム 