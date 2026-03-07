"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  {
    href: "/browse",
    label: "ค้นหา",
    icon: (active: boolean) => (
      <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="7" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" />
        <path d="M16.5 16.5L21 21" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    href: "/my-list",
    label: "รายการของฉัน",
    icon: (active: boolean) => (
      <svg width="24" height="24" viewBox="0 0 24 24" fill={active ? "#973c00" : "none"}>
        <path d="M12 21C7 15.5 2 12.2 2 8a5 5 0 0 1 10 0 5 5 0 0 1 10 0c0 4.2-5 7.5-10 13Z" stroke={active ? "#973c00" : "#a6a09b"} strokeWidth="1.8" strokeLinejoin="round" />
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
                className={`font-[family-name:var(--font-prompt)] text-[14px] leading-none whitespace-nowrap ${
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
