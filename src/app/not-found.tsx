import Link from "next/link";

const floatingIcons = [
  {
    emoji: "🍅",
    className: "left-8 top-8 text-4xl md:text-5xl",
    delay: "0s",
    duration: "3.2s",
  },
  {
    emoji: "🥖",
    className: "right-10 top-14 text-4xl md:text-5xl",
    delay: "0.6s",
    duration: "3.8s",
  },
  {
    emoji: "🧄",
    className: "bottom-10 left-12 text-4xl md:text-5xl",
    delay: "1.1s",
    duration: "3.4s",
  },
  {
    emoji: "🍳",
    className: "bottom-12 right-12 text-3xl md:text-4xl",
    delay: "0.9s",
    duration: "4s",
  },
];

const NotFoundPage = () => {
  return (
    <main className="relative flex min-h-[80vh] items-center justify-center overflow-hidden px-6 py-16">
      <section className="group relative w-full max-w-4xl overflow-hidden rounded-[2rem] border border-brand-gold/70 bg-brand-cream/95 p-8 text-center shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl md:p-12">
        <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
          <span className="select-none text-[8rem] font-black leading-none text-brand-gold/15 md:text-[14rem]">
            404
          </span>
        </div>

        {floatingIcons.map((icon) => (
          <span
            key={`${icon.emoji}-${icon.className}`}
            className={`absolute animate-bounce ${icon.className}`}
            style={{
              animationDelay: icon.delay,
              animationDuration: icon.duration,
            }}
          >
            {icon.emoji}
          </span>
        ))}

        <div className="relative z-10">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.35em] text-brand-primary">
            Error 404
          </p>

          <h1 className="mb-4 text-4xl font-black text-brand-deep md:text-7xl">
            This recipe is missing
          </h1>

          <p className="mx-auto mb-8 max-w-2xl text-base leading-7 text-brand-deep/80 md:text-lg">
            Looks like this page got lost somewhere between the spice rack and
            the oven. The good news: the rest of the kitchen is still open.
          </p>

          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href="/"
              className="inline-flex items-center rounded-full bg-brand-primary px-7 py-3 text-sm font-semibold text-brand-cream shadow-md transition-all duration-300 ease-in-out hover:scale-105 hover:bg-brand-deep hover:shadow-xl"
            >
              Back Home
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default NotFoundPage;
