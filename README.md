# 龍竹一生 システム統合リポジトリ

龍竹一生が運営する全事業のシステムコードを管理するリポジトリです。

## 構成

- `group/` - グループ企業のシステム
  - `it-solution/` - ITソリューション部
  - `life-art/` - ライフアート株式会社
  - `lifetime-support/` - 将来拡張用
  - `nk-service/` - 将来拡張用
- `private/` - プライベートプロジェクト
- `docs/` - ドキュメント
- `.limitless/` - Limitless AI ログと思想抽出システム
- `scripts/philosophy-updater/` - 経営思想自動抽出スクリプト

## セットアップ

詳細は `CLAUDE.md` を参照してください。

## Google Drive連携

データと資料は以下のGoogle Driveで管理：
https://drive.google.com/drive/folders/0ALObQKP4ll2vUk9PVA

## ハイブリッド運用

このリポジトリは「GitHub + Google Drive ハイブリッド型」で運用します：

- **GitHub（このリポジトリ）**: システムコード、設定ファイル、CLAUDE.md
- **Google Drive**: スプレッドシート、PDF資料、画像アセット

MCPを使用してGoogle Driveにアクセスします。

## 💭 経営思想の自動抽出

Limitless AI で記録した日常の会話から、経営理念・事業方針を自動抽出してCLAUDE.mdに反映します。

### 使用方法

1. **ログファイルの配置**
   ```bash
   # Limitless AIのログを配置
   cp ~/Downloads/limitless-export-*.txt .limitless/raw-logs/
   ```

2. **思想の抽出（手動）**
   ```bash
   cd scripts/philosophy-updater
   pip install -r requirements.txt
   cp .env.example .env
   # .envにGemini APIキーを設定（推奨・コスパ優秀）
   # または Claude APIキー（高品質）
   python extract_philosophy.py
   ```

3. **自動監視（推奨）**
   ```bash
   python auto_watch.py
   ```

詳細は `.limitless/README.md` と `scripts/philosophy-updater/README.md` を参照してください。
