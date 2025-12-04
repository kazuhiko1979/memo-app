"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
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

export function MemoDetail({ memoId }: { memoId: string }) {
  const [memo, setMemo] = useState<Memo | null>(null);
  const [status, setStatus] = useState<"idle" | "loading" | "error">("idle");
  const [isEditing, setIsEditing] = useState(false);
  const [draftTitle, setDraftTitle] = useState("");
  const [draftContent, setDraftContent] = useState("");
  const [userId, setUserId] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { notify } = useToast();

  useEffect(() => {
    const fetchMemo = async () => {
      setStatus("loading");
      setError(null);

      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();
      if (sessionError || !sessionData.session?.user) {
        const message = "ログインが必要です。先にログインしてください。";
        setStatus("error");
        setError(message);
        notify(message, "error");
        return;
      }

      const currentUserId = sessionData.session.user.id;
       setAccessToken(sessionData.session.access_token ?? null);
      setUserId(currentUserId);
      const { data, error: fetchError } = await supabase
        .from("memos")
        .select(
          "id, title, content, category, tags, created_at, updated_at, user_id",
        )
        .eq("id", memoId)
        .eq("user_id", currentUserId)
        .single();

      if (fetchError || !data) {
        const message = "メモの取得に失敗しました。アクセス権限をご確認ください。";
        setStatus("error");
        setError(message);
        notify(message, "error");
        return;
      }

      setMemo(data);
      setDraftTitle(data.title ?? "");
      setDraftContent(data.content ?? "");
      setStatus("idle");
    };

    void fetchMemo();
  }, [memoId, notify]);

  const meta = useMemo(() => {
    if (!memo) return "";
    const dateText =
      memo.updated_at || memo.created_at
        ? new Date(memo.updated_at ?? memo.created_at ?? "").toLocaleString()
        : "";
    return dateText;
  }, [memo]);

  const emptyMessage = useMemo(() => {
    if (status === "loading") return "メモを読み込み中...";
    if (error) return error;
    return null;
  }, [status, error]);

  if (emptyMessage) {
    return (
      <section className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-900/5 backdrop-blur">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-semibold text-slate-900">メモ詳細</h1>
          <Link
            href="/memos"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            一覧に戻る
          </Link>
        </div>
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white/70 px-4 py-6 text-center text-sm text-slate-600">
          {emptyMessage}
        </div>
      </section>
    );
  }

  const handleSave = async () => {
    if (!userId) {
      const message = "ログインが必要です。先にログインしてください。";
      setStatus("error");
      setError(message);
      notify(message, "error");
      return;
    }
    setStatus("loading");
    const payload = {
      title: draftTitle.trim() || "無題のメモ",
      content: draftContent.trim(),
    };

    const { data, error: updateError } = await supabase
      .from("memos")
      .update(payload)
      .eq("id", memoId)
      .eq("user_id", userId)
      .select()
      .single();

    if (updateError || !data) {
      const message =
        "メモの更新に失敗しました。ネットワークと権限を確認してください。";
      setStatus("error");
      setError(message);
      notify(message, "error");
      return;
    }

    setMemo(data);
    setDraftTitle(data.title ?? "");
    setDraftContent(data.content ?? "");
    setIsEditing(false);
    setStatus("idle");
    notify("メモを更新しました。", "success");
  };

  const handleDelete = async () => {
    if (!userId) {
      const message = "ログインが必要です。先にログインしてください。";
      setError(message);
      notify(message, "error");
      return;
    }

    const confirmed = window.confirm("このメモを削除します。よろしいですか？");
    if (!confirmed) return;

    setIsDeleting(true);
    let deleteErrorMessage: string | null = null;

    if (accessToken) {
      try {
        const res = await fetch(`/api/memos/${memoId}`, {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          const text = data.error || res.statusText;
          deleteErrorMessage = text;
        }
      } catch (fetchError) {
        deleteErrorMessage =
          fetchError instanceof Error ? fetchError.message : "Fetch error";
      }
    }

    if (!deleteErrorMessage) {
      const { error: clientDeleteError } = await supabase
        .from("memos")
        .delete({ returning: "minimal" })
        .eq("id", memoId)
        .eq("user_id", userId);
      if (clientDeleteError) {
        deleteErrorMessage =
          clientDeleteError.message || "Supabase delete error";
      }
    }

    if (deleteErrorMessage) {
      const message =
        "メモの削除に失敗しました。ネットワークと権限を確認してください。" +
        (deleteErrorMessage ? ` (${deleteErrorMessage})` : "");
      setError(message);
      notify(message, "error");
      setIsDeleting(false);
      return;
    }

    notify("メモを削除しました。", "success");
    router.push("/memos");
  };

  return (
    <section className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-900/5 backdrop-blur">
      <div className="flex items-center justify-between gap-3">
        <div className="space-y-2">
          <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-slate-900/10">
            Memo Detail
          </p>
          <h1 className="text-3xl font-semibold tracking-tight text-slate-900">
            {memo?.title || "無題のメモ"}
          </h1>
          <div className="flex flex-wrap gap-2 text-xs font-semibold text-slate-600">
            {memo?.category ? (
              <span className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white">
                {memo.category}
              </span>
            ) : null}
            {(memo?.tags ?? []).map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-slate-100 px-3 py-1 shadow-inner shadow-white"
              >
                {tag}
              </span>
            ))}
          </div>
          <p className="text-xs text-slate-500">{meta}</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/memos"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
          >
            一覧に戻る
          </Link>
          <button
            type="button"
            onClick={handleDelete}
            disabled={isDeleting || status === "loading"}
            className="inline-flex items-center gap-2 rounded-full bg-rose-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-rose-900/10 transition hover:bg-rose-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isDeleting ? "削除中..." : "削除"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-inner shadow-white">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
            内容
          </span>
          {!isEditing ? (
            <button
              type="button"
              className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800"
              onClick={() => setIsEditing(true)}
            >
              編集
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                type="button"
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
                onClick={() => {
                  setIsEditing(false);
                  setDraftTitle(memo?.title ?? "");
                  setDraftContent(memo?.content ?? "");
                  setStatus("idle");
                  setError(null);
                }}
              >
                キャンセル
              </button>
              <button
                type="button"
                disabled={status === "loading"}
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-slate-900/10 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                onClick={handleSave}
              >
                {status === "loading" ? "保存中..." : "保存する"}
              </button>
            </div>
          )}
        </div>

        {!isEditing ? (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-inner">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={markdownComponents}
            >
              {memo?.content ?? ""}
            </ReactMarkdown>
          </div>
        ) : (
          <div className="space-y-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-inner">
            <div className="space-y-2">
              <label
                htmlFor="memo-title"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
              >
                タイトル
              </label>
              <input
                id="memo-title"
                value={draftTitle}
                onChange={(event) => setDraftTitle(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="無題のメモ"
              />
            </div>
            <div className="space-y-2">
              <label
                htmlFor="memo-content"
                className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-600"
              >
                本文
              </label>
              <textarea
                id="memo-content"
                value={draftContent}
                onChange={(event) => setDraftContent(event.target.value)}
                className="min-h-[240px] w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 font-mono text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="メモ本文を入力"
              />
            </div>
            <div className="space-y-2 rounded-lg border border-slate-200 bg-slate-50/80 p-3 text-xs text-slate-600">
              <p className="font-semibold text-slate-700">プレビュー</p>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={markdownComponents}
              >
                {draftContent || "本文を入力するとここに表示されます。"}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
