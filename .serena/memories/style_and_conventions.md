# コーディング規約
- コンポーネントは関数コンポーネント/サーバーコンポーネント優先。ファイルは2スペースインデント。
- ネーミング: コンポーネント PascalCase、変数/関数 camelCase、アセットは kebab-case。App ルートファイルは小文字(`page.tsx`, `layout.tsx`)。
- インポート順: 標準 -> サードパーティ -> ローカル。未使用は削除して lint クリーンに。
- スタイル: Tailwind v4 ユーティリティ中心。インラインスタイルはユーティリティで代替できるときは避ける。グローバル CSS 追加は最小限。
- デザイン: `DESIGN_SYSTEM.md` のトークン/パターンに従う。Apple ライクなガラス質感・余白を意識。
- Supabase: `lib/supabaseClient.ts` の `supabase` を利用。型安全が必要なら Supabase 型生成を検討し、`lib` 配下に配置。
- テスト駆動: 仕様はテストで先に明文化(TDD ベース)。ロジック付きコンポーネントは React Testing Library + Jest でカバレッジ追加。