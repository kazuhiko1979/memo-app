import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabaseAdminClient";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing env NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_ANON_KEY",
  );
}

export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const authHeader = request.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null;

    if (!token) {
      return NextResponse.json(
        { error: "Unauthorized: missing bearer token" },
        { status: 401 },
      );
    }

    // 1) If service roleがあればRLSを無視して確実に削除
    if (supabaseAdmin) {
      const { data: userRes, error: userErr } =
        await supabaseAdmin.auth.getUser(token);
      if (userErr || !userRes.user) {
        return NextResponse.json(
          { error: "Unauthorized: invalid session" },
          { status: 401 },
        );
      }
      const { error: deleteError } = await supabaseAdmin
        .from("memos")
        .delete({ returning: "minimal" })
        .eq("id", id)
        .eq("user_id", userRes.user.id);
      if (deleteError) {
        return NextResponse.json(
          { error: `Delete failed (${deleteError.message})` },
          { status: 500 },
        );
      }
      return NextResponse.json({ success: true });
    }

    // 2) サービスロールなしのフォールバック: アクセストークンを使いRLSを通す
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    });

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();
    if (userError || !user) {
      return NextResponse.json(
        { error: "Unauthorized: invalid session" },
        { status: 401 },
      );
    }

    const { error: deleteError } = await supabase
      .from("memos")
      .delete({ returning: "minimal" })
      .eq("id", id)
      .eq("user_id", user.id);

    if (deleteError) {
      return NextResponse.json(
        { error: `Delete failed (${deleteError.message})` },
        { status: 500 },
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: `Server error (${message})` },
      { status: 500 },
    );
  }
}
