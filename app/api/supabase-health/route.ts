import { NextResponse } from "next/server";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function GET() {
  if (!supabaseUrl) {
    return NextResponse.json(
      { ok: false, message: "Missing NEXT_PUBLIC_SUPABASE_URL" },
      { status: 500 }
    );
  }

  if (!supabaseAnonKey) {
    return NextResponse.json(
      { ok: false, message: "Missing NEXT_PUBLIC_SUPABASE_ANON_KEY" },
      { status: 500 }
    );
  }

  try {
    const res = await fetch(`${supabaseUrl}/auth/v1/health`, {
      headers: {
        apikey: supabaseAnonKey,
      },
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        {
          ok: false,
          message: "Supabase health endpoint returned non-200",
          status: res.status,
        },
        { status: 500 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      ok: true,
      supabaseUrl,
      authHealth: data,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { ok: false, message: "Failed to reach Supabase", error: message },
      { status: 500 }
    );
  }
}
