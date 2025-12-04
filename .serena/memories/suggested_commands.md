# よく使うコマンド
- 依存インストール: `npm install`
- 開発サーバー: `npm run dev` (Next.js, http://localhost:3000)
- ビルド: `npm run build`
- 本番サーブ: `npm run start`
- Lint: `npm run lint`
- 型チェック: `npm run typecheck`
- テスト: `npm test` (Jest, `--runInBand`)
- Supabase 依存: `.env.local` に `NEXT_PUBLIC_SUPABASE_URL` と `NEXT_PUBLIC_SUPABASE_ANON_KEY` をセットしてから実行する。