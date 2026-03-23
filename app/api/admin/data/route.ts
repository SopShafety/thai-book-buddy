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
    { count: uniqueUsers },
    { count: totalSaves },
    { count: totalBooks },
    { data: profileDemographics },
  ] = await Promise.all([
    supabase.from("publishers").select("id, name_th, name_en").limit(5000),
    supabase.from("user_selections").select("publisher_id, user_id").limit(50000),
    supabase.from("user_books").select("publisher_id, title").limit(50000),
    supabase.from("sessions").select("user_id, created_at").limit(50000),
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("user_selections").select("*", { count: "exact", head: true }),
    supabase.from("user_books").select("*", { count: "exact", head: true }),
    supabase.from("profiles").select("age, gender").not("age", "is", null).not("gender", "is", null).limit(50000),
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
    unique_users: uniqueUsers ?? 0,
    total_saves: totalSaves ?? 0,
    total_books: totalBooks ?? 0,
  };

  // Global demographics from profiles
  // age is stored as a string key from the onboarding form (e.g. "25_34", "55_plus")
  const AGE_KEY_ORDER = ["under_18", "18_24", "25_34", "35_44", "45_54", "55_plus"];
  const AGE_KEY_LABEL: Record<string, string> = {
    under_18: "<18",
    "18_24": "18-24",
    "25_34": "25-34",
    "35_44": "35-44",
    "45_54": "45-54",
    "55_plus": "55+",
  };

  const ageMap = new Map<string, number>();
  const genderMap = new Map<string, number>();
  for (const p of profileDemographics ?? []) {
    const ageKey = String(p.age);
    const gender = String(p.gender);
    ageMap.set(ageKey, (ageMap.get(ageKey) ?? 0) + 1);
    genderMap.set(gender, (genderMap.get(gender) ?? 0) + 1);
  }
  const demographics = {
    age: AGE_KEY_ORDER
      .filter((k) => ageMap.has(k))
      .map((k) => ({ value: AGE_KEY_LABEL[k] ?? k, count: ageMap.get(k)! })),
    gender: Array.from(genderMap.entries())
      .map(([value, count]) => ({ value, count }))
      .sort((a, b) => b.count - a.count),
  };

  // Top 10 books globally via RPC (avoids PostgREST max_rows cap on full-table scans)
  const { data: topBooksData } = await supabase.rpc("admin_get_top_books", { n: 10 });
  const top_books = (topBooksData ?? []).map((b: { title: string; count: number }) => ({
    title: b.title,
    count: Number(b.count),
  }));

  return NextResponse.json({ publishers: publisherStats, dau, totals, demographics, top_books });
}
