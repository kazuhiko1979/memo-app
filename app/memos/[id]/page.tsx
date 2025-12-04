import { notFound } from "next/navigation";
import { AppHeader } from "@/components/AppHeader";
import { MemoDetail } from "@/components/memos/MemoDetail";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function MemoDetailPage({ params }: Props) {
  const { id } = await params;

  if (!id) {
    notFound();
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-50 via-white to-slate-100 text-slate-900">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-10 top-16 h-64 w-64 rounded-full bg-cyan-200/30 blur-3xl" />
        <div className="absolute right-10 top-32 h-72 w-72 rounded-full bg-indigo-200/30 blur-3xl" />
      </div>

      <AppHeader showNav />

      <main className="relative z-10 mx-auto flex max-w-4xl flex-col gap-8 px-6 pb-24 pt-12">
        <MemoDetail memoId={id} />
      </main>
    </div>
  );
}
