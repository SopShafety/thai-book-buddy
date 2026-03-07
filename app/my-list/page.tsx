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
      <div className="flex w-full h-[100dvh] items-center justify-center bg-white">
        <p className="font-[family-name:var(--font-prompt)] text-gray-400 text-[18px]">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-[100dvh] bg-white">
      {/* Header */}
      <div className="shrink-0 px-[16px] pt-[16px] pb-[12px] border-b border-gray-100">
        <p className="font-[family-name:var(--font-prompt)] font-semibold text-[20px] text-black">
          รายการของฉัน
        </p>
        {publishers.length > 0 && (
          <div className="flex items-center justify-between mt-[8px]">
            <p className="font-[family-name:var(--font-prompt)] text-[13px] text-gray-400">
              {publishers.length} สำนักพิมพ์ · {books.length} รายการ
            </p>
            <p className="font-[family-name:var(--font-jakarta)] font-semibold text-[16px] text-[#4f46e5]">
              ฿{totalBudget.toLocaleString()}
            </p>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {publishers.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-[16px] px-[32px]">
            <p className="font-[family-name:var(--font-prompt)] text-gray-400 text-[16px] text-center">
              ยังไม่มีสำนักพิมพ์ในรายการ
            </p>
            <Link
              href="/browse"
              className="flex h-[48px] px-[24px] items-center justify-center rounded-[8px] bg-[#4f46e5]"
            >
              <span className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-white">
                ค้นหาสำนักพิมพ์
              </span>
            </Link>
          </div>
        ) : (
          publishers.map((publisher) => {
            const pubBooks = books.filter((b) => b.publisher_id === publisher.id);
            const isExpanded = expanded.has(publisher.id);
            const isAdding = addingFor === publisher.id;
            const booths = publisher.booths ?? [];

            return (
              <div key={publisher.id} className="border-b border-gray-100">
                {/* Publisher row */}
                <div className="flex items-center gap-[12px] px-[16px] py-[14px]">
                  <button
                    className="flex-1 min-w-0 text-left"
                    onClick={() => toggleExpand(publisher.id)}
                  >
                    <div className="flex items-center gap-[8px]">
                      <p className="font-[family-name:var(--font-prompt)] font-medium text-[16px] text-black truncate">
                        {publisher.name_th}
                      </p>
                      <svg
                        width="16" height="16" fill="none" viewBox="0 0 24 24"
                        className={`shrink-0 text-gray-400 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                      >
                        <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </div>
                    <div className="flex gap-[6px] mt-[4px] flex-wrap">
                      {booths.map((b) => (
                        <span key={b.booth_number} className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-[#4f46e5]/10 text-[#4f46e5] font-[family-name:var(--font-jakarta)] font-medium text-[12px]">
                          {b.booth_number}
                        </span>
                      ))}
                      {pubBooks.length > 0 && (
                        <span className="inline-flex items-center px-[8px] py-[2px] rounded-[4px] bg-gray-100 text-gray-500 font-[family-name:var(--font-prompt)] text-[12px]">
                          {pubBooks.length} รายการ · ฿{pubBooks.reduce((s, b) => s + (b.price ?? 0), 0).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </button>

                  {/* Remove publisher */}
                  <button
                    onClick={() => removePublisher(publisher.id)}
                    className="shrink-0 size-[32px] flex items-center justify-center rounded-full bg-gray-100 text-gray-400 active:scale-90 transition-all"
                  >
                    <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                      <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                    </svg>
                  </button>
                </div>

                {/* Expanded: books + add form */}
                {isExpanded && (
                  <div className="bg-gray-50 px-[16px] pb-[12px]">
                    {pubBooks.length === 0 && !isAdding && (
                      <p className="font-[family-name:var(--font-prompt)] text-[13px] text-gray-400 py-[8px]">
                        ยังไม่มีหนังสือในรายการ
                      </p>
                    )}

                    {/* Book list */}
                    {pubBooks.map((book) => (
                      <div key={book.id} className="flex items-center gap-[10px] py-[8px] border-b border-gray-100 last:border-0">
                        <button
                          onClick={() => togglePurchased(book)}
                          className={`shrink-0 size-[20px] rounded-full border-2 flex items-center justify-center transition-all ${
                            book.is_purchased ? "bg-[#4f46e5] border-[#4f46e5]" : "border-gray-300"
                          }`}
                        >
                          {book.is_purchased && (
                            <svg width="10" height="10" fill="none" viewBox="0 0 24 24">
                              <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                          )}
                        </button>
                        <p className={`flex-1 font-[family-name:var(--font-prompt)] text-[14px] ${book.is_purchased ? "line-through text-gray-400" : "text-black"}`}>
                          {book.title}
                        </p>
                        {book.price != null && (
                          <p className="font-[family-name:var(--font-jakarta)] text-[14px] text-gray-500 shrink-0">
                            ฿{book.price.toLocaleString()}
                          </p>
                        )}
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="shrink-0 text-gray-300 active:text-red-400 transition-colors"
                        >
                          <svg width="14" height="14" fill="none" viewBox="0 0 24 24">
                            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          </svg>
                        </button>
                      </div>
                    ))}

                    {/* Add book form */}
                    {isAdding ? (
                      <div className="flex flex-col gap-[8px] pt-[10px]">
                        <input
                          type="text"
                          value={newBook.title}
                          onChange={(e) => setNewBook((p) => ({ ...p, title: e.target.value }))}
                          placeholder="ชื่อหนังสือ"
                          autoFocus
                          className="h-[40px] w-full rounded-[8px] border border-gray-200 bg-white px-[12px] font-[family-name:var(--font-prompt)] text-[14px] outline-none focus:border-[#4f46e5]"
                        />
                        <div className="flex gap-[8px]">
                          <input
                            type="number"
                            inputMode="numeric"
                            value={newBook.price}
                            onChange={(e) => setNewBook((p) => ({ ...p, price: e.target.value }))}
                            placeholder="ราคา (บาท)"
                            className="h-[40px] flex-1 rounded-[8px] border border-gray-200 bg-white px-[12px] font-[family-name:var(--font-prompt)] text-[14px] outline-none focus:border-[#4f46e5]"
                          />
                          <button
                            onClick={() => addBook(publisher.id)}
                            disabled={saving || !newBook.title.trim()}
                            className="h-[40px] px-[16px] rounded-[8px] bg-[#4f46e5] text-white font-[family-name:var(--font-prompt)] text-[14px] disabled:opacity-50"
                          >
                            บันทึก
                          </button>
                          <button
                            onClick={() => { setAddingFor(null); setNewBook({ title: "", price: "" }); }}
                            className="h-[40px] px-[12px] rounded-[8px] bg-gray-100 text-gray-500 font-[family-name:var(--font-prompt)] text-[14px]"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => setAddingFor(publisher.id)}
                        className="flex items-center gap-[6px] mt-[8px] text-[#4f46e5] font-[family-name:var(--font-prompt)] text-[14px]"
                      >
                        <svg width="16" height="16" fill="none" viewBox="0 0 24 24">
                          <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        เพิ่มหนังสือ
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      <BottomNav />
    </div>
  );
}
