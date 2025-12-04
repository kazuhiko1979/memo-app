"use client";

import Link from "next/link";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import ReactMarkdown, { type Components } from "react-markdown";
import remarkGfm from "remark-gfm";

import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ToastProvider";

type FormState = {
  title: string;
  category: string;
  tagsInput: string;
  content: string;
};

const placeholderMarkdown = `# はじめてのメモ
- [ ] UIのトーンを揃える
- [x] カテゴリ構造のドラフト
- [ ] タグの命名規則を決める

\`\`\`tsx
const saveMemo = async () => {
  await sync();
};
\`\`\``;

const markdownComponents: Components = {
  h1: ({ children }: { children: ReactNode }) => (
    <h1 className="text-2xl font-semibold text-slate-900">{children}</h1>
  ),
  h2: ({ children }: { children: ReactNode }) => (
    <h2 className="text-xl font-semibold text-slate-900">{children}</h2>
  ),
  h3: ({ children }: { children: ReactNode }) => (
    <h3 className="text-lg font-semibold text-slate-900">{children}</h3>
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

export function MemoCreateForm() {
  const [formState, setFormState] = useState<FormState>({
    title: "",
    category: "",
    tagsInput: "",
    content: placeholderMarkdown,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const syncUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) return;
      setUserEmail(data.user?.email ?? null);
      setUserId(data.user?.id ?? null);
    };
    void syncUser();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserEmail(session?.user.email ?? null);
      setUserId(session?.user.id ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const tags = useMemo(() => {
    return formState.tagsInput
      .split(",")
      .map((tag) => tag.trim())
      .filter(Boolean)
      .map((tag) => (tag.startsWith("#") ? tag : `#${tag}`));
  }, [formState.tagsInput]);

  const handleChange = (field: keyof FormState) => (value: string) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!userId) {
      notify("ログインしてください。", "error");
      return;
    }
    if (!formState.title.trim() || !formState.content.trim()) {
      notify("タイトルと本文は必須です。", "error");
      return;
    }
    setIsSubmitting(true);
    const payload = {
      title: formState.title.trim(),
      content: formState.content.trim(),
      category: formState.category.trim() || null,
      tags,
      user_id: userId,
    };
    const { error } = await supabase.from("memos").insert(payload);
    if (error) {
      notify("メモの作成に失敗しました。もう一度お試しください。", "error");
      setIsSubmitting(false);
      return;
    }
    notify("メモを保存しました。", "success");
    setFormState((prev) => ({
      ...prev,
      title: "",
      category: "",
      tagsInput: "",
      content: placeholderMarkdown,
    }));
    setIsSubmitting(false);
  };

  const isLoggedIn = Boolean(userEmail && userId);

  return (
    <section className="flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Create Memo
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            Markdownを書きながら即座にプレビュー。
          </h2>
          <p className="text-sm text-slate-600">
            タイトルと本文を入力して保存できます。カテゴリとタグは後から検索・分類しやすいように付与してください。
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          {isLoggedIn ? (
            <span className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-inner shadow-white">
              ログイン中: {userEmail}
            </span>
          ) : (
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-amber-100 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800 shadow-inner shadow-white">
                保存にはログインが必要です
              </span>
              <Link
                href="/login"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
              >
                ログイン
              </Link>
            </div>
          )}
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="grid gap-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur md:grid-cols-[1.1fr,1.1fr]"
      >
        <div className="flex flex-col gap-5">
          <div className="space-y-3">
            <label className="text-sm font-semibold text-slate-800" htmlFor="title">
              タイトル
            </label>
            <input
              id="title"
              name="title"
              type="text"
              required
              value={formState.title}
              onChange={(event) => handleChange("title")(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder="TagNote の体験設計メモ"
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-3">
              <label
                className="text-sm font-semibold text-slate-800"
                htmlFor="category"
              >
                カテゴリ（任意）
              </label>
              <input
                id="category"
                name="category"
                type="text"
                value={formState.category}
                onChange={(event) => handleChange("category")(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="例: プロダクト/メモアプリ"
              />
            </div>
            <div className="space-y-3">
              <label className="text-sm font-semibold text-slate-800" htmlFor="tags">
                タグ（カンマ区切り）
              </label>
              <input
                id="tags"
                name="tags"
                type="text"
                value={formState.tagsInput}
                onChange={(event) => handleChange("tagsInput")(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="research, ui, backlog"
              />
              {tags.length ? (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 shadow-inner shadow-white"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <label htmlFor="content" className="cursor-pointer">
                本文（Markdown）
              </label>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-[0.7rem] text-slate-700 shadow-inner shadow-white">
                Live Preview
              </span>
            </div>
            <textarea
              id="content"
              name="content"
              required
              value={formState.content}
              onChange={(event) => handleChange("content")(event.target.value)}
              className="min-h-[300px] w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 font-mono text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
              placeholder={placeholderMarkdown}
            />
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={!isLoggedIn || isSubmitting}
              className="rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "保存中..." : "この内容で保存"}
            </button>
            <span className="text-xs text-slate-500">
              プレビューを確認してから保存してください。
            </span>
          </div>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 shadow-inner">
          <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            <span>プレビュー</span>
            <span className="rounded-full bg-emerald-50 px-3 py-1 text-[0.7rem] font-semibold text-emerald-700 shadow-inner shadow-white">
              Markdown
            </span>
          </div>
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white p-4 text-sm leading-relaxed text-slate-800 shadow-sm">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                タイトル
              </p>
              <p className="text-lg font-semibold text-slate-900">
                {formState.title || "無題のメモ"}
              </p>
            </div>
            <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
              {formState.category ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white">
                  {formState.category}
                </span>
              ) : null}
              {tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white"
                >
                  {tag}
                </span>
              ))}
            </div>
            <div data-testid="markdown-preview" className="space-y-3">
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {formState.content || placeholderMarkdown}
              </ReactMarkdown>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
}
