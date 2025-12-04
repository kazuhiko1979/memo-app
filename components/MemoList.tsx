"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ToastProvider";

type Memo = {
  id: string;
  title: string;
  content: string;
  category: string | null;
  tags: string[] | null;
  created_at: string | null;
  updated_at: string | null;
  user_id: string;
};

const markdownComponents: Components = {
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-xl font-semibold text-slate-900">{children}</h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-lg font-semibold text-slate-900">{children}</h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-base font-semibold text-slate-900">{children}</h3>
  ),
  p: ({ children }: { children: ReactNode }) => (
    <p className="leading-relaxed text-slate-700">{children}</p>
  ),
  ul: ({ children }: { children: ReactNode }) => (
    <ul className="list-disc space-y-1 pl-5 text-slate-700">{children}</ul>
  ),
  ol: ({ children }: { children: ReactNode }) => (
    <ol className="list-decimal space-y-1 pl-5 text-slate-700">{children}</ol>
  ),
  li: ({ children }: { children: ReactNode }) => (
    <li className="leading-relaxed">{children}</li>
  ),
  code: ({
    inline,
    children,
  }: {
    inline?: boolean;
    children: ReactNode;
  }) =>
    inline ? (
      <code className="rounded-md bg-slate-100 px-1.5 py-0.5 text-[0.9em] text-slate-900">
        {children}
      </code>
    ) : (
      <code className="block w-full rounded-lg bg-slate-900 px-3 py-2 text-sm text-white shadow-inner shadow-black/20">
        {children}
      </code>
    ),
  blockquote: ({ children }: { children: React.ReactNode }) => (
    <blockquote className="border-l-4 border-slate-200 pl-4 italic text-slate-700">
      {children}
    </blockquote>
  ),
  a: ({
    href,
    children,
  }: {
    href?: string;
    children: React.ReactNode;
  }) => (
    <a
      href={href}
      className="underline decoration-slate-300 underline-offset-4 transition hover:text-slate-900"
    >
      {children}
    </a>
  ),
};

type Filters = {
  search: string;
  category: string;
  tags: string[];
};

export function MemoList({ filters }: { filters: Filters }) {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const fetchMemos = async () => {
      setStatus("loading");
      setError(null);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        setStatus("error");
        const message = "ログインが必要です。先にログインしてください。";
        setError(message);
        notify(message, "error");
        return;
      }

      const userId = sessionData.session.user.id;
      let query = supabase
        .from("memos")
        .select(
          "id, title, content, category, tags, created_at, updated_at, user_id",
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (filters.search.trim()) {
        const term = filters.search.trim().replace(/%/g, "\\%");
        query = query.or(
          `title.ilike.%${term}%,content.ilike.%${term}%`,
        );
      }

      if (filters.category.trim()) {
        query = query.eq("category", filters.category.trim());
      }

      if (filters.tags.length) {
        query = query.contains("tags", filters.tags);
      }

      const { data, error: fetchError } = await query;

      if (fetchError) {
        setStatus("error");
        const message =
          "メモの取得に失敗しました。ネットワークと認可設定を確認してください。";
        setError(message);
        notify(message, "error");
        return;
      }

      setMemos(data ?? []);
      setStatus("idle");
    };

    void fetchMemos();
  }, [filters, notify]);

  const emptyMessage = useMemo(() => {
    if (status === "loading") return "メモを読み込み中...";
    if (error) return error;
    if (!memos.length) return "保存されたメモはまだありません。";
    return null;
  }, [status, error, memos.length]);

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Browse
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            保存済みのメモを一覧表示
          </h2>
          <p className="text-sm text-slate-600">
            Supabase から自分のメモを取得して表示します。Markdown はプレビューと同じスタイルでレンダリングします。
          </p>
        </div>
        <div className="text-xs text-slate-500">
          {status === "loading" ? "同期中..." : `${memos.length} 件`}
        </div>
      </div>

      {emptyMessage ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-600">
          {emptyMessage}
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {memos.map((memo) => (
            <article
              key={memo.id}
              className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-900/5 backdrop-blur"
            >
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="space-y-1">
                  <h3 className="text-lg font-semibold text-slate-900">
                    {memo.title || "無題のメモ"}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
                    {memo.category ? (
                      <span className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white">
                        {memo.category}
                      </span>
                    ) : null}
                    {(memo.tags ?? []).map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="text-xs text-slate-500">
                  {memo.updated_at
                    ? new Date(memo.updated_at).toLocaleString()
                    : memo.created_at
                      ? new Date(memo.created_at).toLocaleString()
                      : ""}
                </div>
              </div>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {memo.content}
                </ReactMarkdown>
              </div>
              <div className="flex justify-end">
                <a
                  href={`/memos/${memo.id}`}
                  className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
                >
                  詳細を開く
                  <span aria-hidden>↗</span>
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
