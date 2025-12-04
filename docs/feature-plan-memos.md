# メモ機能 拡張計画（要件定義・設計・実装方針）

## 1. 全体方針
- 検索・分類・タグ付けを追加し、一覧/詳細/新規作成との UX 一貫性を維持する。
- 先に RLS ポリシーと Supabase スキーマ変更を固め、テストと Playwright での E2E をセットで進める。
- Notion風のカード/ガラス質感 UI を踏襲し、タグ/カテゴリ/検索バーはヘッダー/サイドフィルタに自然に溶け込ませる。

## 2. 要件定義
### 2-1. 本文キーワード検索
- 検索対象: title, content（全文、Markdownを含むテキスト）
- スコープ: 自分のメモ（user_id = auth.uid()）。RLSを厳守。
- 入力: フリーテキスト（プレーン検索、AND/ORは当面なし）
- 表示: `/memos` 上部に検索バーを追加し、結果を同ページ内でフィルタ表示。
- パフォーマンス: Supabaseの`ilike` + 低コスト検索から開始。必要なら`pg_trgm`/全文検索に拡張。

### 2-2. カテゴリ分類
- モデル: `category` は既存の string を正式に採用。将来的な階層化は別チケット。
- 要件: 一覧でカテゴリフィルタ（ドロップダウン）、カードでカテゴリを表示。
- バリデーション: 50文字程度上限、必須ではない。

### 2-3. タグ付け & フィルタ
- モデル: `tags` は string 配列。`#` プレフィクスはUIで付与、DBはプレーン文字列で格納。
- 要件: 一覧で複数タグの AND フィルタ（例: tag in all([a,b]))。
- UI: チップで表示。フィルタ用にマルチセレクト（簡易はチェックボックスリスト、後でオートコンプリート）。

## 3. スキーマ（Supabase）
- 既存 `memos` テーブルを継続利用。追加変更はなし（title/content/category/tags/user_id/created_at/updated_at）。
- インデックス案:
  - `create index memos_user_id_created_at_idx on memos (user_id, created_at desc);`
  - `create index memos_user_id_category_idx on memos (user_id, category);`
  - `create index memos_user_id_tags_idx on memos using gin (tags);`
  - `create index memos_user_id_content_trgm_idx on memos using gin (content gin_trgm_ops);` ※pg_trgm有効時
- RLS: DELETE/UPDATE/SELECT/INSERT 全て `user_id = auth.uid()` を許可。検索・フィルタは SELECT ポリシーに依存。

## 4. API / クエリ設計
- フロントで直接 Supabase JS を利用（既存パターン）。
- 一覧取得: `/memos` でクエリパラメータを状態管理し、Supabaseクエリを組み立て。
  - 基本: `.eq("user_id", userId).order("created_at", { descending: true })`
  - キーワード: `.or(`title.ilike.%{q}%,content.ilike.%{q}%`)`
  - カテゴリ: `.eq("category", selectedCategory)`
  - タグ: ANDフィルタ → `tags.cs` や `@>` を使用（例: `.contains("tags", selectedTags)`）

## 5. UI/UX設計
- 検索バー: `/memos` のヘッダー下に設置。丸み＋ガラス質感。入力中はローディングインジケータ。
- フィルタバー: カテゴリのドロップダウン、タグのマルチセレクト。Notion風のチップで適用状態を表示。
- カード: 既存のグラスカードを流用。検索・フィルタ結果を即時反映。
- アクセシビリティ: フィルタ適用時にライブリージョンで「n件に絞り込み」を通知。

## 6. 実装計画（ステップ）
1) スキーマ/インデックス方針合意（pg_trgm 導入要否を決定）。  
2) RLS ポリシーのDELETE/UPDATE/SELECT を再確認・不足があれば適用。  
3) 一覧のクエリ層を関数化（例: `fetchMemos({ q, category, tags })`）し、既存の MemoList を置き換える。  
4) UI追加: 検索バー、カテゴリドロップダウン、タグマルチセレクト。  
5) テスト:  
   - 単体: フィルタロジック（クエリパラメータ→Supabaseクエリ組み立て）  
   - E2E: Playwrightで検索/フィルタ/タグANDの挙動、0件表示、リセット確認。  
6) パフォーマンス改善（必要なら pg_trgm/全文検索 に移行）。  

## 7. リスクと対策
- トライグラム拡張未導入: まずは ilike で開始、必要に応じて pg_trgm を有効化し、インデックス作成。  
- タグANDフィルタのクエリ: `@>` を用いるため、tagsは配列型維持。クエリビルドをユーティリティ化。  
- RLS不備: 削除/更新は動作済み。検索/フィルタも `user_id = auth.uid()` に依存するため、SELECTポリシーを確認。  

## 8. 環境変数/運用メモ
- 必須: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`  
- 任意: `SUPABASE_SERVICE_ROLE_KEY`（サーバー側で安全に保持、RLSをバイパスしたメンテ操作用）  

## 9. 今後のブレークダウン（チケット例）
- [ ] クエリビルド関数の抽出・テスト追加  
- [ ] 検索バー + 状態管理（キーワード入力→遅延クエリ/デバウンス）  
- [ ] カテゴリフィルタ UI/クエリ対応  
- [ ] タグマルチセレクト UI/クエリ対応（ANDフィルタ）  
- [ ] Playwright シナリオ作成（検索・カテゴリ・タグ・リセット）  
- [ ] pg_trgm 導入可否の決定とインデックス適用（必要なら）  
