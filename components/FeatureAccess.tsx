"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

const featureCards = [
  {
    title: "メモを作成する",
    description: "カテゴリとタグを付けて新規メモを作成できます。",
  },
  {
    title: "メモを閲覧する",
    description: "ガラス質感のカードでメモを読みやすく表示します。",
  },
  {
    title: "メモを検索・フィルタ",
    description: "タグやカテゴリで素早く絞り込み、必要なメモにアクセス。",
  },
];

export function FeatureAccess() {
  const [email, setEmail] = useState<string | null>(null);

  useEffect(() => {
    const sync = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
    };
    void sync();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const isLoggedIn = Boolean(email);

  return (
    <section
      className="flex flex-col gap-4 rounded-3xl border border-white/70 bg-white/85 p-8 shadow-xl shadow-slate-900/5 backdrop-blur"
      aria-label="feature-access"
    >
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
            Access
          </p>
          <h2 className="text-2xl font-semibold text-slate-900">
            ログインしてメモ作成・閲覧・検索をはじめましょう。
          </h2>
          <p className="text-sm text-slate-600">
            アカウントがない場合は先に作成してください。ログイン後にすべての機能が利用できます。
          </p>
        </div>
        {!isLoggedIn ? (
          <div className="flex flex-wrap gap-3">
            <Link
              href="/login"
              className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
            >
              ログイン
            </Link>
            <Link
              href="/signup"
              className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
            >
              アカウント作成
            </Link>
          </div>
        ) : (
          <div className="rounded-full border border-emerald-100 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-800 shadow-inner shadow-white">
            ログイン中: {email}
          </div>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {featureCards.map((card) => (
          <div
            key={card.title}
            className="relative flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white/90 p-5 shadow-lg shadow-slate-900/5 backdrop-blur"
          >
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
              {!isLoggedIn ? (
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 shadow-inner shadow-white">
                  要ログイン
                </span>
              ) : (
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700 shadow-inner shadow-white">
                  ログイン中
                </span>
              )}
            </div>
            <p className="text-sm leading-relaxed text-slate-600">{card.description}</p>
            {!isLoggedIn ? (
              <Link
                href="/login"
                className="inline-flex w-fit items-center justify-center rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
              >
                ログインして使う
              </Link>
            ) : (
              <button
                type="button"
                disabled
                className="inline-flex w-fit items-center justify-center rounded-full bg-slate-900 px-4 py-2 text-xs font-semibold text-white opacity-70 shadow-lg shadow-slate-900/10"
              >
                機能は順次提供予定
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
