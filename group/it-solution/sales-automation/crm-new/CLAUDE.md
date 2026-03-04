# CRM営業自動化システム

このディレクトリは営業CRMシステムのWeb UIおよびドキュメントです。

## 重要な指示

**Claudeへの指示:**
- このディレクトリでの回答は全て日本語で返すこと
- 技術的な内容も日本語で説明すること

## システム概要

このCRMシステムは、GoogleスプレッドシートとGoogle Apps Script (GAS)を使用した営業メール管理システムです。

### 主な機能
- 顧客情報管理
- メール件名・本文の下書き管理
- メール送信承認フロー
- 一括送信機能
- 営業フェーズ管理
- フォローアップ管理

### 技術スタック
- Google スプレッドシート
- Google Apps Script (GAS)
- HTML/JavaScript (フロントエンド)

## ファイル構成

- **Index.html**: Web UIのHTMLファイル（GASウェブアプリのフロントエンド）
- **Code.gs**: サーバーサイドのGASコード（営業CRM.gsheet にコンテナバインド。ローカルファイルとしては存在しない。編集は「拡張機能 > Apps Script」から行う）
- **スプレッドシートID**: `1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw`

## データ構造

スプレッドシートは32列（A〜AF）で構成されています：
- A列: 会社名
- B列: 部署
- C列: 役職
- D列: 氏名
- E列: メールアドレス
- O列: 推奨サービス
- Q列: メール件名
- R列: メール本文
- S列: ステータス（下書き済、送信許可、送信済み）
- U列: 次回フォロー文
- V列: 次回フォローステータス
- W列: 次回フォロー予定日
- X列: 営業フェーズ
- AB列: タッチ番号
- AC列: 連絡手段
- AF列: LINE送信テキスト
- その他: 連絡先情報、フォローアップ情報など

---

## システムファイル構成一覧

### 1. ローカル（GitHub管理）- コード・設計書

| ファイル | 場所 | 用途 |
|---------|------|------|
| **CLAUDE.md** | `/Users/kazui/Documents/ryouchiku-systems/CLAUDE.md` | プロジェクト全体のルールブック |
| **CLAUDE.md** | `.../sales-automation/CLAUDE.md` | 営業自動化システムのルールブック |
| **CLAUDE.md** | `.../sales-automation/crm-new/CLAUDE.md` | CRMシステムのドキュメント（このファイル） |
| **Index.html** | `.../sales-automation/crm-new/Index.html` | Web UIのソースコード |
| **セーブポイント** | `.../ryouchiku-systems/.claude/memory/` | 作業履歴・メモリ |

### 2. Google Drive（共有ドライブ: ryouchiku-workspace）- データ

| ファイル | ID / 場所 | 用途 |
|---------|-----------|------|
| **共有ドライブ** | `0ADq9RVl_-pI7Uk9PVA` | 全データの親フォルダ |
| **営業CRM.gsheet** | `1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw` | CRMマスターデータ（99件の顧客情報）|
| **フェーズ管理.gsheet** | `1uxXJdrAaXNkK134gX4WPcVwtz3pgk5Rxc4rRfLwvhsg` | 営業フェーズ管理用シート |
| **元データ（読み取り専用）** | `1nttaygfUPer9qj8dn93Sleoyg6g4Se5g5ciJDulhn_o` | n8nからの自動登録先 |

### 3. Google Apps Script（営業CRM.gsheetにバインド）- サーバーサイド

| ファイル | 場所 | 用途 |
|---------|------|------|
| **Code.gs** | 営業CRM.gsheet > 拡張機能 > Apps Script | サーバーサイドロジック |
| **Index.html** | 同上（デプロイ用コピー） | Web UIのデプロイ版 |

> **重要**: Code.gsはローカルファイルとして存在しません。編集は必ずGoogleスプレッドシートの「拡張機能 > Apps Script」から行います。

### 4. 外部システム連携

| システム | 用途 |
|---------|------|
| **n8n** | 名刺OCR → スプレッドシート自動登録のワークフロー |
| **Claude API** | AI判定・メール文案生成 |
| **Gmail** | メール送信 |

### ファイルの役割図

```
┌─────────────────────────────────────────────────────────────┐
│  GitHub（ローカル）                                          │
│  /Users/kazui/Documents/ryouchiku-systems/                  │
│  └── group/it-solution/sales-automation/                    │
│       ├── CLAUDE.md          ← ルールブック                  │
│       └── crm-new/                                          │
│            ├── Index.html    ← UIソースコード（マスター）     │
│            └── CLAUDE.md     ← CRMドキュメント               │
└─────────────────────────────────────────────────────────────┘
                          ↓ コピー＆デプロイ
┌─────────────────────────────────────────────────────────────┐
│  Google Apps Script（営業CRM.gsheetにバインド）              │
│  ├── Code.gs                 ← サーバーサイドロジック        │
│  └── Index.html              ← UIデプロイ版                 │
└─────────────────────────────────────────────────────────────┘
                          ↓ データ読み書き
┌─────────────────────────────────────────────────────────────┐
│  Google Drive（共有ドライブ: ryouchiku-workspace）           │
│  ID: 0ADq9RVl_-pI7Uk9PVA                                    │
│  ├── 営業CRM.gsheet          ← 顧客データ（99件）           │
│  │   ID: 1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw       │
│  ├── フェーズ管理.gsheet     ← フェーズデータ               │
│  │   ID: 1uxXJdrAaXNkK134gX4WPcVwtz3pgk5Rxc4rRfLwvhsg       │
│  └── 元データ.gsheet         ← n8n自動登録先（読み取り専用）│
│      ID: 1nttaygfUPer9qj8dn93Sleoyg6g4Se5g5ciJDulhn_o       │
└─────────────────────────────────────────────────────────────┘
```

### 編集する時のルール

| 何を編集？ | どこで編集？ |
|-----------|-------------|
| UIのデザイン・機能 | ローカルの `Index.html` を編集 → GASにコピー → デプロイ |
| サーバーサイドロジック | GASエディタで `Code.gs` を直接編集 |
| 顧客データ | スプレッドシートを直接編集 or Web UIから |
| ルール・仕様 | ローカルの `CLAUDE.md` を編集 |

---

## 別のWindowsパソコンでの開発環境セットアップ手順

### 前提条件
- Googleアカウント: `ryouchiku@life-time-support.com` へのアクセス権
- GitHubアカウントへのアクセス権

### Step 1: 必要なソフトウェアのインストール

```powershell
# 1. Git のインストール
# https://git-scm.com/download/win からダウンロード＆インストール

# 2. Node.js のインストール（Claude Code に必要）
# https://nodejs.org/ からLTS版をダウンロード＆インストール

# 3. Claude Code のインストール
npm install -g @anthropic-ai/claude-code

# 4. VS Code のインストール（推奨）
# https://code.visualstudio.com/ からダウンロード
```

### Step 2: GitHubリポジトリのクローン

```powershell
# 作業ディレクトリに移動
cd C:\Users\[ユーザー名]\Documents

# リポジトリをクローン
git clone https://github.com/[リポジトリURL]/ryouchiku-systems.git

# ディレクトリに移動
cd ryouchiku-systems
```

### Step 3: Claude Code の設定

```powershell
# Claude Code を起動
claude

# MCPサーバーの設定（Google Drive連携）
claude mcp add google-drive -e GOOGLE_DRIVE_OAUTH_CREDENTIALS="$HOME\.config\google-drive-mcp\gcp-oauth.keys.json" -- npx @piotr-agier/google-drive-mcp

# n8n MCPサーバーの設定
claude mcp add n8n -- npx -y n8n-mcp
```

### Step 4: Google Drive OAuth認証の設定

1. **OAuth認証情報ファイルを配置**
   ```powershell
   # フォルダを作成
   mkdir $HOME\.config\google-drive-mcp

   # 既存のMacから gcp-oauth.keys.json をコピーして配置
   # 場所: C:\Users\[ユーザー名]\.config\google-drive-mcp\gcp-oauth.keys.json
   ```

2. **初回認証**
   - Claude Code を再起動
   - Google Drive MCPツールを使用すると、ブラウザが開く
   - `ryouchiku@life-time-support.com` でログインして権限を許可

### Step 5: 編集作業の流れ

#### UIの編集（Index.html）

```
1. ローカルでファイルを編集
   C:\Users\[ユーザー名]\Documents\ryouchiku-systems\group\it-solution\sales-automation\crm-new\Index.html

2. GASにコピー＆デプロイ
   - 営業CRM.gsheet を開く
   - 拡張機能 > Apps Script
   - Index.html を選択して内容を貼り付け
   - デプロイ > デプロイを管理 > 編集 > 新しいバージョン > デプロイ

3. Gitにコミット
   git add .
   git commit -m "[update] Index.htmlを更新"
   git push
```

#### サーバーサイドの編集（Code.gs）

```
1. GASエディタで直接編集
   - 営業CRM.gsheet > 拡張機能 > Apps Script
   - Code.gs を編集
   - 保存（Ctrl+S）
   - 必要に応じてデプロイ

※ Code.gsはローカルに存在しないため、Gitでは管理していません
```

### 重要なID一覧

| 項目 | ID |
|------|-----|
| 共有ドライブ | `0ADq9RVl_-pI7Uk9PVA` |
| 営業CRM.gsheet | `1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw` |
| フェーズ管理.gsheet | `1uxXJdrAaXNkK134gX4WPcVwtz3pgk5Rxc4rRfLwvhsg` |
| 元データ.gsheet | `1nttaygfUPer9qj8dn93Sleoyg6g4Se5g5ciJDulhn_o` |

### 便利なリンク

| 項目 | URL |
|------|-----|
| 営業CRM | https://docs.google.com/spreadsheets/d/1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw |
| 共有ドライブ | https://drive.google.com/drive/folders/0ADq9RVl_-pI7Uk9PVA |
| GASエディタ | 営業CRM.gsheet > 拡張機能 > Apps Script |

---

## 最近の更新履歴

### 2026-03-05: システム構成ドキュメント追加
- ファイル構成一覧を追加
- フェーズ管理スプレッドシートを共有ドライブに移動完了

### 2026-03-02: データ移行完了
- 旧CRMスプレッドシート（ID: 1_pzZVz2Df-VLOhgVIsy7oUV60SZpcDv-pPiV4q8bZUc）から新CRMへのデータ移行完了
- 全99件の顧客データを正常に移行
- Code.gsのスプレッドシート参照を新IDに更新
- 旧gas/ディレクトリ（Code.gs, SetupCRM.gs, CreateFolders.gs等）を削除済み
