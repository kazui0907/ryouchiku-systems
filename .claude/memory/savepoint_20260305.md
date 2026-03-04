# セーブポイント 2026-03-05

**セーブ日時:** 2026-03-05 00:50 JST

---

## 完了済み作業

### 1. CRMフェーズ管理機能の実装（前回完了）
- **フェーズ管理スプレッドシート**を作成（ID: `1uxXJdrAaXNkK134gX4WPcVwtz3pgk5Rxc4rRfLwvhsg`）
- AIセミナー用の15フェーズを設定
- 99件の顧客データを同期済み
- Web UI（Index.html）にフェーズ表示・変更・フィルター機能を追加
- Code.gs用の関数を提供（ユーザーが手動で追加完了）

### 2. CLAUDE.mdの更新（前回完了）
- ルートCLAUDE.md: 共有ドライブ情報を新ID `0ADq9RVl_-pI7Uk9PVA` に更新
- sales-automation/CLAUDE.md: 同様に更新
- **Google Driveファイル作成ルール**を追加（マイドライブ禁止、共有ドライブ必須）

### 3. MCPサーバーの設定（今回）
- 新MCPサーバー `@piotr-agier/google-drive-mcp` v1.7.2 を設定
- OAuth認証情報ファイルを配置: `~/.config/google-drive-mcp/gcp-oauth.keys.json`
- 環境変数付きでMCPサーバーを再設定完了

---

## 環境設定の状態

### MCPサーバー
```
n8n: npx -y n8n-mcp - ✓ Connected
google-drive: npx @piotr-agier/google-drive-mcp - 環境変数設定済み、再起動待ち
  環境変数: GOOGLE_DRIVE_OAUTH_CREDENTIALS=$HOME/.config/google-drive-mcp/gcp-oauth.keys.json
```

### Google Drive認証情報
- **OAuthキーファイル:** `~/.config/google-drive-mcp/gcp-oauth.keys.json`
- **トークン保存先:** `~/.config/google-drive-mcp/tokens.json`（初回認証後に生成）
- **アカウント:** ryouchiku@life-time-support.com

### 共有ドライブ情報
- **共有ドライブ名:** ryouchiku-workspace
- **フォルダID:** `0ADq9RVl_-pI7Uk9PVA`
- **URL:** https://drive.google.com/drive/folders/0ADq9RVl_-pI7Uk9PVA

### スプレッドシートID
- **営業CRM:** `1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw`
- **フェーズ管理:** `1uxXJdrAaXNkK134gX4WPcVwtz3pgk5Rxc4rRfLwvhsg`

---

## 既知の課題・未対応事項

1. **Claude Code再起動が必要**
   - 新しいMCPサーバー設定を有効にするため再起動が必要
   - 再起動後、初回はブラウザでOAuth認証が求められる

2. **フェーズ管理スプレッドシートの移動**
   - 現在マイドライブ内にある
   - 共有ドライブ「ryouchiku-workspace」への移動が必要

3. **Index.htmlのデプロイ**
   - フェーズ管理機能を追加したIndex.htmlをGASにデプロイする必要あり

4. **Code.gsの動作確認**
   - ユーザーが追加した関数が正しく動作するか確認が必要

---

## 次にやるべきこと（優先順）

1. **Claude Codeを再起動**
   - `/exit` または Ctrl+C で終了して再起動
   - 新しいMCPサーバー設定を有効化

2. **OAuth認証を完了**
   - 再起動後、ブラウザでGoogle認証画面が開く
   - `ryouchiku@life-time-support.com` でログインして権限許可

3. **共有ドライブへのアクセス確認**
   - `listSharedDrives` ツールで共有ドライブ一覧を確認
   - `listFolder` で `0ADq9RVl_-pI7Uk9PVA` の中身を確認

4. **フェーズ管理スプレッドシートを移動**
   - マイドライブから共有ドライブに移動

5. **Index.htmlをGASにデプロイ**
   - 営業CRM.gsheetの「拡張機能 > Apps Script」から更新

6. **動作確認**
   - Web UIでフェーズ表示・変更が正常に動作するか確認

---

## 技術メモ

### MCP設定コマンド
```bash
# 現在の設定
claude mcp add google-drive \
  -e GOOGLE_DRIVE_OAUTH_CREDENTIALS="$HOME/.config/google-drive-mcp/gcp-oauth.keys.json" \
  -- npx @piotr-agier/google-drive-mcp

# 設定確認
claude mcp list
```

### 新MCPサーバーの使用例
```javascript
// 共有ドライブ一覧取得
listSharedDrives()

// 共有ドライブ内のファイル一覧
listFolder({ folderId: "0ADq9RVl_-pI7Uk9PVA" })

// スプレッドシート読み取り
getGoogleSheetContent({ spreadsheetId: "xxx", range: "Sheet1!A1:Z100" })
```

### フェーズ管理スプレッドシート構造
- A列: 顧客ID
- B列: 会社名
- C列: 氏名
- D列: AIセミナーフェーズ
- E列: IT内製化フェーズ
- F列: パーソナルトレーニングフェーズ
- G列: WEBマーケフェーズ
- H列: 最終更新日
- J-L列: フェーズマスタ（15フェーズ）

### AIセミナーの15フェーズ
1. リード
2. 初回接触済
3. 商談調整中
4. 検討中
5. 受注確定
6. 書類待ち
7. 申請完了
8. 入金待ち
9. 研修準備中
10. EIT研修中
11. LIT研修中
12. IIT研修①
13. IIT研修②
14. IIT研修③
15. フォローアップ

---

## 関連ファイル

- `/Users/kazui/Documents/ryouchiku-systems/CLAUDE.md`
- `/Users/kazui/Documents/ryouchiku-systems/group/it-solution/sales-automation/CLAUDE.md`
- `/Users/kazui/Documents/ryouchiku-systems/group/it-solution/sales-automation/crm-new/Index.html`
- `/Users/kazui/Documents/ryouchiku-systems/group/it-solution/sales-automation/crm-new/CLAUDE.md`
- `~/.config/google-drive-mcp/gcp-oauth.keys.json`
