"use client";

import { Card, CardBody, Image } from "@heroui/react";

const cards = [
  {
    id: 1,
    label: "Sweet & Savory",
    title: "Baked Pear with Walnuts and Blue Cheese",
    description:
      "A delicate baked pear with creamy blue cheese, crunchy walnuts, and a rich sweet-savory finish.",
    image: "/img/dish-1.jpg",
  },
  {
    id: 2,
    label: "Chocolate Dessert",
    title: "Chocolate Mini Cupcakes with Glaze",
    description:
      "Soft chocolate mini cupcakes topped with glossy glaze and a light nut crumble for extra texture.",
    image: "/img/dish-2.jpg",
  },
  {
    id: 3,
    label: "Breakfast Classic",
    title: "Victorian Syrniki with Apricot Jam",
    description:
      "Golden cottage cheese pancakes served with apricot jam for a soft, elegant, and comforting dessert.",
    image: "/img/dish-3.jpg",
  },
];

export default function Cards() {
  return (
    <section className="w-full px-4 pt-12 mt-12 pb-8 mb-8 xxs:px-4 xxs:pt-12 xxs:mt-12 xxs:pb-8 xxs:mb-8 xs:px-5 xs:pt-14 xs:mt-14 xs:pb-10 xs:mb-10 md:px-6 md:pt-16 md:mt-16 md:pb-12 md:mb-12 lg:px-8 lg:pt-20 lg:mt-20 lg:pb-14 lg:mb-14 xl:px-10 xl:pt-24 xl:mt-24 xl:pb-16 xl:mb-16 xxl:px-0 xxl:pt-24 xxl:mt-24 xxl:pb-20 xxl:mb-20">
      <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
        <div className="mb-6 xs:mb-7 md:mb-8 lg:mb-10 xl:mb-12">
          <h2 className="text-[28px] font-semibold leading-tight text-brand-deep xxs:text-[28px] xs:text-[32px] md:text-[38px] lg:text-[44px] xl:text-[52px] xxl:text-[50px] mt-8">
            Popular Recipes
          </h2>
        </div>

        <div className="grid grid-cols-1 gap-5 xs:gap-6 md:grid-cols-2 md:gap-6 lg:gap-7 xl:grid-cols-3 xl:gap-8 xxl:gap-10">
          {cards.map((card) => (
            <Card
              key={card.id}
              shadow="none"
              className="group w-full rounded-[28px] border border-brand-gold bg-[#fffaf3] p-3 transition-transform duration-300 hover:-translate-y-1 xxs:rounded-[28px] xs:rounded-[30px] xs:p-4 md:rounded-[30px] lg:rounded-[32px] lg:p-4 xl:rounded-[34px] xl:p-5">
              <CardBody className="gap-4 p-0 xs:gap-5 lg:gap-6">
                <div className="overflow-hidden rounded-[22px] xs:rounded-[24px] lg:rounded-[26px] xl:rounded-[28px]">
                  <Image
                    removeWrapper
                    alt={card.title}
                    src={card.image}
                    className="h-[220px] w-full object-cover transition-transform duration-500 group-hover:scale-105 xxs:h-[220px] xs:h-[250px] md:h-[240px] lg:h-[280px] xl:h-[300px] xxl:h-[340px]"
                  />
                </div>

                <div className="px-1 pb-1 xs:px-2 xs:pb-2 lg:px-3 lg:pb-3">
                  <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.16em] text-brand-primary xs:mb-3 xs:text-xs lg:text-sm">
                    {card.label}
                  </p>

                  <h3 className="mb-2 text-[20px] font-semibold leading-snug text-brand-deep xs:mb-3 xs:text-[22px] md:text-[24px] lg:text-[28px] xl:text-[30px] xxl:text-[34px]">
                    {card.title}
                  </h3>

                  <p className="text-[14px] leading-6 text-brand-deep/80 xs:text-[15px] xs:leading-6 md:text-[15px] lg:text-[16px] lg:leading-7 xl:text-[17px] xxl:text-[18px] xxl:leading-8">
                    {card.description}
                  </p>
                </div>
              </CardBody>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
