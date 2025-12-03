import { AppHeader } from "@/components/AppHeader";
import { AuthCTA } from "@/components/AuthCTA";
import { FeatureAccess } from "@/components/FeatureAccess";

const highlights = [
  {
    title: "カテゴリで体系化",
    description: "階層的なカテゴリでプロジェクト別に整理。",
    chips: ["仕事", "個人", "学習"],
  },
  {
    title: "タグで横断検索",
    description: "複数タグを掛け合わせて瞬時に絞り込み。",
    chips: ["#research", "#idea", "#todo"],
  },
  {
    title: "Markdownで美しく",
    description: "シンタックスハイライトとプレビューを両立。",
    chips: ["見出し", "コード", "チェックリスト"],
  },
];

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/3 top-16 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-10 top-40 h-56 w-56 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <AppHeader showNav />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-12">
        <section className="flex flex-col gap-8 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-3">
              <span className="inline-flex items-center gap-2 rounded-full bg-slate-900 text-white px-4 py-1 text-xs font-semibold uppercase tracking-wide shadow-sm shadow-slate-900/10">
                Apple-inspired UI
              </span>
              <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
                瞬時に書けて、緻密に整理できる TagNote 体験。
              </h1>
              <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
                カテゴリ × タグで立体的に整理し、Markdownで表現力豊かに。
                すべてのメモが心地よいアニメーションと上質なUIで統一されます。
              </p>
              <div className="flex flex-wrap gap-3 text-sm font-semibold text-slate-700">
                <span className="rounded-full bg-slate-100 px-4 py-2 shadow-inner shadow-white">
                  カテゴリ管理
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 shadow-inner shadow-white">
                  タグ絞り込み
                </span>
                <span className="rounded-full bg-slate-100 px-4 py-2 shadow-inner shadow-white">
                  Markdownプレビュー
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 shadow-lg shadow-slate-900/5 backdrop-blur">
              <div className="flex items-center justify-between text-sm text-slate-600">
                <span>保存状態</span>
                <span className="flex items-center gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
                  ● 同期済み
                </span>
              </div>
              <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-mono text-slate-800 shadow-inner">
                # メモのタイトル{"\n"}
                - カテゴリ: プロダクト{"\n"}
                - タグ: #research #ui{"\n"}
                {"\n"}
                * Apple Design 風のガラス質感{"\n"}
                * Markdown で構造化{"\n"}
                * タグで横断検索
              </div>
              <AuthCTA className="pt-1" />
            </div>
          </div>
        </section>

        <section
          id="features"
          className="grid gap-4 md:grid-cols-3"
          aria-label="Features"
        >
          {highlights.map((item) => (
            <div
              key={item.title}
              className="flex flex-col gap-3 rounded-2xl border border-white/70 bg-white/80 p-5 shadow-lg shadow-slate-900/5 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-slate-900">
                  {item.title}
                </h3>
                <span className="text-xl">↗</span>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">
                {item.description}
              </p>
              <div className="flex flex-wrap gap-2">
                {item.chips.map((chip) => (
                  <span
                    key={chip}
                    className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 shadow-inner shadow-white"
                  >
                    {chip}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </section>

        <section
          id="markdown"
          className="grid gap-6 rounded-3xl border border-white/70 bg-white/90 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-lg md:grid-cols-2"
        >
          <div className="space-y-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Markdown Preview
            </p>
            <h2 className="text-2xl font-semibold text-slate-900">
              書き心地と読みやすさを両立したライブプレビュー。
            </h2>
            <p className="text-base leading-relaxed text-slate-600">
              入力と同時にリッチに整形。コードやタスクリストも Apple
              らしい余白とタイポで読みやすく。
            </p>
            <div className="flex gap-3">
              <button className="rounded-full bg-slate-900 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-slate-900/15 transition hover:bg-slate-800">
                プレビューを見る
              </button>
              <button className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow">
                下書きを開く
              </button>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 shadow-inner">
            <div className="grid grid-cols-2 gap-3 text-sm font-mono text-slate-800">
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>編集</span>
                  <span className="rounded-full bg-slate-100 px-2 py-0.5">
                    Markdown
                  </span>
                </div>
                <pre className="whitespace-pre-wrap text-slate-800">
{`# プロダクトメモ
- [ ] 情報設計の確認
- [x] UIトーンの決定
- [ ] タグ仕様のドラフト

\`\`\`tsx
const save = () => sync();
\`\`\``}
                </pre>
              </div>
              <div className="space-y-2 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
                <div className="flex items-center justify-between text-xs text-slate-500">
                  <span>プレビュー</span>
                  <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-emerald-700">
                    Live
                  </span>
                </div>
                <div className="space-y-2 text-slate-900">
                  <h3 className="text-lg font-semibold">プロダクトメモ</h3>
                  <ul className="space-y-1 text-sm">
                    <li>◻ 情報設計の確認</li>
                    <li>☑ UIトーンの決定</li>
                    <li>◻ タグ仕様のドラフト</li>
                  </ul>
                  <div className="rounded-lg bg-slate-900 px-3 py-2 text-xs text-white shadow-inner shadow-black/20">
                    <code>const save = () =&gt; sync();</code>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <FeatureAccess />
      </main>
    </div>
  );
}
