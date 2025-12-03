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

## Communication
- チャットでのやり取りは今後日本語でお願いします。必要に応じて技術用語は英語併記で構いませんが、説明や要望は日本語で統一してください。
