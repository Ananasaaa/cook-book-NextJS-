"use client";

import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Input, Button } from "@heroui/react";

const inputClassNames = {
  inputWrapper:
    "bg-white border border-brand-gold shadow-none min-h-12 h-auto items-center",
  input: "text-brand-deep leading-[1.4] py-1 font-normal",
} as const;

export default function HeroSearch() {
  const router = useRouter();
  const [search, setSearch] = useQueryState("search", {
    defaultValue: "",
    history: "replace",
  });

  const handleFind = () => {
    const value = search.trim();
    const url = value
      ? `/ingredients?search=${encodeURIComponent(value)}`
      : "/ingredients";
    router.push(url);
  };

  return (
    <section className="flex flex-col items-center gap-8 px-4 py-10 md:py-14">
      <div className="flex flex-col items-center gap-4">
        <Image
          src="/logo.jpg"
          alt="Logo"
          width={80}
          height={80}
          priority
          className="h-16 w-16 shrink-0 rounded-full object-cover xs:h-20 xs:w-20 md:h-24 md:w-24"
        />
        <p className="whitespace-nowrap font-bold text-brand-deep text-xl xs:text-2xl md:text-3xl">
          Recipe & Kitchen
        </p>
      </div>

      <div className="flex w-full max-w-xl flex-row items-center gap-2">
        <Input
          type="search"
          placeholder="Search recipes..."
          value={search}
          onValueChange={setSearch}
          onKeyDown={(e) => e.key === "Enter" && handleFind()}
          classNames={inputClassNames}
          className="flex-1"
          aria-label="Search recipes"
        />
        <Button
          onPress={handleFind}
          size="sm"
          className="h-10 shrink-0 bg-brand-gold px-4 text-sm font-semibold text-brand-deep transition-all duration-300 hover:scale-105 hover:bg-brand-primary hover:text-brand-cream">
          Find
        </Button>
      </div>
    </section>
  );
}
