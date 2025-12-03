# Design System - Memo App

## Principles
- Apple-inspired: ガラス質感、柔らかなグラデーション、明快な階層（余白とタイポで主従を明示）。
- Minimal × Focus: 無駄な境界線を減らし、カードと背景のレイヤー差で情報を整理。
- Consistency first: トークンとパターンを再利用し、コンポーネント化を優先。

## Layout & Spacing
- コンテナ幅: `max-w-6xl` を基本。パディングは `px-6`、セクションの上下は `py-8`〜`py-12`。
- ラディアス: 16px〜24px（例: `rounded-2xl`, `rounded-3xl`）。小要素は 12px (`rounded-xl`)。
- シャドウ: メイン `shadow-xl shadow-slate-900/5`、インナーは `shadow-inner shadow-white` など淡いものを使用。
- グラス効果: `bg-white/70`〜`/90` + `backdrop-blur` を組み合わせ、ボーダーは `border-white/60` または `border-slate-200/70`。

## Color Tokens (Tailwindベース)
- 背景: グラデーション `from-slate-50 via-white to-slate-100`。ダークは未実装（必要時に調整）。
- テキスト: `text-slate-900` 主体、サブは `text-slate-600`、キャプションは `text-slate-500`。
- アクセント: ボタン/ハイライトに `bg-slate-900 text-white`、サブに `bg-slate-100`。
- 状態: Success系は `bg-emerald-50 text-emerald-700`。警告/エラーは未定義（追加時にトークン化）。

## Typography
- フォント: システム系サンセリフ `var(--font-geist-sans)`（globals.cssでInter系フォールバック）、等幅は `var(--font-geist-mono)`。
- 見出し: `text-3xl`〜`4xl` をヒーローに、カードは `text-lg`/`xl`。本文は `text-base`〜`text-lg`。
- ウェイト: 見出しは `font-semibold`、本文は `font-normal`/`medium`。全体に `tracking-tight` を適宜。

## Components (再利用パターン)
- Header: 左にブランド（ロゴマーク + サブタイトル）、右にナビとアクション（アウトライン＋ソリッドボタン）。背景は `bg-white/60` + `backdrop-blur` + `border-b`。
- Cards: `rounded-2xl`/`3xl`, `bg-white/80`〜`/90`, `border-white/70` or `border-slate-200`, `shadow-lg shadow-slate-900/5`, `backdrop-blur`。
- Buttons:
  - Primary: `bg-slate-900 text-white rounded-full px-5 py-2 shadow-lg shadow-slate-900/15 hover:bg-slate-800`
  - Secondary: `border border-slate-200 bg-white rounded-full px-4 py-2 text-slate-800 shadow-sm hover:border-slate-300 hover:shadow`
- Chips/Tags: `rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 shadow-inner`.

## Markdown & Content
- 編集パネル: 左右2カラムで「編集」「プレビュー」を並置。編集は等幅フォント、プレビューはサンセリフ。
- コードブロック: ダーク背景 `bg-slate-900 text-white rounded-lg px-3 py-2`。チェックリスト等はシンボルで表現。
- 見出し/リスト/コードの余白を一定に保ち、`leading-relaxed` を基本に。

## Motion & Interaction
- トランジションは `transition` + `hover:` で色と影の変化を中心に。過度なアニメーションは避け、応答性重視。
- フォーカス時はアウトライン/影を強調し、キーボード操作のアクセシビリティを確保。

## Implementation Notes
- Tailwind v4を使用。ユーティリティで完結し、カスタムCSSは最小限。新規スタイルは既存トークンに揃える。
- グローバルテーマは `app/globals.css` で管理。フォントや色を追加する場合は CSS 変数経由にする。
- コンポーネント化の優先度: Header / Button / Card / Chip / Markdownパネル。新UIはこれらのパターンを継承して追加。
