"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import { supabase } from "@/lib/supabaseClient";
import { useToast } from "@/components/ToastProvider";

type AppHeaderProps = {
  showNav?: boolean;
};

const navLinks = [
  { href: "#features", label: "機能" },
  { href: "#categories", label: "カテゴリ" },
  { href: "#tags", label: "タグ" },
  { href: "#markdown", label: "Markdown" },
];

export function AppHeader({ showNav = false }: AppHeaderProps) {
  const [email, setEmail] = useState<string | null>(null);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { notify } = useToast();

  useEffect(() => {
    const syncSession = async () => {
      const { data } = await supabase.auth.getSession();
      setEmail(data.session?.user.email ?? null);
    };

    void syncSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setEmail(session?.user.email ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    setIsSigningOut(true);
    const { error } = await supabase.auth.signOut();
    if (error) {
      notify("ログアウトに失敗しました。もう一度お試しください。", "error");
    } else {
      notify("ログアウトしました。", "success");
    }
    setIsSigningOut(false);
  };

  return (
    <header className="relative z-10 border-b border-slate-200/70 bg-white/60 backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-900 text-white shadow-lg shadow-slate-900/10">
            ✦
          </span>
          <div className="flex flex-col">
            <span className="text-sm font-medium text-slate-500">
              TagNote
            </span>
            <span className="text-lg font-semibold text-slate-900">
              Tag-driven Notes
            </span>
          </div>
        </Link>

        {showNav ? (
          <nav className="hidden items-center gap-6 text-sm font-medium text-slate-700 md:flex">
            {navLinks.map((link) => (
              <a key={link.href} className="hover:text-slate-900" href={link.href}>
                {link.label}
              </a>
            ))}
          </nav>
        ) : (
          <span aria-hidden className="hidden md:block" />
        )}

        <div className="flex items-center gap-3">
          {email ? (
            <>
              <span className="rounded-full bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-800 shadow-inner shadow-white">
                {email}
              </span>
              <button
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-800 shadow-sm transition hover:border-slate-300 hover:shadow disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSigningOut ? "ログアウト中..." : "ログアウト"}
              </button>
            </>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
}
