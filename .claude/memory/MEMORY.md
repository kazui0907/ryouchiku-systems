# プロジェクトメモリ（統合版）

**現在の状態:** 重複排除・フォルダ構成整理中（2026-03-06）

---

## セーブポイント一覧

| 日付 | ファイル | 概要 |
|------|----------|------|
| 2026-03-05 | [savepoint_20260305.md](./savepoint_20260305.md) | MCP OAuth設定完了、再起動待ち |

### 経営ダッシュボード履歴（旧G:ドライブMEMORY.mdから統合）
- [2026-03-04] 経営ダッシュボード: Supabase PostgreSQL移行完了。週次KPI・現場KPI入力機能実装済み。CSVデータ移行完了（2026年1-12月）。正本は `D:/scripts/.../ryouchiku-dashboard/`

---

## クイックリファレンス

### 重要なID
- **共有ドライブ:** `0ADq9RVl_-pI7Uk9PVA`
- **営業CRM:** `1ziKikGgjVmDS4BlUfMGQH2rfqGN03I1_Tb5gC1HcZBw`
- **フェーズ管理:** `1uxXJdrAaXNkK134gX4WPcVwtz3pgk5Rxc4rRfLwvhsg`
- **経営ダッシュボード（本番）:** https://ryouchiku-dashboard.vercel.app/
- **GitHub（ダッシュボード）:** https://github.com/kazui0907/ryouchiku-dashboard

### MCPサーバー
- `google-drive`: `npx @piotr-agier/google-drive-mcp`（共有ドライブ対応）
- `n8n`: `npx -y n8n-mcp`

### 正本管理ルール（2026-03-06確定）
- **CLAUDE.md**: Git（D:/scripts/ryouchiku-systems）のみ。Drive上には置かない
- **MEMORY.md**: Git（D:/scripts/.claude/memory/）のみ
- **コード**: Git（D:/scripts/ryouchiku-systems）のみ。Drive上には置かない
- **経営ダッシュボード**: `D:/scripts/.../ryouchiku-dashboard/`（Supabase版）が唯一の正本

### 次のアクション
1. Claude Code再起動（MCP設定を有効化）
2. OAuth認証を完了（ブラウザでGoogleログイン）
3. 共有ドライブアクセス確認
4. フェーズ管理シートを共有ドライブに移動
5. Index.htmlをGASにデプロイ
