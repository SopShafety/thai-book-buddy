import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function adminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
}

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  if (req.headers.get("x-admin-password") !== process.env.ADMIN_PASSWORD) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: publisherId } = await context.params;
  const supabase = adminClient();

  const [{ data: publisher }, { data: selections }, { data: books }] =
    await Promise.all([
      supabase
        .from("publishers")
        .select("id, name_th, name_en")
        .eq("id", publisherId)
        .single(),
      supabase
        .from("user_selections")
        .select("user_id")
        .eq("publisher_id", publisherId),
      supabase
        .from("user_books")
        .select("title")
        .eq("publisher_id", publisherId)
        .order("title"),
    ]);

  // Fetch demographics for users who saved this publisher
  const userIds = (selections ?? []).map((s) => s.user_id);
  let demographics: { age: string; gender: string; count: number }[] = [];

  if (userIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select("age, gender")
      .in("id", userIds)
      .not("age", "is", null)
      .not("gender", "is", null);

    const demoMap = new Map<string, number>();
    for (const p of profiles ?? []) {
      const key = `${p.age}__${p.gender}`;
      demoMap.set(key, (demoMap.get(key) ?? 0) + 1);
    }
    demographics = Array.from(demoMap.entries())
      .map(([key, count]) => {
        const [age, gender] = key.split("__");
        return { age, gender, count };
      })
      .sort((a, b) => b.count - a.count);
  }

  // Group book titles (freetext — duplicates possible)
  const titleMap = new Map<string, number>();
  for (const b of books ?? []) {
    const title = b.title?.trim() || "(ไม่มีชื่อ)";
    titleMap.set(title, (titleMap.get(title) ?? 0) + 1);
  }
  const bookList = Array.from(titleMap.entries())
    .map(([title, count]) => ({ title, count }))
    .sort((a, b) => b.count - a.count || a.title.localeCompare(b.title, "th"));

  return NextResponse.json({
    name_th: publisher?.name_th ?? "",
    name_en: publisher?.name_en ?? null,
    demographics,
    books: bookList,
  });
}
