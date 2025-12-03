"use client";

import { useEffect, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import Link from "next/link";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ToastProvider";

type AuthStatus = "loading" | "success" | "error";

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<AuthStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const { notify } = useToast();

  useEffect(() => {
    const clearAuthParams = () => {
      const url = new URL(window.location.href);
      url.hash = "";
      url.searchParams.delete("code");
      url.searchParams.delete("error_description");
      window.history.replaceState({}, "", url.toString());
    };

    const handleSession = async () => {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const queryParams = new URLSearchParams(window.location.search);
      const code = queryParams.get("code") ?? hashParams.get("code");
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      const errorDescription =
        queryParams.get("error_description") ??
        hashParams.get("error_description");

      if (errorDescription) {
        setStatus("error");
        setError(errorDescription);
        return;
      }

      if (code) {
        const { error: exchangeError } =
          await supabase.auth.exchangeCodeForSession(code);
        if (exchangeError) {
          setStatus("error");
          setError(exchangeError.message);
          notify("認証に失敗しました。リンクを再度お試しください。", "error");
          return;
        }
        clearAuthParams();
        setStatus("success");
        notify("ログインしました。", "success");
        return;
      }

      if (accessToken && refreshToken) {
        const { error: setSessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (setSessionError) {
          setStatus("error");
          setError(setSessionError.message);
          notify("認証に失敗しました。リンクを再度お試しください。", "error");
          return;
        }
        clearAuthParams();
        setStatus("success");
        notify("ログインしました。", "success");
        return;
      }

      const { data, error: sessionError } = await supabase.auth.getSession();
      if (sessionError) {
        setStatus("error");
        setError(sessionError.message);
        notify("認証状態の取得に失敗しました。", "error");
        return;
      }
      if (data.session) {
        setStatus("success");
        notify("ログインしました。", "success");
      } else {
        setStatus("error");
        setError("認証情報が見つかりませんでした。メールリンクを再送してください。");
        notify("認証情報が無効です。メールリンクを再送してください。", "error");
      }
    };

    void handleSession();
  }, []);

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-12 top-16 h-56 w-56 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-16 top-32 h-64 w-64 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <AppHeader />

      <main className="relative z-10 mx-auto flex max-w-6xl flex-col gap-10 px-6 pb-24 pt-12">
        <section className="flex flex-col gap-6 rounded-3xl border border-white/70 bg-white/80 p-8 shadow-xl shadow-slate-900/5 backdrop-blur-xl">
          <div className="space-y-2">
            <p className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-4 py-1 text-xs font-semibold uppercase tracking-wide text-white shadow-sm shadow-slate-900/10">
              Auth
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              {status === "success"
                ? "ログインが完了しました。"
                : status === "error"
                  ? "ログインに失敗しました。"
                  : "ログインを処理しています..."}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              メールのリンクから自動的にログイン処理を行います。
              完了後はトップに戻って操作を続けられます。
            </p>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur">
            {status === "loading" ? (
              <p className="text-sm text-slate-600">処理中です。少しお待ちください。</p>
            ) : null}
            {status === "success" ? (
              <div className="space-y-3">
                <p className="text-base font-semibold text-slate-900">
                  ログインが完了しました。
                </p>
                <p className="text-sm text-slate-600">
                  トップページに戻ってメモを開始できます。
                </p>
                <Link
                  href="/"
                  className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                >
                  トップに戻る
                </Link>
              </div>
            ) : null}
            {status === "error" && error ? (
              <div className="space-y-3">
                <p className="text-base font-semibold text-rose-700">
                  エラー: {error}
                </p>
                <p className="text-sm text-slate-600">
                  リンクが期限切れの場合は、ログイン/アカウント作成ページから再送してください。
                </p>
                <div className="flex flex-wrap gap-3">
                  <Link
                    href="/login"
                    className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
                  >
                    ログインに戻る
                  </Link>
                  <Link
                    href="/signup"
                    className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
                  >
                    アカウント作成する
                  </Link>
                </div>
              </div>
            ) : null}
          </div>
        </section>
      </main>
    </div>
  );
}
