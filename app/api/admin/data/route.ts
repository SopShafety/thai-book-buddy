import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(req: NextRequest) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = adminClient();

  const [
    { data: publishers },
    { data: selections },
    { data: books },
    { data: sessions },
    { data: profiles },
  ] = await Promise.all([
    supabase.from("publishers").select("id, name_th, name_en"),
    supabase.from("user_selections").select("publisher_id, user_id"),
    supabase.from("user_books").select("publisher_id"),
    supabase.from("sessions").select("user_id, created_at"),
    supabase.from("profiles").select("id"),
  ]);

  // Unique savers per publisher
  const saversByPub = new Map<string, Set<string>>();
  for (const s of selections ?? []) {
    if (!saversByPub.has(s.publisher_id)) saversByPub.set(s.publisher_id, new Set());
    saversByPub.get(s.publisher_id)!.add(s.user_id);
  }

  // Book entries per publisher
  const booksByPub = new Map<string, number>();
  for (const b of books ?? []) {
    booksByPub.set(b.publisher_id, (booksByPub.get(b.publisher_id) ?? 0) + 1);
  }

  const publisherStats = (publishers ?? [])
    .map((p) => {
      const saves = saversByPub.get(p.id)?.size ?? 0;
      const booksAdded = booksByPub.get(p.id) ?? 0;
      return {
        id: p.id,
        name_th: p.name_th,
        name_en: p.name_en ?? null,
        saves,
        books_added: booksAdded,
        books_per_saver: saves > 0 ? Math.round((booksAdded / saves) * 10) / 10 : 0,
      };
    })
    .sort((a, b) => b.saves - a.saves);

  // DAU grouped by date (Bangkok timezone)
  const dauMap = new Map<string, Set<string>>();
  for (const s of sessions ?? []) {
    const date = new Date(s.created_at).toLocaleDateString("en-CA", {
      timeZone: "Asia/Bangkok",
    });
    if (!dauMap.has(date)) dauMap.set(date, new Set());
    dauMap.get(date)!.add(s.user_id);
  }
  const dau = Array.from(dauMap.entries())
    .map(([date, users]) => ({ date, count: users.size }))
    .sort((a, b) => a.date.localeCompare(b.date));

  const totals = {
    unique_users: (profiles ?? []).length,
    total_saves: selections?.length ?? 0,
    total_books: books?.length ?? 0,
  };

  return NextResponse.json({ publishers: publisherStats, dau, totals });
}
