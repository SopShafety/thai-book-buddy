"use client";
import { useEffect, useRef, useState } from "react";
import { ChevronRight, X, Check, BookOpen, Pencil, NotebookPen, BookPlus } from "lucide-react";
import { getSupabase } from "../utils/supabase";
import BookForm from "./BookForm";
import type { Publisher, Book } from "../types";

interface Props {
  publisher: Publisher;
  pubBooks: Book[];
  isExpanded: boolean;
  note: string | undefined;
  userId: string | null;
  onToggleExpand: () => void;
  onRemove: () => void;
  onTogglePurchased: (book: Book) => void;
  onBookAdded: (book: Book) => void;
  onBookDeleted: (bookId: string) => void;
  onBookEdited: (bookId: string, title: string, price: number | null) => void;
  onNoteSaved: (publisherId: string, note: string | null) => void;
}

export default function PublisherListItem({
  publisher,
  pubBooks,
  isExpanded,
  note,
  userId,
  onToggleExpand,
  onRemove,
  onTogglePurchased,
  onBookAdded,
  onBookDeleted,
  onBookEdited,
  onNoteSaved,
}: Props) {
  const [isAdding, setIsAdding] = useState(false);
  const [newBook, setNewBook] = useState({ title: "", price: "" });
  const [saving, setSaving] = useState(false);
  const savingRef = useRef(false);
  const addFormRef = useRef<HTMLDivElement>(null);
  const [editingBookId, setEditingBookId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [isAddingNote, setIsAddingNote] = useState(false);
  const [noteInput, setNoteInput] = useState("");

  useEffect(() => {
    if (!isAdding) return;
    const t = setTimeout(() => {
      addFormRef.current?.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }, 300);
    return () => clearTimeout(t);
  }, [isAdding]);

  // Reset local form state when card collapses
  useEffect(() => {
    if (!isExpanded) {
      setIsAdding(false);
      setNewBook({ title: "", price: "" });
      setIsAddingNote(false);
      setNoteInput("");
      setEditingBookId(null);
      setEditTitle("");
      setEditPrice("");
    }
  }, [isExpanded]);

  const primaryBooth = publisher.booths?.[0]?.booth_number ?? "—";
  const isEditing = pubBooks.some((b) => b.id === editingBookId);

  async function addBook() {
    if (!userId || !newBook.title.trim() || savingRef.current) return;
    savingRef.current = true;
    setSaving(true);
    const parsed = parseInt(newBook.price, 10);
    const price = newBook.price.trim() && !isNaN(parsed) ? parsed : null;
    const supabase = getSupabase();
    const { data } = await supabase
      .from("user_books")
      .insert({ user_id: userId, publisher_id: publisher.id, title: newBook.title.trim(), price })
      .select()
      .single();
    if (data) onBookAdded(data as Book);
    setNewBook({ title: "", price: "" });
    setIsAdding(false);
    savingRef.current = false;
    setSaving(false);
  }

  function saveBookEdit() {
    if (!editTitle.trim() || !editingBookId) return;
    const parsedEdit = parseInt(editPrice, 10);
    const price = editPrice.trim() && !isNaN(parsedEdit) ? parsedEdit : null;
    onBookEdited(editingBookId, editTitle.trim(), price);
    setEditingBookId(null);
    setEditTitle("");
    setEditPrice("");
  }

  function deleteBook() {
    if (!editingBookId) return;
    const id = editingBookId;
    setEditingBookId(null);
    setEditTitle("");
    setEditPrice("");
    onBookDeleted(id);
  }

  function saveNote() {
    const trimmed = noteInput.trim();
    onNoteSaved(publisher.id, trimmed || null);
    setIsAddingNote(false);
    setNoteInput("");
  }

  return (
    <div className="bg-white border border-[#fff8ee] rounded-[16px] flex flex-col gap-[16px] p-[24px]">
      {/* Publisher row */}
      <div className="flex gap-[8px] items-start">
        {/* Toggle area — div avoids Safari iOS flex bug with button elements */}
        <div
          className="flex flex-[1_0_0] min-w-px gap-[16px] items-start cursor-pointer"
          onClick={onToggleExpand}
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
            <p className="font-[family-name:var(--font-sarabun)] font-medium text-[16px] text-[#3d2b1a] truncate w-full">
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
                <span className="font-[family-name:var(--font-sarabun)] font-light text-[12px] text-[#973c00]">
                  {pubBooks.length} เล่ม
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Remove button — visible when card is expanded */}
        {isExpanded && (
          <button
            onClick={onRemove}
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
            <BookForm
              formRef={addFormRef}
              title={newBook.title}
              price={newBook.price}
              onTitleChange={(v) => setNewBook((p) => ({ ...p, title: v }))}
              onPriceChange={(v) => setNewBook((p) => ({ ...p, price: v }))}
              onSave={addBook}
              onCancel={() => { setIsAdding(false); setNewBook({ title: "", price: "" }); }}
              saving={saving}
              layout="inline"
            />
          ) : isEditing ? (
            <BookForm
              title={editTitle}
              price={editPrice}
              onTitleChange={setEditTitle}
              onPriceChange={setEditPrice}
              onSave={saveBookEdit}
              onCancel={() => { setEditingBookId(null); setEditTitle(""); setEditPrice(""); }}
              onDelete={deleteBook}
              layout="stacked"
            />
          ) : (
            <>
              {/* Books list + note */}
              {(pubBooks.length > 0 || (note && !isAddingNote)) && (
                <div className="flex flex-col gap-[8px] bg-[#fff8ee] rounded-[8px] p-[12px]">
                  {pubBooks.map((book) => (
                    <div key={book.id} className="flex flex-col">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-[8px] min-w-0">
                          <button
                            onClick={() => onTogglePurchased(book)}
                            className={`shrink-0 size-[24px] rounded-full border-2 flex items-center justify-center transition-all ${
                              book.is_purchased ? "bg-[#8fad7a] border-[#8fad7a]" : "border-[#9c7a5b]"
                            }`}
                          >
                            {book.is_purchased && <Check size={12} color="white" strokeWidth={3} />}
                          </button>
                          <p className={`font-[family-name:var(--font-sarabun)] text-[16px] truncate ${book.is_purchased ? "line-through text-[#a6a09b]" : "text-[#6a7282]"}`}>
                            {book.title}
                          </p>
                        </div>
                        <div className="flex items-center gap-[8px] shrink-0 ml-[8px]">
                          {book.price != null && (
                            <p className={`font-[family-name:var(--font-jakarta)] text-[16px] ${book.is_purchased ? "line-through text-[#a6a09b]" : "text-[#6a7282]"}`}>
                              {book.price.toLocaleString()}
                            </p>
                          )}
                          {book.is_purchased ? (
                            <div className="shrink-0 size-[16px]" />
                          ) : (
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
                        <div className="shrink-0 size-[16px]" />
                      </div>
                      <div className="h-px bg-[#f0e4d4]" />
                    </div>
                  )}

                  {/* Note display */}
                  {note && !isAddingNote && (
                    <div className="flex flex-col gap-[4px]">
                      <div className="flex items-start justify-between">
                        <p className="font-[family-name:var(--font-sarabun)] font-medium text-[16px] text-[#6a7282]">โน้ต</p>
                        <button
                          onClick={() => { setIsAddingNote(true); setNoteInput(note); }}
                          className="shrink-0 text-[#9c7a5b] active:opacity-60 transition-opacity"
                        >
                          <Pencil size={16} strokeWidth={2} />
                        </button>
                      </div>
                      <p className="font-[family-name:var(--font-sarabun)] text-[16px] text-[#6a7282]">
                        {note}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Note form */}
              {isAddingNote && (
                <div className="flex flex-col gap-[4px]">
                  <div className={`flex h-[85px] items-start px-[12px] py-[8px] rounded-[16px] border bg-[#fafaf8] transition-colors ${noteInput.length > 0 ? "border-[#973c00]" : "border-[#f0e4d4]"}`}>
                    <textarea
                      value={noteInput}
                      onChange={(e) => setNoteInput(e.target.value.slice(0, 200))}
                      placeholder="จดโน้ต"
                      autoFocus
                      className="flex-1 resize-none bg-transparent font-[family-name:var(--font-sarabun)] font-light text-[14px] text-[#3d2b1a] placeholder-[#746d67] outline-none"
                    />
                  </div>
                  <p className="self-end font-[family-name:var(--font-sarabun)] font-light text-[12px] text-[#746d67]">
                    {noteInput.length}/200
                  </p>
                  <div className="flex gap-[8px]">
                    <button
                      onClick={saveNote}
                      className={`flex-1 h-[48px] rounded-[12px] font-[family-name:var(--font-sarabun)] text-[16px] text-white transition-colors ${noteInput.trim() ? "bg-[#c4855a]" : "bg-[#e2c9a6]"}`}
                    >
                      บันทึก
                    </button>
                    <button
                      onClick={() => { setIsAddingNote(false); setNoteInput(""); }}
                      className="flex-1 h-[48px] rounded-[12px] border border-[#e2c9a6] bg-[#fafaf8] font-[family-name:var(--font-sarabun)] text-[16px] text-[#c4855a]"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}

              {/* Action buttons row */}
              {!isAddingNote && (
                <div className="flex items-center justify-between">
                  {note ? (
                    <div className="flex flex-1 items-center justify-center gap-[4px]">
                      <NotebookPen size={20} color="#a6a09b" strokeWidth={1.8} />
                      <span className="font-[family-name:var(--font-sarabun)] text-[16px] text-[#a6a09b]">เพิ่มโน้ตแล้ว</span>
                    </div>
                  ) : (
                    <button
                      onClick={() => { setIsAddingNote(true); setNoteInput(""); }}
                      className="flex flex-1 items-center justify-center gap-[4px]"
                    >
                      <NotebookPen size={20} color="#c4855a" strokeWidth={1.8} />
                      <span className="font-[family-name:var(--font-sarabun)] text-[16px] text-[#c4855a]">เพิ่มโน้ต</span>
                    </button>
                  )}
                  <button
                    onClick={() => setIsAdding(true)}
                    className="flex flex-1 items-center justify-center gap-[4px]"
                  >
                    <BookPlus size={20} color="#c4855a" strokeWidth={1.8} />
                    <span className="font-[family-name:var(--font-sarabun)] text-[16px] text-[#c4855a]">เพิ่มหนังสือ</span>
                  </button>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
