import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { recipes } from "../../../mocks/ingredients";

type RecipePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function RecipePage({ params }: RecipePageProps) {
  const { slug } = await params;

  const recipe = recipes.find((item) => item.slug === slug);

  if (!recipe) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
      <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1200px]">
        <Link
          href="/ingredients"
          className="mb-6 inline-flex text-sm text-brand-primary transition-opacity hover:opacity-70"
        >
          ← Back to recipes
        </Link>

        <div className="overflow-hidden rounded-[28px] border border-brand-gold bg-[#fffaf3]">
          <div className="relative h-[260px] w-full xs:h-[320px] md:h-[420px]">
            <Image
              src={recipe.image}
              alt={recipe.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-5 xs:p-6 md:p-8">
            <p className="mb-2 text-sm uppercase tracking-[0.16em] text-brand-primary">
              {recipe.categoryLabel}
            </p>

            <h1 className="mb-4 text-[30px] font-semibold leading-tight text-brand-deep xs:text-[34px] md:text-[44px]">
              {recipe.title}
            </h1>

            <p className="mb-6 max-w-[760px] text-[15px] leading-7 text-brand-deep/75 md:text-base">
              {recipe.description}
            </p>

            <div className="flex flex-wrap gap-3">
              <div className="rounded-full border border-brand-gold bg-white px-4 py-2 text-sm text-brand-deep">
                {recipe.mealTypeLabel}
              </div>

              <div className="rounded-full border border-brand-gold bg-white px-4 py-2 text-sm text-brand-deep">
                {recipe.cookingTimeLabel}
              </div>

              <div className="rounded-full border border-brand-gold bg-white px-4 py-2 text-sm text-brand-deep">
                {recipe.difficultyLabel}
              </div>

              {recipe.dietLabels.map((diet) => (
                <div
                  key={diet}
                  className="rounded-full border border-brand-gold bg-white px-4 py-2 text-sm text-brand-deep"
                >
                  {diet}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
