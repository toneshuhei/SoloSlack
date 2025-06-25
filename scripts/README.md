# SoloSlack 開発スクリプト

Dockerでの開発を効率化するためのスクリプト集です。

## 📋 スクリプト一覧

### 🚀 `dev-start.sh` / `dev-start.bat` - 初期起動
**用途**: 初回起動または開発環境のセットアップ
**実行内容**:
- Docker環境のチェック
- 既存コンテナの停止
- イメージのビルド
- コンテナの起動
- ヘルスチェック

```bash
# Linux/macOS
./scripts/dev-start.sh

# Windows
scripts\dev-start.bat
```

### 🔄 `dev-reload.sh` / `dev-reload.bat` - ソースコード変更の反映
**用途**: ソースコード変更時の反映（ビルドなし）
**実行内容**:
- コンテナの再起動
- ヘルスチェック

```bash
# Linux/macOS
./scripts/dev-reload.sh

# Windows
scripts\dev-reload.bat
```

### 🔨 `dev-rebuild.sh` / `dev-rebuild.bat` - 依存関係更新時のリビルド
**用途**: 依存関係の更新時に完全ビルド
**実行内容**:
- コンテナの停止
- 古いイメージの削除
- イメージの再ビルド（キャッシュなし）
- コンテナの起動
- ヘルスチェック

```bash
# Linux/macOS
./scripts/dev-rebuild.sh

# Windows
scripts\dev-rebuild.bat
```

### 🛑 `dev-stop.sh` / `dev-stop.bat` - 停止
**用途**: 開発環境の停止
**実行内容**:
- コンテナの停止

```bash
# Linux/macOS
./scripts/dev-stop.sh

# Windows
scripts\dev-stop.bat
```

## 🎯 使用シナリオ

### 初回セットアップ
```bash
# Linux/macOS
./scripts/dev-start.sh

# Windows
scripts\dev-start.bat
```

### 日常的な開発フロー
1. **ソースコードを編集**
2. **変更を反映**
   ```bash
   # Linux/macOS
   ./scripts/dev-reload.sh
   
   # Windows
   scripts\dev-reload.bat
   ```
3. **ブラウザでリフレッシュ**

### 依存関係の更新時
1. **requirements.txtを編集**
2. **完全リビルド**
   ```bash
   # Linux/macOS
   ./scripts/dev-rebuild.sh
   
   # Windows
   scripts\dev-rebuild.bat
   ```

### 開発終了時
```bash
# Linux/macOS
./scripts/dev-stop.sh

# Windows
scripts\dev-stop.bat
```

## 🔧 スクリプトの権限設定

### Linux/macOS
初回使用時に実行権限を付与してください：

```bash
chmod +x scripts/*.sh
```

### Windows
権限設定は不要です。ダブルクリックまたはコマンドプロンプトから実行できます。

## 📊 ヘルスチェック

各スクリプトは起動後に自動的にヘルスチェックを実行します：
- エンドポイント: `http://localhost:8000/health`
- 期待されるレスポンス: `{"status": "healthy", "message": "SoloSlack is running"}`

## 🐛 トラブルシューティング

### スクリプトが実行できない（Linux/macOS）
```bash
# 実行権限を確認
ls -la scripts/

# 実行権限を付与
chmod +x scripts/*.sh
```

### スクリプトが実行できない（Windows）
- コマンドプロンプトまたはPowerShellで実行
- 管理者権限が必要な場合があります

### コンテナが起動しない
```bash
# ログを確認
docker-compose logs soloslack

# 手動で起動
docker-compose up -d
```

### ポートが使用中
```bash
# 使用中のポートを確認
# Linux/macOS
lsof -i :8000

# Windows
netstat -ano | findstr :8000

# 別のポートで起動（docker-compose.ymlを編集）
```

## 📝 注意事項

- Linux/macOS用スクリプト（.sh）とWindows用スクリプト（.bat）の両方を提供
- 初回実行時はDockerイメージのビルドに時間がかかります
- データベースファイルは `./database/` ディレクトリに保存されます
- Windows環境ではWSLまたはGit Bashでの実行も可能です

## 🚀 クイックスタート

### Windows環境での使用例
```cmd
# 1. 初期起動
scripts\dev-start.bat

# 2. ソースコードを編集後、変更を反映
scripts\dev-reload.bat

# 3. 開発終了時
scripts\dev-stop.bat
```

### Linux/macOS環境での使用例
```bash
# 1. 初期起動
./scripts/dev-start.sh

# 2. ソースコードを編集後、変更を反映
./scripts/dev-reload.sh

# 3. 開発終了時
./scripts/dev-stop.sh
``` 