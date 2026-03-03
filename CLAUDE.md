# 龍竹一生 システム統合リポジトリ

このリポジトリは、龍竹一生が運営する全事業のシステムコードを一元管理するためのものです。

---

## 🏗️ ハイブリッド運用ルール

本プロジェクトは「**GitHub + Google Drive ハイブリッド型**」で運用します。

### 役割分担

| 管理場所 | 管理対象 | アクセス方法 |
|---------|---------|-------------|
| **GitHub（このリポジトリ）** | システムの脳・設計図：<br>- コード（HTML/CSS/JS/Python/GAS等）<br>- 設定ファイル（package.json, requirements.txt等）<br>- CLAUDE.md（各プロジェクトのルールブック）<br>- n8nワークフローJSON<br>- ドキュメント（README.md等） | `git clone`でローカルにクローン<br>GitHub Desktopで変更管理 |
| **Google Drive（共有ドライブ）** | データ・資料：<br>- Googleスプレッドシート（.gsheet）<br>- PDF資料・チラシ<br>- 画像アセット（PNG/JPG等）<br>- クライアント納品物<br>- 過去データ・アーカイブ | MCP（Model Context Protocol）経由でアクセス<br>Google Workspace MCPサーバー使用 |

### Google Drive 共有ドライブ情報

- **共有ドライブ名:** ryouchiku-workspace
- **URL:** https://drive.google.com/drive/folders/0ALObQKP4ll2vUk9PVA
- **フォルダID:** `0ALObQKP4ll2vUk9PVA`
- **アカウント:** ryouchiku@life-time-support.com

### MCPでのアクセス方法

```javascript
// Claude Code（MCP対応）からのアクセス例
mcp__google__drive_files_list({ parent_id: "0ALObQKP4ll2vUk9PVA" })
mcp__google__sheets_values_get({ spreadsheet_id: "1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw", range: "シート1!A1:Z100" })
```

---

## 📁 プロジェクト構成

```
ryouchiku-systems/（このリポジトリ）
├── CLAUDE.md（このファイル）
├── README.md（プロジェクト概要）
├── .gitignore（認証情報、node_modules等を除外）
├── docs/（共通ドキュメント）
│   ├── setup-guide.md（環境構築ガイド）
│   ├── migration-log.md（移行履歴）
│   └── mcp-usage.md（MCP使用方法）
│
├── group/（グループ企業システム）
│   ├── it-solution/（ITソリューション部）
│   │   ├── sales-automation/（営業自動化システム）
│   │   ├── homepage-it/（Webサイト）
│   │   ├── lts-internal/（LTS自社プロジェクト）
│   │   ├── nk-service/（NKサービス）
│   │   └── clients/（クライアント別プロジェクト）
│   │
│   ├── life-art/（ライフアート株式会社）
│   ├── lifetime-support/（将来拡張用）
│   └── nk-service/（将来拡張用）
│
└── private/（プライベートプロジェクト）
    └── hp-test/（Next.js ECサイト）
```

---

## 🔐 セキュリティルール

### 認証情報の管理

**絶対にGitにコミットしてはいけないファイル：**
- `credentials.json`（Google API認証情報）
- `.env`、`.env.local`（環境変数）
- `**/client_secret_*.json`（OAuth認証情報）
- `**/*-key-*.json`（サービスアカウントキー）

**管理方法：**
1. `.gitignore`に必ず記載する
2. `.env.example`としてサンプルファイルを用意する
3. 実際の認証情報は以下のいずれかで管理：
   - ローカルの`.env`ファイル（Git管理外）
   - GitHub Secrets（GitHub Actions用）
   - 環境変数として設定

---

## 🚀 開発環境セットアップ

### 1. このリポジトリのクローン

```bash
# GitHub Desktopを使う場合
# File > Clone Repository > URL > [GitHubのリポジトリURL]

# コマンドラインの場合
git clone [GitHubのリポジトリURL]
cd ryouchiku-systems
```

### 2. 各プロジェクトのセットアップ

#### Python系プロジェクト（例：life-art/sales-auto）

```bash
cd group/life-art/sales-auto/scraper
python -m venv venv
source venv/bin/activate  # Windowsの場合: venv\Scripts\activate
pip install -r requirements.txt

# .envファイルを作成（.env.exampleを参考に）
cp .env.example .env
# エディタで.envを開いて実際の認証情報を記入
```

#### Node.js系プロジェクト（例：private/hp-test）

```bash
cd private/hp-test
npm install

# .env.localを作成
cp .env.local.example .env.local
# エディタで.env.localを開いて実際のAPIキーを記入
```

### 3. Google Drive（MCP）へのアクセス確認

Claude Codeで以下を実行：

```javascript
mcp__google__drive_files_list({ parent_id: "0ALObQKP4ll2vUk9PVA" })
```

---

## 📝 Git運用ルール

### ブランチ戦略

- `main`：本番環境（常に動作する状態を保つ）
- `develop`：開発環境（機能開発の統合ブランチ）
- `feature/[機能名]`：機能開発用ブランチ

### コミットルール

**コミットメッセージフォーマット：**
```
[種類] 変更内容の要約

詳細な説明（必要に応じて）
```

**種類の例：**
- `[add]` 新機能追加
- `[fix]` バグ修正
- `[update]` 既存機能の更新
- `[refactor]` リファクタリング
- `[docs]` ドキュメント更新
- `[config]` 設定変更

**例：**
```
[add] sales-automation: AI判定機能を追加

Claude APIを使った顧客の推奨サービス自動判定機能を実装。
スプレッドシートのO列とP列に結果を出力。
```

### コミット前のチェックリスト

- [ ] 認証情報が含まれていないか確認
- [ ] `.gitignore`が正しく設定されているか
- [ ] コードが動作するか確認（テスト実行）
- [ ] CLAUDE.mdの更新が必要なら更新済みか

---

## 🔄 Google Driveとの連携パターン

### パターン1: スプレッドシートの読み取り

```javascript
// 営業CRMデータの取得
const data = await mcp__google__sheets_values_get({
  spreadsheet_id: "1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw",
  range: "シート1!A2:Z100"
});
```

### パターン2: スプレッドシートへの書き込み

```javascript
// AI判定結果の書き込み
await mcp__google__sheets_values_update({
  spreadsheet_id: "1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw",
  range: "シート1!O2:P2",
  values: [
    ["生成AI活用セミナー", "役職が経営者のため、従業員向けセミナーが最適"]
  ]
});
```

### パターン3: ファイルの検索とダウンロード

```javascript
// チラシPDFの検索
const files = await mcp__google__drive_files_search({
  name: "生成AI活用セミナーチラシ.pdf",
  parent_id: "0ALObQKP4ll2vUk9PVA"
});

// ファイルのダウンロード
const content = await mcp__google__drive_file_download({
  file_id: files[0].id
});
```

---

## 📚 各プロジェクトのドキュメント

各プロジェクトフォルダには必ず以下のファイルを配置：

1. **CLAUDE.md** - そのプロジェクト専用のルールブック
2. **README.md** - プロジェクト概要、セットアップ手順
3. **.env.example** - 環境変数のサンプル（認証情報以外）

---

## 🎯 重要な原則

1. **コードはGitHub、データはGoogle Drive**
   - システムの動作に必要なコードは全てGitHubで管理
   - スプレッドシート、PDF、画像などのデータはGoogle Driveに保管
   - MCPを使ってシームレスに連携

2. **認証情報は絶対にコミットしない**
   - .gitignoreで徹底的に除外
   - 環境変数または秘密管理ツールで管理

3. **各プロジェクトは独立して動作可能に**
   - 依存関係は明確に記載（requirements.txt、package.json）
   - READMEに必ずセットアップ手順を記載

4. **CLAUDE.mdは常に最新に保つ**
   - システムの仕様変更時は必ずCLAUDE.mdを更新
   - 「AIがこのファイルを読めば全て理解できる」状態を維持

---

## 🛠️ トラブルシューティング

### Google Drive（MCP）にアクセスできない

1. Claude Codeでgoogle-mcp-serverが有効か確認
2. アカウント認証が完了しているか確認
   ```
   mcp__google__accounts_list
   ```
3. 共有ドライブへのアクセス権限があるか確認

### 認証情報エラー

1. `.env`ファイルが正しい場所にあるか確認
2. `.env.example`と見比べて必要な項目が全て記載されているか確認
3. 認証情報の有効期限が切れていないか確認

---

## 📞 サポート

質問・問題がある場合：
- 龍竹一生 / ryouchiku@life-time-support.com / 070-1298-0180
- このリポジトリのIssueを作成

---

## セーブ機能

ユーザーが「セーブ」と送信したら、以下の手順でセーブポイントを作成すること。

### 手順

1. **セーブポイントファイルを作成（または更新）**
   - 保存先: `.claude/memory/savepoint_YYYYMMDD.md` を作成
   - 同日のセーブポイントが既にある場合は上書き更新する

2. **セーブポイントに記載する内容**
   - セーブ日時
   - 完了済み作業（何を作り、何を設定したか）
   - 環境設定の状態（パス、APIキー設定有無、認証情報の場所など）
   - 既知の課題・未対応事項
   - 次にやるべきこと（優先順）
   - 技術メモ（コマンド、ハマりどころ、回避策など）

3. **MEMORY.mdを更新**
   - `.claude/memory/MEMORY.md`にセーブポイント一覧のリンクを追加
   - プロジェクトの現在状態を1行で要約

4. **ユーザーに完了報告**
   - 保存した内容のサマリを表示
   - 「次回はここから再開できます」と伝える

### セーブポイントからの再開

新しいセッション開始時にユーザーが「前回の続きから」「セーブポイントから再開」などと言ったら:
1. `.claude/memory/MEMORY.md`から最新のセーブポイントファイルを読む
2. 完了済み作業と次にやるべきことを提示する
3. ユーザーの指示を待つ

---

**最終更新:** 2026-03-04
**バージョン:** 1.0.0
**作成者:** 龍竹一生
