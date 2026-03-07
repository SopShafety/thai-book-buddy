"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/browse",
    label: "ค้นหา",
    icon: (active: boolean) => (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M4 19V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v13" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M2 19h20" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" />
        <path d="M9 10h6M9 14h4" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/my-list",
    label: "รายการของฉัน",
    icon: (active: boolean) => (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M5 3h14a1 1 0 0 1 1 1v17l-7-3-7 3V4a1 1 0 0 1 1-1Z" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    href: "/map",
    label: "ผังงาน",
    icon: (active: boolean) => (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <path d="M3 7l6-3 6 3 6-3v13l-6 3-6-3-6 3V7Z" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 4v13M15 7v13" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="shrink-0 border-t border-[#f0e4d4] bg-[#fafaf8]">
      <div className="flex pb-[32px] pt-[12px] px-[24px] justify-between">
        {tabs.map((tab) => {
          const active = pathname === tab.href;
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className="flex flex-col items-center gap-[8px] w-[80px]"
            >
              {tab.icon(active)}
              <span
                className={`font-[family-name:var(--font-prompt)] text-[14px] leading-none ${
                  active ? "font-semibold text-[#973c00]" : "text-[#a6a09b]"
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
