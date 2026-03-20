"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, X, Plus, Check, BookOpen, Pencil, Trash2, Search, NotebookPen, BookPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "../../utils/supabase";
import { useLIFF } from "../../providers/liff-providers";
import BrandHeader from "../../components/BrandHeader";
import BottomNav from "../../components/BottomNav";
import LoadingScreen from "../../components/LoadingScreen";
import ErrorScreen from "../../components/ErrorScreen";
import type { Publisher } from "../../types";

interface Book {
  id: string;
  publisher_id: string;
  title: string;
  price: number | null;
  is_purchased: boolean;
}

interface NewBookForm {
  title: string;
  price: string;
}

export default function MyListPage() {
  const { isLoggedIn, isLoading: authLoading } = useLIFF();
  const router = useRouter();

  const [publishers, setPublishers] = useState<Publisher[]>([]);
  const [books, setBooks] = useState<Book[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [retryKey, setRetryKey] = useState(0);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newBook, setNewBook] = useState<NewBookForm>({ title: "", price: "" });
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const addFormRef = useRef<HTMLDivElement>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState("");
  const [editTitle, setEditTitle] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [searchFocused, setSearchFocused] = useState(false);
  const searchDebounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [toast, setToast] = useState<{ message: string; onUndo: (() => void) | null } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAction = useRef<(() => Promise<void>) | null>(null);
  const [notesByPublisher, setNotesByPublisher] = useState<Map<string, string>>(new Map());
  const [addingNoteFor, setAddingNoteFor] = useState<string | null>(null);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      if (searchDebounceRef.current) clearTimeout(searchDebounceRef.current);
      // Commit any pending deletion immediately when navigating away
      if (pendingAction.current) { pendingAction.current(); pendingAction.current = null; }
    };
  }, []);

  useEffect(() => {
    if (!addingFor) return;
    // Wait for iOS keyboard to finish animating (~300ms) before scrolling
    const t = setTimeout(() => {
      addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
    return () => clearTimeout(t);
  }, [addingFor]);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/");
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;

    // Dev bypass: use mock data to preview UI without a Supabase session
    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH === "true") {
      setUserId("dev-user");
      setPublishers([
        { id: "p1", name_th: "สำนักพิมพ์แสงดาว", name_en: "Sangdao Publishing", booths: [{ zone: "A", booth_number: "A01" }] },
        { id: "p2", name_th: "นานมีบุ๊คส์", name_en: "Nanmeebooks", booths: [{ zone: "B", booth_number: "B12" }] },
        { id: "p3", name_th: "อมรินทร์", name_en: "Amarin", booths: [{ zone: "C", booth_number: "C05" }] },
      ]);
      setBooks([
        { id: "b1", publisher_id: "p1", title: "ดินแดนแห่งความฝัน", price: 280, is_purchased: false },
        { id: "b2", publisher_id: "p1", title: "มหาสมุทรและหุบเขาเล็กๆ", price: 320, is_purchased: true },
        { id: "b3", publisher_id: "p2", title: "Harry Potter", price: 450, is_purchased: false },
      ]);
      setNotesByPublisher(new Map([["p2", "อยากได้เล่ม special edition ถ้ามี"]]));
      setLoading(false);
      return;
    }

    async function load() {
      try {
        const supabase = getSupabase();
        const [{ data: userData }, { data: sels, error: selsError }, { data: bookData, error: bookError }] = await Promise.all([
          supabase.auth.getUser(),
          supabase
            .from("user_selections")
            .select("publisher_id, note, publishers(id, name_th, name_en, booths(zone, booth_number))")
            .order("created_at"),
          supabase.from("user_books").select("id, publisher_id, title, price, is_purchased").order("created_at"),
        ]);
        if (selsError) throw selsError;
        if (bookError) throw bookError;
        if (userData?.user) setUserId(userData.user.id);
        if (sels) {
          setPublishers(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (sels.map((s: any) => Array.isArray(s.publishers) ? s.publishers[0] : s.publishers).filter(Boolean) as Publisher[]).sort((a, b) => a.name_th.localeCompare(b.name_th, "th"))
          );
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const notesMap = new Map<string, string>(sels.filter((s: any) => s.note).map((s: any) => [s.publisher_id, s.note]));
          setNotesByPublisher(notesMap);
        }
        if (bookData) setBooks(bookData as Book[]);
      } catch {
        setLoadError(true);
      }
      setLoading(false);
    }
    load();
  }, [isLoggedIn, retryKey]);

  const totalBudget = useMemo(() => books.reduce((sum, b) => sum + (b.price ?? 0), 0), [books]);

  const filteredPublishers = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    if (!q) return publishers;
    return publishers.filter(
      (p) => p.name_th.toLowerCase().includes(q) || (p.name_en ?? "").toLowerCase().includes(q)
    );
  }, [publishers, debouncedSearch]);

  const booksByPublisher = useMemo(() => {
    const map = new Map<string, Book[]>();
    for (const b of books) {
      const list = map.get(b.publisher_id) ?? [];
      list.push(b);
      map.set(b.publisher_id, list);
    }
    return map;
  }, [books]);

  function toggleExpand(publisherId: string) {
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(publisherId) ? next.delete(publisherId) : next.add(publisherId);
      return next;
    });
    // Close add forms if collapsing
    if (addingFor === publisherId) {
      setAddingFor(null);
      setNewBook({ title: "", price: "" });
    }
    if (addingNoteFor === publisherId) {
      setAddingNoteFor(null);
      setNoteInput("");
    }
  }

  function cancelPending() {
    if (toastTimer.current) { clearTimeout(toastTimer.current); toastTimer.current = null; }
    pendingAction.current = null;
    setToast(null);
  }

  function commitPending() {
    if (toastTimer.current) { clearTimeout(toastTimer.current); toastTimer.current = null; }
    if (pendingAction.current) { pendingAction.current(); pendingAction.current = null; }
    setToast(null);
  }

  function showToast(message: string, onUndo: () => void, action: () => Promise<void>) {
    commitPending();
    pendingAction.current = action;
    setToast({ message, onUndo });
    toastTimer.current = setTimeout(async () => {
      await pendingAction.current?.();
      pendingAction.current = null;
      setToast(null);
    }, 4000);
  }

  function removePublisher(publisherId: string) {
    if (!userId) return;
    const idx = publishers.findIndex((p) => p.id === publisherId);
    const removed = publishers[idx];
    const removedBooks = books.filter((b) => b.publisher_id === publisherId);
    const removedNote = notesByPublisher.get(publisherId);
    setPublishers((prev) => prev.filter((p) => p.id !== publisherId));
    setBooks((prev) => prev.filter((b) => b.publisher_id !== publisherId));
    setNotesByPublisher((prev) => { const next = new Map(prev); next.delete(publisherId); return next; });
    showToast(
      "ลบรายการสำเร็จ",
      () => {
        cancelPending();
        setPublishers((prev) => { const next = [...prev]; next.splice(idx, 0, removed); return next; });
        setBooks((prev) => [...prev, ...removedBooks]);
        if (removedNote) setNotesByPublisher((prev) => { const next = new Map(prev); next.set(publisherId, removedNote); return next; });
      },
      async () => {
        const supabase = getSupabase();
        await Promise.all([
          supabase.from("user_selections").delete().eq("user_id", userId).eq("publisher_id", publisherId),
          supabase.from("user_books").delete().eq("user_id", userId).eq("publisher_id", publisherId),
        ]);
      }
    );
  }

  async function addBook(publisherId: string) {
    if (!userId || !newBook.title.trim() || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    const parsed = parseInt(newBook.price, 10);
    const price = newBook.price.trim() && !isNaN(parsed) ? parsed : null;
    const supabase = getSupabase();
    const { data } = await supabase
      .from("user_books")
      .insert({ user_id: userId, publisher_id: publisherId, title: newBook.title.trim(), price })
      .select()
      .single();
    if (data) setBooks((prev) => [...prev, data as Book]);
    setNewBook({ title: "", price: "" });
    setAddingFor(null);
    savingRef.current = false;
    setSaving(false);
  }

  function deleteBook(bookId: string) {
    const idx = books.findIndex((b) => b.id === bookId);
    const removed = books[idx];
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    showToast(
      "ลบหนังสือสำเร็จ",
      () => {
        cancelPending();
        setBooks((prev) => { const next = [...prev]; next.splice(idx, 0, removed); return next; });
      },
      async () => {
        const supabase = getSupabase();
        await supabase.from("user_books").delete().eq("id", bookId);
      }
    );
  }

  async function saveNote(publisherId: string) {
    const trimmed = noteInput.trim();
    setNotesByPublisher((prev) => {
      const next = new Map(prev);
      if (trimmed) next.set(publisherId, trimmed);
      else next.delete(publisherId);
      return next;
    });
    setAddingNoteFor(null);
    setNoteInput("");
    if (process.env.NEXT_PUBLIC_DEV_BYPASS_AUTH !== "true" && userId) {
      const supabase = getSupabase();
      await supabase.from("user_selections").update({ note: trimmed || null }).eq("user_id", userId).eq("publisher_id", publisherId);
    }
  }

  async function saveBookEdit(bookId: string) {
    if (!editTitle.trim()) return;
    const parsedEdit = parseInt(editPrice, 10);
    const price = editPrice.trim() && !isNaN(parsedEdit) ? parsedEdit : null;
    const title = editTitle.trim();
    setBooks((prev) => prev.map((b) => b.id === bookId ? { ...b, title, price } : b));
    setEditingBookId(null);
    setEditPrice("");
    setEditTitle("");
    const supabase = getSupabase();
    await supabase.from("user_books").update({ title, price }).eq("id", bookId);
  }

  async function togglePurchased(book: Book) {
    const updated = !book.is_purchased;
    setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, is_purchased: updated } : b));
    if (updated) {
      if (toastTimer.current) clearTimeout(toastTimer.current);
      setToast({ message: "ซื้อหนังสือแล้ว 🎉", onUndo: null });
      toastTimer.current = setTimeout(() => setToast(null), 2500);
    }
    const supabase = getSupabase();
    await supabase.from("user_books").update({ is_purchased: updated }).eq("id", book.id);
  }

  if (authLoading || loading) return <LoadingScreen />;
  if (loadError) return <ErrorScreen onRetry={() => { setLoadError(false); setLoading(true); setRetryKey((k) => k + 1); }} />;

  return (
    <div className="relative flex flex-col w-full h-[100dvh] bg-[#fafaf8]">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-[16px] px-[16px] pt-[24px] pb-[12px]">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <BrandHeader />
            <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
              รายการของฉัน
            </p>
          </div>

          {/* Summary card */}
          <div className="bg-[#f3ffeb] border border-[#c4d8b6] rounded-[16px] p-[24px]">
            <div className="flex items-center justify-between w-full">
              <div className="flex flex-col gap-[4px] items-center shrink-0">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">จำนวนบูธ</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#e2c9a6] leading-none">
                  {publishers.length}
                </p>
              </div>
              <div className="w-px h-[57px] bg-[#c4d8b6] shrink-0" />
              <div className="flex flex-col gap-[4px] items-center shrink-0 w-[64px]">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">หนังสือ</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#e2c9a6] leading-none text-center">
                  {books.length}
                </p>
              </div>
              <div className="w-px h-[57px] bg-[#c4d8b6] shrink-0" />
              <div className="flex flex-col gap-[4px] items-center shrink-0">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">ราคา</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#c4855a] leading-none">
                  ฿{totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sticky search + count row */}
        {publishers.length > 0 && (
          <div className="sticky top-0 z-10 bg-[#fafaf8] px-[16px] pt-[12px] pb-[8px] flex flex-col gap-[8px]">
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
            <div className="flex items-center justify-between px-[4px]">
              <p className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#6a7282]">
                {filteredPublishers.length} สำนักพิมพ์
              </p>
              <button
                onClick={() => {
                  const allExpanded = publishers.every((p) => expanded.has(p.id));
                  setExpanded(allExpanded ? new Set() : new Set(publishers.map((p) => p.id)));
                }}
                className="font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#9c7a5b] active:opacity-60 transition-opacity"
              >
                {publishers.every((p) => expanded.has(p.id)) ? "ย่อทั้งหมด" : "ขยายทั้งหมด"}
              </button>
            </div>
          </div>
        )}

        {/* Publisher list */}
        <div className="flex flex-col gap-[16px] px-[16px] py-[12px]">
          {publishers.length === 0 ? (
            <div className="flex flex-col items-center justify-center gap-[16px] py-[48px]">
              <p className="font-[family-name:var(--font-prompt)] text-[#9c7a5b] text-[16px] text-center">
                ยังไม่มีสำนักพิมพ์ในรายการ
              </p>
              <Link
                href="/browse"
                className="flex h-[48px] px-[24px] items-center justify-center rounded-[12px] bg-[#c4855a] shadow-[2px_2px_0px_0px_#e0d0c0]"
              >
                <span className="font-[family-name:var(--font-prompt)] text-[16px] text-white">
                  ค้นหาสำนักพิมพ์
                </span>
              </Link>
            </div>
          ) : filteredPublishers.length === 0 ? (
            <div className="flex items-center justify-center py-[48px]">
              <p className="font-[family-name:var(--font-prompt)] text-[#9c7a5b] text-[15px]">ไม่พบสำนักพิมพ์</p>
            </div>
          ) : (
            filteredPublishers.map((publisher) => {
              const pubBooks = booksByPublisher.get(publisher.id) ?? [];
              const isExpanded = expanded.has(publisher.id);
              const isAdding = addingFor === publisher.id;
              const primaryBooth = publisher.booths?.[0]?.booth_number ?? "—";

              return (
                <div
                  key={publisher.id}
                  className="bg-white border border-[#fff8ee] rounded-[16px] flex flex-col gap-[16px] p-[24px]"
                >
                  {/* Publisher row */}
                  <div className="flex gap-[8px] items-start">
                    {/* Toggle area — div avoids Safari iOS flex bug with button elements */}
                    <div
                      className="flex flex-[1_0_0] min-w-px gap-[16px] items-start cursor-pointer"
                      onClick={() => toggleExpand(publisher.id)}
                    >
                      {/* Chevron + Booth */}
                      <div className="flex items-start gap-[4px] shrink-0">
                        <ChevronRight
                          size={24}
                          className={`shrink-0 text-[#9c7a5b] transition-transform ${isExpanded ? "-rotate-90" : ""}`}
                        />
                        <div className="w-[56px]">
                          <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[24px] text-[#3d2b1a] leading-none">
                            {primaryBooth}
                          </p>
                        </div>
                      </div>
                      {/* Name + book count badge */}
                      <div className="flex flex-[1_0_0] min-w-px flex-col items-start gap-[4px]">
                        <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#3d2b1a] truncate w-full">
                          {publisher.name_th}
                        </p>
                        {publisher.name_en && (
                          <p className="font-[family-name:var(--font-jakarta)] font-light text-[12px] text-[#3d2b1a] truncate w-full">
                            {publisher.name_en}
                          </p>
                        )}
                        {pubBooks.length > 0 && !isExpanded && (
                          <div className="inline-flex items-center gap-[4px] px-[12px] py-[4px] rounded-[20px] bg-[#f0e4d4]">
                            <BookOpen size={16} color="#973c00" strokeWidth={1.5} />
                            <span className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#973c00]">
                              {pubBooks.length} เล่ม
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remove button — visible when card is expanded */}
                    {isExpanded && (
                      <button
                        onClick={() => removePublisher(publisher.id)}
                        className="shrink-0 size-[32px] rounded-[20px] bg-[#fff8ee] flex items-center justify-center active:scale-90 transition-all"
                      >
                        <X size={16} color="#e2c9a6" strokeWidth={2} />
                      </button>
                    )}
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <>
                      <div className="h-px bg-[#f0e4d4]" />

                      {isAdding ? (
                        /* Add book form */
                        <div ref={addFormRef} className="flex flex-col gap-[8px]">
                          <input
                            type="text"
                            value={newBook.title}
                            onChange={(e) => setNewBook((p) => ({ ...p, title: e.target.value }))}
                            placeholder="ชื่อหนังสือ"
                            autoFocus
                            className="h-[48px] w-full rounded-[16px] border bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] border-[#f0e4d4] transition-colors"
                          />
                          <div className="flex gap-[8px] items-start">
                            <input
                              type="number"
                              inputMode="numeric"
                              value={newBook.price}
                              onChange={(e) => setNewBook((p) => ({ ...p, price: e.target.value }))}
                              placeholder="ราคา (บาท)"
                              className="flex-1 min-w-0 h-[48px] rounded-[16px] border border-[#f0e4d4] bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] transition-colors"
                            />
                            <div className="flex shrink-0 gap-[8px]">
                              <button
                                onClick={() => addBook(publisher.id)}
                                disabled={saving || !newBook.title.trim()}
                                className={`shrink-0 h-[48px] px-[17px] py-px rounded-[12px] border font-[family-name:var(--font-prompt)] text-[16px] text-white transition-all ${
                                  newBook.title.trim()
                                    ? "bg-[#c4855a] border-[#c4855a]"
                                    : "bg-[#e2c9a6] border-[#e2c9a6]"
                                }`}
                              >
                                บันทึก
                              </button>
                              <button
                                onClick={() => { setAddingFor(null); setNewBook({ title: "", price: "" }); }}
                                className="shrink-0 h-[48px] px-[17px] py-px rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]"
                              >
                                ยกเลิก
                              </button>
                            </div>
                          </div>
                        </div>
                      ) : pubBooks.some((b) => b.id === editingBookId) ? (
                        /* Edit book form — takes over card content */
                        <div className="flex flex-col gap-[8px]">
                          <input
                            type="text"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            placeholder="ชื่อหนังสือ"
                            autoFocus
                            className="h-[48px] w-full rounded-[16px] border bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] border-[#f0e4d4] transition-colors"
                          />
                          <input
                            type="number"
                            inputMode="numeric"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            placeholder="ราคา (บาท)"
                            className="h-[48px] w-full rounded-[16px] border border-[#f0e4d4] bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] transition-colors"
                          />
                          <div className="flex gap-[8px]">
                            <button
                              onClick={() => saveBookEdit(editingBookId!)}
                              disabled={!editTitle.trim()}
                              className={`flex-1 h-[48px] rounded-[12px] border font-[family-name:var(--font-prompt)] text-[16px] text-white transition-colors ${editTitle.trim() ? "bg-[#c4855a] border-[#c4855a]" : "bg-[#e2c9a6] border-[#e2c9a6]"}`}
                            >
                              บันทึก
                            </button>
                            <button
                              onClick={() => { setEditingBookId(null); setEditPrice(""); setEditTitle(""); }}
                              className="flex-1 h-[48px] rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]"
                            >
                              ยกเลิก
                            </button>
                          </div>
                          <div className="h-px bg-[#f0e4d4]" />
                          <button
                            onClick={() => { deleteBook(editingBookId!); setEditingBookId(null); setEditPrice(""); setEditTitle(""); }}
                            className="flex items-center justify-center gap-[4px] w-full active:opacity-60 transition-opacity"
                          >
                            <Trash2 size={20} color="#df442b" strokeWidth={1.8} />
                            <span className="font-[family-name:var(--font-prompt)] text-[16px] text-[#df442b]">ลบรายการ</span>
                          </button>
                        </div>
                      ) : (
                        <>
                          {/* Books list + note */}
                          {(pubBooks.length > 0 || (notesByPublisher.has(publisher.id) && addingNoteFor !== publisher.id)) && (
                            <div className="flex flex-col gap-[8px] bg-[#fff8ee] rounded-[8px] p-[12px]">
                              {pubBooks.map((book) => (
                                <div key={book.id} className="flex flex-col">
                                  {/* Normal book row */}
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-[8px] min-w-0">
                                      <button
                                        onClick={() => togglePurchased(book)}
                                        className={`shrink-0 size-[24px] rounded-full border-2 flex items-center justify-center transition-all ${
                                          book.is_purchased ? "bg-[#8fad7a] border-[#8fad7a]" : "border-[#9c7a5b]"
                                        }`}
                                      >
                                        {book.is_purchased && (
                                          <Check size={12} color="white" strokeWidth={3} />
                                        )}
                                      </button>
                                      <p className={`font-[family-name:var(--font-jakarta)] text-[16px] truncate ${book.is_purchased ? "line-through text-[#a6a09b]" : "text-[#6a7282]"}`}>
                                        {book.title}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-[8px] shrink-0 ml-[8px]">
                                      {book.price != null && (
                                        <p className={`font-[family-name:var(--font-jakarta)] text-[16px] ${book.is_purchased ? "line-through text-[#a6a09b]" : "text-[#6a7282]"}`}>
                                          ฿{book.price.toLocaleString()}
                                        </p>
                                      )}
                                      {!book.is_purchased && (
                                        <button
                                          onClick={() => { setEditingBookId(book.id); setEditPrice(book.price != null ? String(book.price) : ""); setEditTitle(book.title); }}
                                          className="text-[#9c7a5b] active:opacity-60 transition-opacity"
                                        >
                                          <Pencil size={16} strokeWidth={2} />
                                        </button>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                              {/* Per-publisher subtotal */}
                              {pubBooks.some((b) => b.price != null) && (
                                <div className="flex flex-col gap-[8px] pt-[4px]">
                                  <div className="h-px bg-[#f0e4d4]" />
                                  <div className="flex gap-[8px] items-center justify-end">
                                    <span className="font-[family-name:var(--font-jakarta)] text-[16px] text-[#6a7282]">รวม</span>
                                    <span className="font-[family-name:var(--font-jakarta)] font-semibold text-[16px] text-[#6a7282]">
                                      {pubBooks.reduce((sum, b) => sum + (b.price ?? 0), 0).toLocaleString()}
                                    </span>
                                  </div>
                                </div>
                              )}
                              {/* Note display — inside the book container */}
                              {notesByPublisher.has(publisher.id) && (
                                <div className="flex gap-[8px] items-start">
                                  <p className="flex-1 font-[family-name:var(--font-jakarta)] text-[12px] text-[#6a7282] min-w-0">
                                    {notesByPublisher.get(publisher.id)}
                                  </p>
                                  <button
                                    onClick={() => { setAddingNoteFor(publisher.id); setNoteInput(notesByPublisher.get(publisher.id) ?? ""); }}
                                    className="shrink-0 text-[#9c7a5b] active:opacity-60 transition-opacity"
                                  >
                                    <Pencil size={16} strokeWidth={2} />
                                  </button>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Note form */}
                          {addingNoteFor === publisher.id && (
                            <div className="flex flex-col gap-[4px]">
                              <div className={`flex h-[85px] items-start px-[12px] py-[8px] rounded-[16px] border bg-[#fafaf8] transition-colors ${noteInput.length > 0 ? "border-[#973c00]" : "border-[#f0e4d4]"}`}>
                                <textarea
                                  value={noteInput}
                                  onChange={(e) => setNoteInput(e.target.value.slice(0, 200))}
                                  placeholder="จดโน้ต"
                                  autoFocus
                                  className="flex-1 resize-none bg-transparent font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none"
                                />
                              </div>
                              <p className="self-end font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#746d67]">
                                {noteInput.length}/200
                              </p>
                              <div className="flex gap-[8px]">
                                <button
                                  onClick={() => saveNote(publisher.id)}
                                  className={`flex-1 h-[48px] rounded-[12px] font-[family-name:var(--font-prompt)] text-[16px] text-white transition-colors ${noteInput.trim() ? "bg-[#c4855a]" : "bg-[#e2c9a6]"}`}
                                >
                                  บันทึก
                                </button>
                                <button
                                  onClick={() => { setAddingNoteFor(null); setNoteInput(""); }}
                                  className="flex-1 h-[48px] rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]"
                                >
                                  ยกเลิก
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Action buttons row */}
                          {!addingNoteFor && (
                            <div className="flex items-center justify-between">
                              {!notesByPublisher.has(publisher.id) && (
                                <button
                                  onClick={() => { setAddingNoteFor(publisher.id); setNoteInput(""); }}
                                  className="flex flex-1 items-center justify-center gap-[4px]"
                                >
                                  <NotebookPen size={20} color="#c4855a" strokeWidth={1.8} />
                                  <span className="font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]">เพิ่มโน้ต</span>
                                </button>
                              )}
                              <button
                                onClick={() => setAddingFor(publisher.id)}
                                className="flex flex-1 items-center justify-center gap-[4px]"
                              >
                                <BookPlus size={20} color="#c4855a" strokeWidth={1.8} />
                                <span className="font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]">เพิ่มหนังสือ</span>
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>

      {toast && (
        <div className="absolute bottom-[84px] left-[16px] right-[16px] z-20 animate-[toast-in_0.25s_ease-out]">
          <div className="flex items-center justify-between h-[61px] px-[16px] bg-[#f0e4d4] border border-[#c4855a] rounded-[8px]">
            <div className="flex items-center gap-[8px]">
              {toast.onUndo && <Trash2 size={18} color="#973c00" strokeWidth={2} />}
              <p className="font-[family-name:var(--font-prompt)] text-[16px] text-[#3d2b1a]">{toast.message}</p>
            </div>
            {toast.onUndo && (
              <button onClick={toast.onUndo}>
                <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#973c00]">นำกลับมา</p>
              </button>
            )}
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
