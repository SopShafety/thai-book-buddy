"use client";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Search, X, Heart, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSupabase } from "../../utils/supabase";
import { useLIFF } from "../../providers/liff-providers";
import PublisherCard from "../../components/PublisherCard";
import BottomNav from "../../components/BottomNav";
import BrandHeader from "../../components/BrandHeader";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorScreen from "../../components/ErrorScreen";
import type { Publisher } from "../../types";

export default function BrowsePage() {
  const { isLoggedIn, isLoading: authLoading } = useLIFF();
  const router = useRouter();

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [searchFocused, setSearchFocused] = useState(false);
  const [activeZone, setActiveZone] = useState<string>("ทั้งหมด");
  const [pubsLoaded, setPubsLoaded] = useState(false);
  const [pubsError, setPubsError] = useState(false);
  const [pubsRetryKey, setPubsRetryKey] = useState(0);
  const [userLoaded, setUserLoaded] = useState(false);
  const [bookCounts, setBookCounts] = useState<Map<string, number>>(new Map());
  const [confirmPublisherId, setConfirmPublisherId] = useState<string | null>(null);
  const togglingRef = useRef<Set<string>>(new Set());
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
    };
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/");
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    const CACHE_KEY = "publishers_cache";
    const CACHE_TTL = 60 * 60 * 1000; // 1 hour

    async function loadPublishers() {
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        try {
          const { data, ts } = JSON.parse(cached);
          if (Date.now() - ts < CACHE_TTL) {
            setPublishers(data);
            setPubsLoaded(true);
            return; // cache is fresh — skip network fetch
          }
        } catch {
          localStorage.removeItem(CACHE_KEY);
        }
      }
      try {
        const supabase = getSupabase();
        const { data: pubs, error } = await supabase
          .from("publishers")
          .select("id, name_th, name_en, category, booths(zone, booth_number)")
          .order("name_th");
        if (error) throw error;
        if (pubs) {
          setPublishers(pubs as Publisher[]);
          localStorage.setItem(CACHE_KEY, JSON.stringify({ data: pubs, ts: Date.now() }));
        }
      } catch {
        setPubsError(true);
      }
      setPubsLoaded(true);
    }
    loadPublishers();
  }, [pubsRetryKey]);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function loadUserData() {
      try {
        const supabase = getSupabase();
        const [{ data: user }, { data: sels }, { data: books }] = await Promise.all([
          supabase.auth.getUser(),
          supabase.from("user_selections").select("publisher_id"),
          supabase.from("user_books").select("publisher_id"),
        ]);
        if (user?.user) setUserId(user.user.id);
        if (sels) setSelectedIds(new Set(sels.map((s: { publisher_id: string }) => s.publisher_id)));
        if (books) {
          const counts = new Map<string, number>();
          for (const b of books as { publisher_id: string }[]) {
            counts.set(b.publisher_id, (counts.get(b.publisher_id) ?? 0) + 1);
          }
          setBookCounts(counts);
        }
      } catch {
        // Non-critical: list still works, user just won't see their selections
      }
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
    const q = debouncedSearch.toLowerCase();
    return publishers.filter((p) => {
      const matchSearch =
        !q ||
        p.name_th.toLowerCase().includes(q) ||
        (p.name_en ?? "").toLowerCase().includes(q);
      const matchCategory =
        activeZone === "ทั้งหมด" || p.category?.includes(activeZone);
      return matchSearch && matchCategory;
    });
  }, [publishers, debouncedSearch, activeZone]);

  const totalBooths = useMemo(
    () => publishers.reduce((sum, p) => sum + (p.booths?.length ?? 0), 0),
    [publishers]
  );

  const handleToggle = useCallback(async (publisherId: string) => {
    if (!userId || togglingRef.current.has(publisherId)) return;
    const isSelected = selectedIds.has(publisherId);
    if (isSelected && (bookCounts.get(publisherId) ?? 0) > 0) {
      setConfirmPublisherId(publisherId);
      return;
    }
    await doRemoveOrAdd(publisherId, isSelected);
  }, [userId, selectedIds, bookCounts]); // eslint-disable-line react-hooks/exhaustive-deps

  const doRemoveOrAdd = useCallback(async (publisherId: string, isSelected: boolean) => {
    togglingRef.current.add(publisherId);
    setSelectedIds((prev) => {
      const next = new Set(prev);
      isSelected ? next.delete(publisherId) : next.add(publisherId);
      return next;
    });
    if (!isSelected) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast("เพิ่มในรายการแล้ว");
      toastTimer.current = setTimeout(() => setToast(null), 2500);
    }
    const supabase = getSupabase();
    if (isSelected) {
      await supabase.from("user_selections").delete()
        .eq("user_id", userId!).eq("publisher_id", publisherId);
    } else {
      await supabase.from("user_selections").insert({ user_id: userId!, publisher_id: publisherId });
    }
    togglingRef.current.delete(publisherId);
  }, [userId]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!pubsLoaded) return <LoadingScreen />;
  if (pubsError) return <ErrorScreen onRetry={() => { setPubsError(false); setPubsLoaded(false); setPubsRetryKey((k) => k + 1); }} />;

  return (
    <div className="relative flex flex-col w-full h-[100dvh] bg-[#fafaf8]">
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
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
                  searchDebounceRef.current = setTimeout(() => setDebouncedSearch(e.target.value), 200);
                }}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="ค้นหาสำนักพิมพ์..."
                className="flex-1 bg-transparent font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none"
              />
              {search && (
                <button onClick={() => { setSearch(""); setDebouncedSearch(""); }} className="shrink-0 text-[#746d67]">
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
              <span className="ml-[8px] inline-flex items-center gap-[3px] translate-y-[1px]">
                {[0, 1, 2].map((i) => (
                  <span
                    key={i}
                    className="block size-[4px] rounded-full bg-[#9c7a5b]"
                    style={{ animation: `bounce-dot 1.2s ease-in-out ${i * 0.2}s infinite` }}
                  />
                ))}
              </span>
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

      {toast && (
        <div className="absolute bottom-[84px] left-[16px] right-[16px] z-20 animate-[toast-in_0.25s_ease-out]">
          <div className="flex items-center gap-[12px] h-[61px] px-[16px] bg-[#f0e4d4] border border-[#c4855a] rounded-[8px]">
            <div className="shrink-0 size-[20px] rounded-full bg-[#c4855a] flex items-center justify-center">
              <Check size={12} color="white" strokeWidth={3} />
            </div>
            <p className="font-[family-name:var(--font-prompt)] text-[16px] text-[#3d2b1a]">{toast}</p>
          </div>
        </div>
      )}

      {confirmPublisherId && (() => {
        const pub = publishers.find((p) => p.id === confirmPublisherId);
        const count = bookCounts.get(confirmPublisherId) ?? 0;
        return (
          <div className="absolute inset-0 z-30 flex items-end justify-center bg-black/40" onClick={() => setConfirmPublisherId(null)}>
            <div className="w-full bg-[#fafaf8] rounded-t-[24px] p-[24px] flex flex-col gap-[16px]" onClick={(e) => e.stopPropagation()}>
              <div className="flex flex-col gap-[8px]">
                <p className="font-[family-name:var(--font-prompt)] font-semibold text-[18px] text-[#3d2b1a]">
                  ลบสำนักพิมพ์นี้?
                </p>
                <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#6a7282]">
                  {pub?.name_th} มีหนังสือในรายการ {count} เล่ม หากลบสำนักพิมพ์นี้ หนังสือทั้งหมดจะถูกลบออกด้วย
                </p>
              </div>
              <div className="flex gap-[8px]">
                <button
                  onClick={async () => {
                    const id = confirmPublisherId;
                    setConfirmPublisherId(null);
                    await doRemoveOrAdd(id, true);
                  }}
                  className="flex-1 h-[48px] rounded-[12px] bg-[#c4855a] font-[family-name:var(--font-prompt)] text-[16px] text-white"
                >
                  ลบออก
                </button>
                <button
                  onClick={() => setConfirmPublisherId(null)}
                  className="flex-1 h-[48px] rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]"
                >
                  ยกเลิก
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      <BottomNav />
    </div>
  );
}
