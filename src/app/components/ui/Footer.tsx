"use client";

import Link from "next/link";
import Image from "next/image";

const footerCategories = [
  { label: "Breakfast", href: "/recipes?category=breakfast" },
  { label: "Lunch", href: "/recipes?category=lunch" },
  { label: "Dinner", href: "/recipes?category=dinner" },
  { label: "Desserts", href: "/recipes?category=desserts" },
  { label: "Drinks", href: "/recipes?category=drinks" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleScrollTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="mt-auto border-t border-brand-gold bg-brand-deep">
      <div
        className="
          w-full py-8 md:py-10
          px-3 xxs:px-4 xs:px-6 md:px-8 lg:px-8 xl:px-12 xxl:px-16
        "
      >
        <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-10">
          <div className="flex flex-col items-center text-center md:items-start md:text-left">
            <Link
              href="/"
              className="mb-4 transition-transform duration-300 hover:scale-105"
            >
              <Image
                src="/logo.jpg"
                alt="Recipe & Kitchen logo"
                width={56}
                height={56}
                className="h-12 w-12 rounded-full object-cover md:h-14 md:w-14"
              />
            </Link>

            <h3 className="text-lg font-bold text-brand-cream">
              Recipe & Kitchen
            </h3>

            <p className="mt-2 max-w-xs text-sm leading-relaxed text-brand-cream/75">
              A cozy place for simple homemade recipes, warm dinners, and little
              kitchen inspiration for every day.
            </p>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Recipe Categories
            </h4>

            <div className="flex flex-wrap justify-center gap-2 md:justify-start">
              {footerCategories.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="rounded-full border border-brand-gold/40 px-3 py-1.5 text-xs font-medium text-brand-cream transition-all duration-300 hover:scale-105 hover:border-brand-gold hover:text-brand-gold sm:text-sm"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="text-center md:text-left">
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-brand-gold">
              Kitchen Tip
            </h4>

            <div className="rounded-2xl border border-brand-gold/20 bg-brand-cream/5 p-4">
              <p className="text-sm leading-relaxed text-brand-cream/80">
                Add a tiny pinch of salt to sweet pastries — it helps bring out
                the flavor and makes desserts taste richer.
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t border-brand-gold/20 pt-5 text-center md:flex-row md:text-left">
          <p className="text-xs text-brand-cream/60 sm:text-sm">
            © {currentYear} Recipe & Kitchen · Made with love for cozy cooking
          </p>

          <button
            type="button"
            onClick={handleScrollTop}
            className="rounded-full border border-brand-gold/30 px-4 py-2 text-xs font-medium text-brand-cream transition-all duration-300 hover:scale-105 hover:border-brand-gold hover:text-brand-gold sm:text-sm"
          >
            Back to top
          </button>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
