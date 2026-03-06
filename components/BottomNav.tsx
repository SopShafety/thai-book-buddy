"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/browse",
    label: "ค้นหา",
    icon: (active: boolean) => (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke={active ? "#4f46e5" : "#9ca3af"} strokeWidth="2" />
        <path d="M16.5 16.5L21 21" stroke={active ? "#4f46e5" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/my-list",
    label: "รายการของฉัน",
    icon: (active: boolean) => (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M5 5h14M5 9h14M5 13h8" stroke={active ? "#4f46e5" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" />
        <path d="M15 16l2 2 4-4" stroke={active ? "#4f46e5" : "#9ca3af"} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 border-t border-gray-100 bg-white">
      <div className="flex">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-1 flex-col items-center gap-[4px] py-[10px]"
            >
              {tab.icon(active)}
              <span
                className={`font-[family-name:var(--font-prompt)] text-[12px] ${
                  active ? "text-[#4f46e5]" : "text-gray-400"
                }`}
              >
                {tab.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
