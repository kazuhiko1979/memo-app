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
- No automated test suite yet; at minimum run `npm run lint` before PRs.  
- For new UI, manually verify in dev: load `/`, check light/dark rendering, and basic navigation/links.  
- If you add components with logic, prefer React Testing Library + Jest colocated in `__tests__/` or alongside the component (e.g., `Component.test.tsx`).

## Commit & Pull Request Guidelines
- History is minimal and uses short messages; follow that pattern with imperative summaries (e.g., “Add memo grid”, “Fix lint issues”).  
- Before opening a PR: ensure `npm run lint` and, if relevant, `npm run build` pass; include a brief description, screenshots/GIFs for UI changes, and link any issue/ticket.  
- Keep commits focused (one feature/fix per commit) and avoid committing `.env*` or build artifacts.

## Configuration & Secrets
- Place environment-specific values in `.env.local`; do not commit secrets.  
- When introducing new config, document required variables in README and keep defaults safe for local development.

## Communication
- チャットでのやり取りは今後日本語でお願いします。必要に応じて技術用語は英語併記で構いませんが、説明や要望は日本語で統一してください。
