# リポジトリガイドライン

## プロジェクト構成
- `app/`: App Router エントリ。`layout.tsx` でグローバル設定、`page.tsx` はランディング。  
- `public/`: 静的アセット。  
- ルート設定: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, PostCSS/Tailwind 設定はルートに配置。

## ビルド・開発・テスト
- 依存: `npm install`（推奨 Node 18+ / Next 16）。  
- 開発: `npm run dev`（デフォルト port 3000, HMR）。  
- 本番ビルド: `npm run build` / 本番起動: `npm run start`。  
- Lint: `npm run lint` を変更後に実行。

## コーディングスタイル
- 技術: Next.js 16, React 19, TypeScript, Tailwind v4。  
- インデント: 2スペース。Tailwindユーティリティ中心で、不要なインラインスタイルは避ける。  
- 命名: コンポーネントは PascalCase、変数/関数は camelCase、アセットは kebab-case。`app/` のルートファイル名は小文字（`page.tsx` 等）。  
- インポート: 標準→サードパーティ→ローカルの順で整理し、未使用を除去。

## テスト
- Jest + Testing Library が利用可能。`npm test`（単体）、`npm run typecheck`（型）、`npm run lint`（静的解析）を変更後に実行。  
- 基本は TDD。仕様はテストで先に明文化。  
- 新規UIは dev で `/` を開き、ライト/ダークやナビゲーションを手動確認。ロジックを含むコンポーネントは近傍/`__tests__/` にテストを置く。

## コミット/PR
- 短い履歴・短文の命令形メッセージを推奨（例: “Add memo grid”, “Fix lint issues”）。  
- PR 前に `npm run lint`（必要なら `npm run build`）を通し、簡潔な説明とUI変更はスクショ/GIFを添付。  
- `.env*` やビルド物はコミットしない。

## 設定と秘密情報
- 環境変数は `.env.local` に置き、秘密情報はコミットしない。  
- 新しい設定を導入する場合は README 等に必要変数を記載し、ローカル開発で安全なデフォルトにする。

## Supabase
- 必須環境変数: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`（`.env.local`）。  
- クライアント: `lib/supabaseClient.ts` の `supabase` を利用。欠損時はビルドでエラー。  
- 新規APIを使う際は型生成を検討し、導入時は `lib` 配下に置いて TDD で追加。

## ロードマップ/計画
- メモ機能: カテゴリ/タグ付き CRUD。Markdown 入力＋プレビューを標準化。  
- UI/UX: Apple 風ガラス質感と上質な余白を共通化（ヘッダー、カード、Markdownプレビューなど）。  
- 認証: Supabase Auth（匿名/メール/外部IdP検討中）。  
- 検索/フィルタ: タグ複合フィルタ、カテゴリ絞り込み。  
- 型安全/品質: 型生成を検討。`npm run lint` / `npm run typecheck` / `npm test` を必須。

## デザインシステム
- `DESIGN_SYSTEM.md` を参照。レイアウト、カラー、タイポグラフィ、カード/ボタン/チップ、Markdown 表示の指針。  
- 新規UIは既存トークン/パターンに合わせ、グローバルCSS増加を避けユーティリティ中心で統一。

## Playwright でのログイン確認
- 起動例: `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy npm run dev -- --hostname 127.0.0.1 --port 3000` で http://127.0.0.1:3000 を開く。  
- ログイン画面: `/login`。文字化けがないことを確認。  
- Supabase送信: ダミー判定なし。有効な URL/Key なら OTP メール送信が動く。ダミー値なら送信失敗（コンソールエラー）。

## メモ機能
- 作成: `/memos/new` でタイトル/カテゴリ/タグ/本文を Supabase `memos` に保存（ログイン必須）。  
- 一覧: `/memos` で自身のメモを取得し、Markdown をプレビューと同等に表示。検索・カテゴリ・タグフィルタあり。  
- 詳細: `/memos/{id}` で Notion 風カード表示。  
- 編集: `/memos/{id}` でタイトル/本文を更新。  
- 削除: `/memos/{id}` の「削除」から Supabase に DELETE。RLS で `user_id = auth.uid()` の DELETE 許可が前提。`SUPABASE_SERVICE_ROLE_KEY` があればサーバーAPIで確実に削除可能。  
- 導線: トップの「メモを閲覧する」→`/memos`、同「メモを作成する」→`/memos/new`。

## コミュニケーション
- チャットは日本語で統一。必要に応じて技術用語の英語併記は可。
