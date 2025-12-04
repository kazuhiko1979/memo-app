import { AppHeader } from "@/components/AppHeader";
import { MemoCreateForm } from "@/components/MemoCreateForm";

export default function NewMemoPage() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-16 top-20 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-24 top-32 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <AppHeader />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-24 pt-12">
        <section className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-slate-900/10">
              New Memo
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              Markdownで書いて、同時にプレビュー。
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
              タイトルと本文を入力し、「この内容で保存」でSupabaseにメモを作成します。
              今回は作成のみ実装しています。閲覧や編集、削除は今後追加されます。
            </p>
          </div>
        </section>

        <MemoCreateForm />
      </main>
    </div>
  );
}
