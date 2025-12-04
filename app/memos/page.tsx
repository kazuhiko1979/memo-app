 "use client";

import { useMemo, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import { MemoList } from "@/components/memos/MemoList";

export default function MemosPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [tagsInput, setTagsInput] = useState("");

  const tags = useMemo(
    () =>
      tagsInput
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)
        .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`)),
    [tagsInput],
  );

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-16 top-20 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-24 top-32 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <AppHeader showNav />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-8 px-6 pb-24 pt-12">
        <section className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-slate-900/10">
              Memos
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              保存されたメモを閲覧
            </h1>
            <p className="max-w-3xl text-lg leading-relaxed text-slate-600">
              Supabase に保存した自分のメモを一覧表示します。Markdown はプレビューと同じスタイルでレンダリングします。
            </p>
          </div>
        </section>

        <section className="flex flex-col gap-4 rounded-2xl border border-white/70 bg-white/85 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
                Filters
              </p>
              <h3 className="text-xl font-semibold text-slate-900">
                キーワード検索 / カテゴリ / タグ
              </h3>
            </div>
          </div>
          <div className="grid gap-3 md:grid-cols-3">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                キーワード
              </label>
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="タイトル・本文から検索"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                カテゴリ
              </label>
              <input
                type="text"
                value={category}
                onChange={(event) => setCategory(event.target.value)}
                placeholder="例: プロダクト/メモアプリ"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                タグ（カンマ区切り, #は自動付与）
              </label>
              <input
                type="text"
                value={tagsInput}
                onChange={(event) => setTagsInput(event.target.value)}
                placeholder="research, ui"
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              />
              {tags.length ? (
                <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>
        </section>

        <MemoList filters={{ search, category, tags }} />
      </main>
    </div>
  );
}
