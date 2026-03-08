"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Heart } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../utils/supabase";
import { useLIFF } from "../../providers/liff-providers";
import PublisherCard from "../../components/PublisherCard";
import BottomNav from "../../components/BottomNav";
import BrandHeader from "../../components/BrandHeader";
import type { Publisher } from "../../types";

export default function BrowsePage() {
  const { isLoggedIn, isLoading: authLoading } = useLIFF();
  const router = useRouter();

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeZone, setActiveZone] = useState<string>("ทั้งหมด");
  const [pubsLoaded, setPubsLoaded] = useState(false);
  const [userLoaded, setUserLoaded] = useState(false);
  const togglingRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/");
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    const CACHE_KEY = "publishers_cache";
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    async function loadPublishers() {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, ts } = JSON.parse(cached);
        if (Date.now() - ts < CACHE_TTL) {
          setPublishers(data);
          setPubsLoaded(true);
        }
      }
      const supabase = getSupabase();
      const { data: pubs } = await supabase
        .from("publishers")
        .select("id, name_th, name_en, category, booths(zone, booth_number)")
        .order("name_th");
      if (pubs) {
        setPublishers(pubs as Publisher[]);
        localStorage.setItem(CACHE_KEY, JSON.stringify({ data: pubs, ts: Date.now() }));
      }
      setPubsLoaded(true);
    }
    loadPublishers();
  }, []);

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

  const categories = useMemo(() => {
    const set = new Set(publishers.flatMap((p) => p.category ?? []));
    const sorted = Array.from(set).sort((a, b) => {
      if (a.includes("Non-book")) return 1;
      if (b.includes("Non-book")) return -1;
      return a.localeCompare(b, "th");
    });
    return ["ทั้งหมด", ...sorted];
  }, [publishers]);

  const filtered = useMemo(() => {
    return publishers.filter((p) => {
      const matchSearch =
        !search ||
        p.name_th.toLowerCase().includes(search.toLowerCase()) ||
        (p.name_en ?? "").toLowerCase().includes(search.toLowerCase());
      const matchCategory =
        activeZone === "ทั้งหมด" || p.category?.includes(activeZone);
      return matchSearch && matchCategory;
    });
  }, [publishers, search, activeZone]);

  const totalBooths = useMemo(
    () => publishers.reduce((sum, p) => sum + (p.booths?.length ?? 0), 0),
    [publishers]
  );

  async function handleToggle(publisherId: string) {
    if (!userId || togglingRef.current.has(publisherId)) return;
    togglingRef.current.add(publisherId);
    const isSelected = selectedIds.has(publisherId);
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
    togglingRef.current.delete(publisherId);
  }

  if (!pubsLoaded) {
    return (
      <div className="flex w-full h-[100dvh] items-center justify-center bg-[#fafaf8]">
        <p className="font-[family-name:var(--font-prompt)] text-[#9c7a5b] text-[18px]">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8]">
      {/* Scrollable area — header scrolls away, search stays sticky */}
      <div className="flex-1 overflow-y-auto">
        {/* Header — scrolls away */}
        <div className="px-[16px] pt-[24px] pb-[12px]">
          <BrandHeader />
          <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
            รายชื่อผู้ออกบูธ
          </p>
          <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#6a7282] mt-[2px]">
            {totalBooths} บูธ
          </p>
        </div>

        {/* Sticky search + filter */}
        <div className="sticky top-0 z-10 bg-[#fafaf8]">
          {/* Search */}
          <div className="px-[16px] py-[12px]">
            <div className={`flex items-center gap-[9px] h-[48px] px-[12px] rounded-[16px] bg-[#fafaf8] border transition-colors ${
              searchFocused ? "border-[#973c00]" : "border-[#f0e4d4]"
            }`}>
              <Search size={20} color={searchFocused ? "#973c00" : "#746d67"} strokeWidth={1.8} className="shrink-0" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="ค้นหาสำนักพิมพ์..."
                className="flex-1 bg-transparent font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none"
              />
              {search && (
                <button onClick={() => setSearch("")} className="shrink-0 text-[#746d67]">
                  <X size={16} strokeWidth={2} />
                </button>
              )}
            </div>
          </div>

          {/* Category filter */}
          <div className="flex gap-[8px] px-[16px] pb-[12px] overflow-x-auto no-scrollbar">
            {categories.map((cat) => {
              const active = activeZone === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveZone(cat)}
                  className={`shrink-0 px-[12px] py-[4px] rounded-[20px] text-[14px] font-[family-name:var(--font-prompt)] transition-all ${
                    active
                      ? "bg-[#c4855a] text-[#fafaf8] font-semibold"
                      : "bg-[#fff8ee] border border-[#f0e4d4] text-[#9c7a5b] font-light"
                  }`}
                >
                  {cat.replace("โซน", "").trim()}
                </button>
              );
            })}
          </div>

          {/* Count row */}
          <div className="flex items-center justify-between px-[16px] pb-[12px]">
          <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#6a7282]">
            {filtered.length} สำนักพิมพ์
            {!userLoaded && isLoggedIn && (
              <span className="ml-[8px] text-[#9c7a5b]">· กำลังโหลด...</span>
            )}
          </p>
          {selectedIds.size > 0 && (
            <div className="flex items-center gap-[4px]">
              <Heart size={20} color="#dea0a0" strokeWidth={1.8} />
              <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#6a7282]">
                {selectedIds.size} รายการ
              </p>
            </div>
          )}
          </div>
        </div>

        {/* List */}
        <div className="flex flex-col gap-[16px] px-[16px] pb-[16px]">
          {filtered.length === 0 ? (
            <div className="flex items-center justify-center h-[200px]">
              <p className="font-[family-name:var(--font-prompt)] text-[#9c7a5b] text-[15px]">ไม่พบสำนักพิมพ์</p>
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
      </div>

      <BottomNav />
    </div>
  );
}
