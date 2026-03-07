"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getSupabase } from "../../utils/supabase";
import { useLIFF } from "../../providers/liff-providers";
import BottomNav from "../../components/BottomNav";

interface Booth {
  zone: string;
  booth_number: string;
}

interface Publisher {
  id: string;
  name_th: string;
  name_en: string | null;
  booths: Booth[];
}

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

  const totalBudget = books.reduce((sum, b) => sum + (b.price ?? 0), 0);

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

  async function removePublisher(publisherId: string) {
    if (!userId) return;
    setPublishers((prev) => prev.filter((p) => p.id !== publisherId));
    setBooks((prev) => prev.filter((b) => b.publisher_id !== publisherId));
    const supabase = getSupabase();
    await Promise.all([
      supabase.from("user_selections").delete().eq("user_id", userId).eq("publisher_id", publisherId),
      supabase.from("user_books").delete().eq("user_id", userId).eq("publisher_id", publisherId),
    ]);
  }

  async function addBook(publisherId: string) {
    if (!userId || !newBook.title.trim()) return;
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
    setSaving(false);
  }

  async function deleteBook(bookId: string) {
    setBooks((prev) => prev.filter((b) => b.id !== bookId));
    const supabase = getSupabase();
    await supabase.from("user_books").delete().eq("id", bookId);
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
    <div className="flex flex-col w-full h-[100dvh] bg-[#fafaf8]">
      <div className="flex-1 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col gap-[16px] px-[16px] pt-[24px] pb-[12px]">
          {/* Brand */}
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-[4px] mb-[4px]">
              <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3Z" fill="#8fad7a" />
                <path d="M19 16l.75 2.25L22 19l-2.25.75L19 22l-.75-2.25L16 19l2.25-.75L19 16Z" fill="#8fad7a" />
              </svg>
              <p className="font-[family-name:var(--font-jakarta)] font-bold text-[16px] text-[#8fad7a]">
                BookFair Buddy
              </p>
            </div>
            <p className="font-[family-name:var(--font-prompt)] font-semibold text-[32px] text-[#3d2b1a] leading-tight">
              รายการของฉัน
            </p>
          </div>

          {/* Summary card */}
          <div className="bg-[#f3ffeb] border border-[#c4d8b6] rounded-[16px] shadow-[3px_3px_0px_0px_#ebf1e6] p-[24px]">
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-[4px] items-center flex-1">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">จำนวนบูธ</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#e2c9a6] leading-none">
                  {publishers.length}
                </p>
              </div>
              <div className="w-px self-stretch bg-[#c4d8b6]" />
              <div className="flex flex-col gap-[4px] items-center flex-1">
                <p className="font-[family-name:var(--font-prompt)] font-light text-[12px] text-[#9c7a5b]">หนังสือ</p>
                <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[28px] text-[#e2c9a6] leading-none">
                  {books.length}
                </p>
              </div>
              <div className="w-px self-stretch bg-[#c4d8b6]" />
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
              const pubBooks = books.filter((b) => b.publisher_id === publisher.id);
              const isExpanded = expanded.has(publisher.id);
              const isAdding = addingFor === publisher.id;
              const primaryBooth = publisher.booths?.[0]?.booth_number ?? "—";

              return (
                <div
                  key={publisher.id}
                  className="bg-white border border-[#fff8ee] rounded-[16px] shadow-[3px_3px_0px_0px_#f0e4d4] flex flex-col gap-[16px] p-[24px]"
                >
                  {/* Publisher row */}
                  <div className="flex items-center gap-[16px]">
                    <button
                      className="flex flex-1 min-w-0 items-center gap-[16px]"
                      onClick={() => toggleExpand(publisher.id)}
                    >
                      {/* Booth number */}
                      <div className="shrink-0 w-[56px]">
                        <p className="font-[family-name:var(--font-jakarta)] font-extrabold text-[24px] text-[#3d2b1a] leading-none">
                          {primaryBooth}
                        </p>
                      </div>
                      {/* Name + chevron */}
                      <div className="flex items-center gap-[4px] min-w-0">
                        <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-[#3d2b1a] truncate">
                          {publisher.name_th}
                        </p>
                        <svg
                          width="20" height="20" fill="none" viewBox="0 0 24 24"
                          className={`shrink-0 text-[#9c7a5b] transition-transform ${isExpanded ? "rotate-180" : ""}`}
                        >
                          <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </div>
                    </button>

                    {/* Remove button */}
                    <button
                      onClick={() => removePublisher(publisher.id)}
                      className="shrink-0 size-[40px] flex items-center justify-center rounded-[14px] bg-[#fafaf8] border border-[#f0e4d4] shadow-[2px_2px_0px_0px_#e0d0c0] active:scale-90 transition-all"
                    >
                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                        <path d="M18 6L6 18M6 6l12 12" stroke="#9c7a5b" strokeWidth="2" strokeLinecap="round" />
                      </svg>
                    </button>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <>
                      <div className="h-px bg-[#f0e4d4]" />

                      {isAdding ? (
                        /* Add book form */
                        <div className="flex flex-col gap-[16px]">
                          <input
                            type="text"
                            value={newBook.title}
                            onChange={(e) => setNewBook((p) => ({ ...p, title: e.target.value }))}
                            placeholder="ชื่อหนังสือ"
                            autoFocus
                            className="h-[48px] w-full rounded-[16px] border bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] border-[#f0e4d4] transition-colors"
                          />
                          <input
                            type="number"
                            inputMode="numeric"
                            value={newBook.price}
                            onChange={(e) => setNewBook((p) => ({ ...p, price: e.target.value }))}
                            placeholder="ราคา (บาท)"
                            className="h-[48px] w-full rounded-[16px] border border-[#f0e4d4] bg-[#fafaf8] px-[12px] font-[family-name:var(--font-prompt)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none focus:border-[#973c00] transition-colors"
                          />
                          <div className="flex gap-[8px]">
                            <button
                              onClick={() => addBook(publisher.id)}
                              disabled={saving || !newBook.title.trim()}
                              className={`flex-1 h-[48px] rounded-[12px] border font-[family-name:var(--font-prompt)] text-[16px] text-white shadow-[2px_2px_0px_0px_#e0d0c0] transition-all ${
                                newBook.title.trim()
                                  ? "bg-[#c4855a] border-[#c4855a]"
                                  : "bg-[#e2c9a6] border-[#e2c9a6]"
                              }`}
                            >
                              บันทึก
                            </button>
                            <button
                              onClick={() => { setAddingFor(null); setNewBook({ title: "", price: "" }); }}
                              className="flex-1 h-[48px] rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-prompt)] text-[16px] text-[#c4855a] shadow-[2px_2px_0px_0px_#e0d0c0]"
                            >
                              ยกเลิก
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          {/* Books list */}
                          {pubBooks.length === 0 ? (
                            <p className="font-[family-name:var(--font-jakarta)] font-light text-[14px] text-[#9c7a5b] text-center">
                              ยังไม่มีหนังสือในรายการ
                            </p>
                          ) : (
                            <div className="flex flex-col gap-[8px] bg-[#fff8ee] rounded-[8px] p-[12px]">
                              {pubBooks.map((book) => (
                                <div key={book.id} className="flex items-center justify-between">
                                  <div className="flex items-center gap-[8px] min-w-0">
                                    <button
                                      onClick={() => togglePurchased(book)}
                                      className={`shrink-0 size-[20px] rounded-full border-2 flex items-center justify-center transition-all ${
                                        book.is_purchased ? "bg-[#8fad7a] border-[#8fad7a]" : "border-[#9c7a5b]"
                                      }`}
                                    >
                                      {book.is_purchased && (
                                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                                          <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
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
                                      <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                                      </svg>
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Add book button */}
                          <button
                            onClick={() => setAddingFor(publisher.id)}
                            className="flex items-center justify-center gap-[8px] h-[48px] w-full rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8]"
                          >
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
                              <path d="M12 5v14M5 12h14" stroke="#c4855a" strokeWidth="2" strokeLinecap="round" />
                            </svg>
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

      <BottomNav />
    </div>
  );
}
