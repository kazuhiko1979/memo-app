# Repository Guidelines

## Project Structure & Module Organization
- `app/` holds the App Router entrypoints: `layout.tsx` defines global font/theme wiring and `page.tsx` renders the landing screen; `globals.css` imports Tailwind v4 utilities and base variables.  
- `public/` stores static assets such as icons and any uploaded images.  
- Root configs: `next.config.ts`, `tsconfig.json`, `eslint.config.mjs`, and PostCSS/Tailwind config files. Keep new scripts and settings co-located with these.

## Build, Test, and Development Commands
- Install deps: `npm install` (Node 18+ recommended for Next 16).  
- Local dev: `npm run dev` (starts Next on port 3000 with HMR).  
- Production build: `npm run build`.  
- Production serve: `npm run start` (uses the build output).  
- Lint: `npm run lint` (ESLint with `eslint-config-next`). Run before pushing.

## Coding Style & Naming Conventions
- Stack: Next.js 16, React 19, TypeScript, Tailwind v4. Favor functional components and server components by default unless client hooks are needed.  
- Formatting: 2-space indentation; prefer declarative JSX with utility classes from Tailwind; avoid ad-hoc inline styles when a utility exists.  
- Naming: PascalCase for components, camelCase for vars/functions, kebab-case for new asset filenames. Keep `app/` route files lower-case (`page.tsx`, `layout.tsx`).  
- Imports: group built-ins, third-party, then local; remove unused symbols to keep lint clean.

## Testing Guidelines
- Jest + Testing Library を利用可能。`npm test` で単体テスト、`npm run typecheck` で型検査、`npm run lint` で静的解析を変更後に必ず実行すること。  
- 実装前にテストを書くテスト駆動開発（TDD）を基本とし、仕様はテストで先に明文化する。  
- For new UI, manually verify in dev: load `/`, check light/dark rendering, and basic navigation/links.  
- If you add components with logic, prefer React Testing Library + Jest colocated in `__tests__/` or alongside the component (e.g., `Component.test.tsx`).

## Commit & Pull Request Guidelines
- History is minimal and uses short messages; follow that pattern with imperative summaries (e.g., “Add memo grid”, “Fix lint issues”).  
- Before opening a PR: ensure `npm run lint` and, if relevant, `npm run build` pass; include a brief description, screenshots/GIFs for UI changes, and link any issue/ticket.  
- Keep commits focused (one feature/fix per commit) and avoid committing `.env*` or build artifacts.

## Configuration & Secrets
- Place environment-specific values in `.env.local`; do not commit secrets.  
- When introducing new config, document required variables in README and keep defaults safe for local development.

## Supabase Setup
- 必須環境変数: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`（`.env.local` に定義）。  
- Supabase クライアントは `lib/supabaseClient.ts` の `supabase` を利用。URL/Key が欠けるとビルド時にエラーで知らせる。  
- 新規 API 利用時は型安全のため Supabase の型生成を検討し、導入する場合は `lib` 配下に型定義を置き、TDD でクエリを追加する。  

## Roadmap / Plans
- メモ機能: カテゴリ（階層的整理）とタグ（横断検索）を付与できるメモ CRUD。Markdown 入力とプレビューを標準化。  
- UI/UX: Apple デザインシステムを意識したガラス質感・上質な余白のベースレイアウトを共通化（ヘッダー、カード、Markdownプレビューなど）。  
- 認証: Supabase Auth によるユーザー認証を追加予定（匿名/メール/外部IdPは検討中）。  
- 検索・フィルタ: タグの複合フィルタやカテゴリでの絞り込みを実装予定。  
- 型安全/品質: Supabase の型生成導入を検討し、機能追加は TDD で進め、`npm run lint` / `npm run typecheck` / `npm test` を必須とする。  

## Design System
- 共有ドキュメント: `DESIGN_SYSTEM.md` を参照。レイアウト、カラー、タイポグラフィ、カード/ボタン/チップのパターン、Markdown表示の指針を定義。  
- 新規UI追加時は同ドキュメントのトークンとパターンに合わせ、グローバルCSSを増やさずユーティリティ中心で統一すること。  

## Playwright でのログイン動作確認
- 起動: `NEXT_PUBLIC_SUPABASE_URL=http://localhost:54321 NEXT_PUBLIC_SUPABASE_ANON_KEY=dummy npm run dev -- --hostname 127.0.0.1 --port 3000` を利用し、http://127.0.0.1:3000 を開く。  
- 確認ページ: ログイン画面は `/login`（例: http://127.0.0.1:3000/login）。  
- 進行: サーバー起動後、Playwright でブラウザを開き `/login` に遷移し、日本語文言が文字化けしていないことを確認する。  
- Supabase 送信: ダミー判定は撤去済み。`.env.local` の `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` が有効値なら、フォーム送信で Supabase に OTP メールを送信する。ダミー値の場合は送信失敗（コンソールにエラー）。  

## メモ機能（作成・閲覧）
- 作成: `/memos/new` で `MemoCreateForm` を使用し、タイトル/カテゴリ/タグ/本文（Markdown）を Supabase `memos` テーブルに保存。ログイン必須。  
- 閲覧: `/memos` で `MemoList` がログインユーザーのメモを Supabase から取得し、Markdown をプレビューと同じスタイルでレンダリング表示。非ログイン時はエラー表示。  
- 詳細: 各メモカードに「詳細を開く」リンクを設置し `/memos/{id}` (MemoDetail) で Notion風カード/ガラス質感の詳細表示。  
- 編集: `/memos/{id}` でタイトル/本文を編集し Supabase に更新（ログイン必須）。  
- 削除: `/memos/{id}` の「削除」から Supabase に DELETE。RLS で `user_id = auth.uid()` の DELETE を許可していることが前提。`SUPABASE_SERVICE_ROLE_KEY` を設定すればサーバー側API経由で確実に削除可能。  
- 導線: トップの「メモを閲覧する」カードから `/memos`、同「メモを作成する」カードから `/memos/new` に遷移。  

## Communication
- チャットでのやり取りは今後日本語でお願いします。必要に応じて技術用語は英語併記で構いませんが、説明や要望は日本語で統一してください。
