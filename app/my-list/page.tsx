"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronRight, X, Plus, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "../../utils/supabase";
import { useLIFF } from "../../providers/liff-providers";
import BrandHeader from "../../components/BrandHeader";
import BottomNav from "../../components/BottomNav";
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
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const [addingFor, setAddingFor] = useState<string | null>(null);
  const [newBook, setNewBook] = useState<NewBookForm>({ title: "", price: "" });
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const [toast, setToast] = useState<{ message: string; onUndo: () => void } | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingAction = useRef<(() => Promise<void>) | null>(null);

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => {
    if (!authLoading && !isLoggedIn) router.replace("/");
  }, [authLoading, isLoggedIn, router]);

  useEffect(() => {
    if (!isLoggedIn) return;
    async function load() {
      const supabase = getSupabase();
      const [{ data: userData }, { data: sels }, { data: bookData }] = await Promise.all([
        supabase.auth.getUser(),
        supabase
          .from("user_selections")
          .select("publisher_id, publishers(id, name_th, name_en, booths(zone, booth_number))")
          .order("created_at"),
        supabase.from("user_books").select("id, publisher_id, title, price, is_purchased").order("created_at"),
      ]);
      if (userData?.user) setUserId(userData.user.id);
      if (sels) {
        setPublishers(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          sels.map((s: any) => Array.isArray(s.publishers) ? s.publishers[0] : s.publishers).filter(Boolean) as Publisher[]
        );
      }
      if (bookData) setBooks(bookData as Book[]);
      setLoading(false);
    }
    load();
  }, [isLoggedIn]);

  const totalBudget = useMemo(() => books.reduce((sum, b) => sum + (b.price ?? 0), 0), [books]);

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
    // Close add form if collapsing
    if (addingFor === publisherId) {
      setAddingFor(null);
      setNewBook({ title: "", price: "" });
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
    setPublishers((prev) => prev.filter((p) => p.id !== publisherId));
    setBooks((prev) => prev.filter((b) => b.publisher_id !== publisherId));
    showToast(
      "ลบรายการสำเร็จ",
      () => {
        cancelPending();
        setPublishers((prev) => { const next = [...prev]; next.splice(idx, 0, removed); return next; });
        setBooks((prev) => [...prev, ...removedBooks]);
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
    const price = newBook.price ? parseInt(newBook.price, 10) : null;
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

  async function togglePurchased(book: Book) {
    const updated = !book.is_purchased;
    setBooks((prev) => prev.map((b) => b.id === book.id ? { ...b, is_purchased: updated } : b));
    const supabase = getSupabase();
    await supabase.from("user_books").update({ is_purchased: updated }).eq("id", book.id);
  }

  if (authLoading || loading) {
    return (
      <div className="flex w-full h-[100dvh] items-center justify-center bg-[#fafaf8]">
        <p className="font-[family-name:var(--font-prompt)] text-[#9c7a5b] text-[18px]">กำลังโหลด...</p>
      </div>
    );
  }

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
          <div className="bg-[#eefdff] border border-[#b1dce4] rounded-[16px] p-[24px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[4px] items-center flex-1">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">จำนวนบูธ</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#e2c9a6] leading-none">
                  {publishers.length}
                </p>
              </div>
              <div className="w-px self-stretch bg-[#b1dce4]" />
              <div className="flex flex-col gap-[4px] items-center flex-1">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">หนังสือ</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#e2c9a6] leading-none">
                  {books.length}
                </p>
              </div>
              <div className="w-px self-stretch bg-[#b1dce4]" />
              <div className="flex flex-col gap-[4px] items-center flex-1">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">ราคา</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#c4855a] leading-none">
                  ฿{totalBudget.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

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
          ) : (
            publishers.map((publisher) => {
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
                  <div className={`flex gap-[8px] ${pubBooks.length > 0 ? "items-start" : "items-center"}`}>
                    {/* Toggle area — div avoids Safari iOS flex bug with button elements */}
                    <div
                      className={`flex flex-[1_0_0] min-w-px gap-[16px] cursor-pointer ${pubBooks.length > 0 ? "items-start" : "items-center"}`}
                      onClick={() => toggleExpand(publisher.id)}
                    >
                      {/* Chevron + Booth */}
                      <div className="flex items-center gap-[4px] shrink-0">
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
                        {pubBooks.length > 0 && (
                          <div className="inline-flex items-center px-[12px] py-[4px] rounded-[20px] bg-[#fff8ee]">
                            <span className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">
                              {pubBooks.length} เล่ม
                            </span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Remove button */}
                    <button
                      onClick={() => removePublisher(publisher.id)}
                      className="shrink-0 active:scale-90 transition-all"
                    >
                      <X size={24} color="#e2c9a6" strokeWidth={2} />
                    </button>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <>
                      <div className="h-px bg-[#f0e4d4]" />

                      {isAdding ? (
                        /* Add book form */
                        <div className="flex flex-col gap-[8px]">
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
                      ) : (
                        <>
                          {/* Books list */}
                          {pubBooks.length > 0 && (
                            <div className="flex flex-col gap-[8px] bg-[#fff8ee] rounded-[8px] p-[12px]">
                              {pubBooks.map((book) => (
                                <div key={book.id} className="flex items-center justify-between">
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
                                      <p className="font-[family-name:var(--font-jakarta)] text-[16px] text-[#6a7282]">
                                        ฿{book.price.toLocaleString()}
                                      </p>
                                    )}
                                    <button
                                      onClick={() => deleteBook(book.id)}
                                      className="text-[#9c7a5b] active:text-red-400 transition-colors"
                                    >
                                      <X size={24} strokeWidth={2} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add book button */}
                          <button
                            onClick={() => setAddingFor(publisher.id)}
                            className="flex items-center justify-center gap-[4px] w-full"
                          >
                            <Plus size={24} color="#c4855a" strokeWidth={2} />
                            <span className="font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a]">
                              เพิ่มหนังสือ
                            </span>
                          </button>
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
          <div className="flex items-center justify-between h-[61px] px-[16px] bg-[#f0e4d4] border border-[#c4855a] rounded-[8px] shadow-[3px_3px_0px_0px_#f0e4d4]">
            <p className="font-[family-name:var(--font-prompt)] text-[16px] text-[#3d2b1a]">{toast.message}</p>
            <button onClick={toast.onUndo}>
              <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#973c00]">นำกลับมา</p>
            </button>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
