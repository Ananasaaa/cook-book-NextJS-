"use client";

import Link from "next/link";

export default function Banner() {
  return (
    <section className="w-full px-4 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
      <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
        <Link href="/projects" className="group block">
          <div className="relative h-[240px] overflow-hidden bg-brand-cream xs:h-[320px] md:h-[400px] lg:h-[460px] xl:h-[500px] xxl:h-[440px]">
            <img
              src="/img/banner-home.jpg"
              alt="Banner"
              className="h-full w-full object-cover object-center transition-transform duration-500 ease-out group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-black/10 transition-colors duration-500 group-hover:bg-black/20" />

            <div className="absolute inset-0 flex items-end justify-end p-3 sm:p-4">
              <h2 className="text-right text-2xl font-bold text-brand-deep xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl">
                <span className="inline-flex items-center gap-1.5 rounded-2xl bg-brand-gold px-3 py-1.5 transition-transform duration-300 group-hover:-translate-y-0.5 sm:gap-2 sm:px-4 sm:py-2">
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
