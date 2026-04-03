"use client";

import Link from "next/link";

export default function Banner() {
  return (
    <section className="w-full px-4 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
      <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
        <Link href="/projects" className="group block">
          <div className="relative h-20 overflow-hidden bg-brand-cream xxs:h-[120px] xs:h-[160px] md:h-[200px] lg:h-[230px] xl:h-[250px] xxl:h-[200px]">
            <img
              src="/img/banner-home.jpg"
              alt="Banner"
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

            <div className="absolute inset-0 flex items-end justify-end p-4 xxs:p-3">
              <h2 className="text-right text-4xl font-bold text-brand-deep xxs:text-4xl xs:text-5xl md:text-6xl lg:text-8xl xl:text-8xl">
                <span className="inline-flex items-center gap-2 rounded-2xl bg-brand-gold px-4 py-2 transition-transform duration-300 group-hover:-translate-y-0.5">
                  Easter Recipes
                  <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                    →
                  </span>
                </span>
              </h2>
            </div>
          </div>
        </Link>
      </div>
    </section>
  );
}
