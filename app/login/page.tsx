"use client";

import { FormEvent, useState } from "react";

import { AppHeader } from "@/components/AppHeader";
import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ToastProvider";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const { notify } = useToast();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");
    setError(null);
    setMessage(null);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/callback`
        : undefined;

    try {
      const { error: signInError } = await supabase.auth.signInWithOtp({
        email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: redirectTo,
        },
      });

      if (signInError) {
        setStatus("error");
        setError(signInError.message);
        notify("ログインメールの送信に失敗しました。", "error");
        return;
      }
    } catch (caughtError) {
      setStatus("error");
      const fallbackMessage =
        "ネットワークエラーが発生しました。接続設定を確認して再試行してください。";
      setError(
        caughtError instanceof Error
          ? `${fallbackMessage} (${caughtError.message})`
          : fallbackMessage,
      );
      notify("ネットワークエラーにより送信に失敗しました。", "error");
      return;
    }

    setStatus("sent");
    setMessage("ログイン用の確認メールを送信しました。受信箱をご確認ください。");
    notify("ログイン用の確認メールを送信しました。", "success");
  };

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
              Login
            </p>
            <h1 className="text-3xl font-semibold tracking-tight text-slate-900 md:text-4xl">
              メールリンクでログイン。
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-slate-600">
              登録済みのメールアドレス宛にログイン用リンクを送ります。
              クリックするとそのままログインされます。
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="grid gap-6 rounded-2xl border border-slate-200 bg-white/90 p-6 shadow-lg shadow-slate-900/5 backdrop-blur md:grid-cols-[2fr,3fr]"
          >
            <div className="space-y-3">
              <label
                htmlFor="email"
                className="text-sm font-semibold text-slate-800"
              >
                メールアドレス
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white/80 px-4 py-3 text-sm text-slate-900 shadow-inner shadow-white focus:border-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-200"
                placeholder="you@example.com"
              />
              <p className="text-sm text-slate-500">
                アカウント作成時に利用したメールアドレスをご入力ください。
                未登録の場合はアカウント作成を先に行ってください。
            </p>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-2xl bg-slate-50/80 p-4 text-sm text-slate-700">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                  パスワードレス
                </div>
                <p className="text-base font-semibold text-slate-900">
                  メールリンクを踏むだけでログインできます。
                </p>
                <ul className="list-disc space-y-1 pl-5 text-slate-600">
                  <li>セッションはブラウザに保存されます</li>
                  <li>リンクは短時間で期限切れになります</li>
                  <li>届かない場合は迷惑メールもご確認ください</li>
                </ul>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="submit"
                  disabled={!email || status === "loading"}
                  className="w-fit rounded-full bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "loading" ? "送信中..." : "ログインリンクを送信"}
                </button>
                <span className="text-xs text-slate-500">
                  アカウント作成がお済みでない場合は上部から移動できます。
                </span>
              </div>
              {message ? (
                <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-semibold text-emerald-800 shadow-inner shadow-white">
                  {message}
                </div>
              ) : null}
              {error ? (
                <div className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm font-semibold text-rose-700 shadow-inner shadow-white">
                  {error}
                </div>
              ) : null}
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}
