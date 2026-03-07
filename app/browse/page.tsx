"use client";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../utils/supabase";
import { useLIFF } from "../../providers/liff-providers";
import PublisherCard from "../../components/PublisherCard";
import BottomNav from "../../components/BottomNav";

interface Booth {
  zone: string;
  booth_number: string;
}

interface Publisher {
  id: string;
  name_th: string;
  name_en: string | null;
  category: string[];
  booths: Booth[];
}

export default function BrowsePage() {
  const { isLoggedIn, isLoading: authLoading } = useLIFF();
  const router = useRouter();

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [activeZone, setActiveZone] = useState<string>("ทั้งหมด");
  const [pubsLoaded, setPubsLoaded] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/");
  }, [authLoading, isLoggedIn, router]);

  // Fetch publishers immediately — they're public, no auth needed
  useEffect(() => {
    async function loadPublishers() {
      const CACHE_KEY = "publishers_cache";
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        setPublishers(JSON.parse(cached));
        setPubsLoaded(true);
      }
      const supabase = getSupabase();
      const { data: pubs } = await supabase
        .from("publishers")
        .select("id, name_th, name_en, category, booths(zone, booth_number)")
        .order("name_th");
      if (pubs) {
        setPublishers(pubs as Publisher[]);
        localStorage.setItem(CACHE_KEY, JSON.stringify(pubs));
      }
      setPubsLoaded(true);
    }
    loadPublishers();
  }, []);

  // Fetch user-specific data once auth is ready
  useEffect(() => {
    if (!isLoggedIn) return;
    async function loadUserData() {
      const supabase = getSupabase();
      const [{ data: user }, { data: sels }] = await Promise.all([
        supabase.auth.getUser(),
        supabase.from("user_selections").select("publisher_id"),
      ]);
      if (user?.user) setUserId(user.user.id);
      if (sels) setSelectedIds(new Set(sels.map((s: { publisher_id: string }) => s.publisher_id)));
      setUserLoaded(true);
    }
    loadUserData();
  }, [isLoggedIn]);

  // Distinct categories from publishers (strip "โซน" prefix for display)
  const categories = useMemo(() => {
    const set = new Set(publishers.flatMap((p) => p.category ?? []));
    const sorted = Array.from(set).sort((a, b) => {
      if (a.includes("Non-book")) return 1;
      if (b.includes("Non-book")) return -1;
      return a.localeCompare(b, "th");
    });
    return ["ทั้งหมด", ...sorted];
  }, [publishers]);

  // Filtered list
  const filtered = useMemo(() => {
    return publishers.filter((p) => {
      const matchSearch =
        !search ||
        p.name_th.toLowerCase().includes(search.toLowerCase()) ||
        (p.name_en ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeZone === "ทั้งหมด" ||
        p.category?.includes(activeZone);
      return matchSearch && matchCategory;
    });
  }, [publishers, search, activeZone]);

  async function handleToggle(publisherId: string) {
    if (!userId) return;

    const isSelected = selectedIds.has(publisherId);
    // Optimistic update first — instant UI response
    setSelectedIds((prev) => {
      const next = new Set(prev);
      isSelected ? next.delete(publisherId) : next.add(publisherId);
      return next;
    });

    const supabase = getSupabase();
    if (isSelected) {
      await supabase.from("user_selections").delete()
        .eq("user_id", userId).eq("publisher_id", publisherId);
    } else {
      await supabase.from("user_selections").insert({ user_id: userId, publisher_id: publisherId });
    }
  }

  if (!pubsLoaded) {
    return (
      <div className="flex w-full h-[100dvh] items-center justify-center bg-white">
        <p className="font-[family-name:var(--font-prompt)] text-gray-400 text-[18px]">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-white">
      {/* Header */}
      <div className="shrink-0 px-[16px] pt-[16px] pb-[12px] border-b border-gray-100">
        <p className="font-[family-name:var(--font-prompt)] font-semibold text-[20px] text-black mb-[12px]">
          สำนักพิมพ์
        </p>
        {/* Search */}
        <div className="flex items-center gap-[8px] h-[44px] px-[12px] rounded-[8px] bg-gray-100">
          <svg width="18" height="18" fill="none" viewBox="0 0 24 24" className="shrink-0">
            <circle cx="11" cy="11" r="7" stroke="#9ca3af" strokeWidth="2" />
            <path d="M16.5 16.5L21 21" stroke="#9ca3af" strokeWidth="2" strokeLinecap="round" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ค้นหาสำนักพิมพ์..."
            className="flex-1 bg-transparent font-[family-name:var(--font-prompt)] text-[15px] text-black placeholder-gray-400 outline-none"
          />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0 text-gray-400">
              <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>
          )}
        </div>
        {/* Category filter */}
        <div className="flex gap-[8px] mt-[10px] overflow-x-auto pb-[2px] no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveZone(cat)}
              className={`shrink-0 px-[12px] h-[30px] rounded-full text-[13px] font-[family-name:var(--font-prompt)] transition-all ${
                activeZone === cat
                  ? "bg-[#4f46e5] text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {cat.replace("โซน", "").trim()}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <div className="shrink-0 px-[16px] py-[8px]">
        <p className="font-[family-name:var(--font-prompt)] text-[13px] text-gray-400">
          {filtered.length} สำนักพิมพ์
          {selectedIds.size > 0 && ` · เลือกแล้ว ${selectedIds.size} แห่ง`}
        </p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="flex items-center justify-center h-[200px]">
            <p className="font-[family-name:var(--font-prompt)] text-gray-400 text-[15px]">ไม่พบสำนักพิมพ์</p>
          </div>
        ) : (
          filtered.map((p) => (
            <PublisherCard
              key={p.id}
              publisher={p}
              selected={selectedIds.has(p.id)}
              onToggle={handleToggle}
            />
          ))
        )}
      </div>

      <BottomNav />
    </div>
  );
}
