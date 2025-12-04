# memo-app

Next.js 16 / React 19 / TypeScript / Tailwind v4 + Supabase で構築したメモアプリです。カテゴリ・タグ・キーワード検索、Markdownプレビュー付きでメモを整理できます。

## セットアップ
1. 依存インストール: `npm install`
2. 環境変数（`.env.local`）:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - （任意）`SUPABASE_SERVICE_ROLE_KEY` … サーバーAPIで削除を確実に行いたい場合に使用。クライアントには露出しません。
3. 開発起動: `npm run dev` （デフォルト http://localhost:3000）

## 主なスクリプト
- 開発: `npm run dev`
- ビルド: `npm run build`
- 本番起動: `npm run start`
- Lint: `npm run lint`
- テスト: `npm test`
- 型チェック: `npm run typecheck`

## 機能
- メモ作成: `/memos/new` でタイトル/カテゴリ/タグ/本文（Markdownプレビュー）を入力して保存（ログイン必須）。
- 一覧・検索: `/memos` で自分のメモを取得し、キーワード（タイトル/本文 ilike）、カテゴリ、タグ（AND条件）でフィルタ。Markdownはプレビュー同等スタイル。
- 詳細/編集/削除: `/memos/{id}` で Notion風カード表示。タイトル・本文の編集、削除が可能。削除には RLS で `user_id = auth.uid()` の DELETE 許可が必要。サービスロールキーがあればサーバーAPI経由で確実に削除できます。
- 認証: Supabase Auth の OTP メールログイン（`.env.local` の URL/Key が有効なら実送信）。

## フォルダ構成（概要）
- `app/` … ルート/ページ。`app/memos` に一覧・新規・詳細、`app/api` にメモ削除APIなど。
- `components/` … 共通UI。`components/memos/` に MemoList/Detail/CreateForm。
- `lib/` … Supabaseクライアント（通常/任意サービスロール）。
- `docs/` … 機能拡張計画など（例: `feature-plan-memos.md`）。
- `AGENTS.md`, `DESIGN_SYSTEM.md` … プロジェクト運用・デザインガイド。

## Playwright 確認（ログイン）
1. `npm run dev -- --hostname 127.0.0.1 --port 3000`
2. ブラウザで `/login` へ遷移し、OTPメール送信が動作することを確認（有効な Supabase URL/Key 前提）。

## Supabase ポリシーの注意
- RLS: `memos` テーブルで `user_id = auth.uid()` の SELECT/UPDATE/DELETE を許可してください。編集・削除が動かない場合は RLS を確認してください。
- インデックス/検索: 必要に応じて `tags` の GIN、`content` の pg_trgm インデックスを検討できます。
