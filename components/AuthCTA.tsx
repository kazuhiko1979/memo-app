"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";

type AuthCTAProps = {
  className?: string;
};

export function AuthCTA({ className = "" }: AuthCTAProps) {
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

  if (email) {
    return (
      <div
        className={`flex flex-col gap-2 rounded-2xl border border-emerald-100 bg-emerald-50/80 px-4 py-3 text-sm text-emerald-800 shadow-inner shadow-white md:flex-row md:items-center md:justify-between ${className}`}
      >
        <div className="flex flex-col gap-1">
          <span className="text-xs font-semibold uppercase tracking-wide text-emerald-700">
            ログイン中
          </span>
          <span className="text-base font-semibold text-emerald-900">{email}</span>
          <span className="text-sm text-emerald-800">
            メモ作成・閲覧・検索はログイン中に利用できます。（機能は順次追加予定）
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex flex-wrap items-center gap-3 ${className}`}>
      <Link
        href="/login"
        className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow"
      >
        ログインして使う
      </Link>
      <Link
        href="/signup"
        className="rounded-full bg-slate-900 px-5 py-2 text-sm font-semibold text-white shadow-lg shadow-slate-900/15 transition hover:bg-slate-800"
      >
        アカウント作成
      </Link>
      <span className="text-xs text-slate-500">
        ログイン後にメモ作成・閲覧・検索が利用できます。
      </span>
    </div>
  );
}
