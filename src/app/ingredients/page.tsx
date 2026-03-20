"use client";

import Link from "next/link";
import { Suspense, useEffect, useMemo, useState, type Key } from "react";
import { Input, Select, SelectItem, Button } from "@heroui/react";
import Image from "next/image";
import { useQueryState } from "nuqs";
import {
  mealTypes,
  cookingTimes,
  difficulties,
  diets,
  sortOptions,
  recipes,
  type Option,
} from "../../mocks/ingredients";

type Filters = {
  search: string;
  mealType: string;
  cookingTime: string;
  difficulty: string;
  diet: string;
  sortBy: string;
};

const initialFilters: Filters = {
  search: "",
  mealType: "all",
  cookingTime: "all",
  difficulty: "all",
  diet: "all",
  sortBy: "popular",
};

const inputClassNames = {
  inputWrapper:
    "bg-white border border-brand-gold shadow-none min-h-14 h-auto items-center",
  input: "text-brand-deep leading-[1.4] py-1 font-normal",
} as const;

const selectClassNames = {
  trigger:
    "bg-white border border-brand-gold shadow-none min-h-14 h-auto text-brand-deep items-center",
  value: "text-brand-deep leading-[1.4] py-1 font-normal",
  popoverContent: "p-2 overflow-visible",
  listboxWrapper: "max-h-[320px] overflow-y-auto pb-2",
  listbox: "py-1 pb-3",
} as const;

const selectItemClassName =
  "min-h-[52px] h-auto py-3 text-brand-deep font-normal leading-[1.45] overflow-visible";

type SelectField = Exclude<keyof Filters, "search">;

const selectConfigs: {
  field: SelectField;
  placeholder: string;
  options: Option[];
}[] = [
  { field: "mealType", placeholder: "Meal type", options: mealTypes },
  { field: "cookingTime", placeholder: "Cooking time", options: cookingTimes },
  { field: "difficulty", placeholder: "Difficulty", options: difficulties },
  { field: "diet", placeholder: "Diet", options: diets },
  { field: "sortBy", placeholder: "Sort by", options: sortOptions },
];

const getSelectionValue = (keys: "all" | Iterable<Key>) => {
  if (keys === "all") {
    return "all";
  }

  return Array.from(keys)[0]?.toString() ?? "all";
};

const cookingTimeOrder: Record<string, number> = {
  under15: 1,
  "15to30": 2,
  "30to60": 3,
  over60: 4,
};

function IngredientsWithNuqs() {
  const [urlSearch] = useQueryState("search", { defaultValue: "" });
  const [draftFilters, setDraftFilters] = useState<Filters>(() => ({
    ...initialFilters,
    search: urlSearch,
  }));
  const [appliedFilters, setAppliedFilters] = useState<Filters>(() => ({
    ...initialFilters,
    search: urlSearch,
  }));

  useEffect(() => {
    setDraftFilters((prev) => ({ ...prev, search: urlSearch }));
    setAppliedFilters((prev) => ({ ...prev, search: urlSearch }));
  }, [urlSearch]);

  const filteredRecipes = useMemo(() => {
    const searchValue = appliedFilters.search.trim().toLowerCase();

    const result = recipes.filter((item) => {
      const matchesSearch =
        !searchValue || item.title.toLowerCase().includes(searchValue);

      const matchesMealType =
        appliedFilters.mealType === "all" ||
        item.mealType === appliedFilters.mealType;

      const matchesCookingTime =
        appliedFilters.cookingTime === "all" ||
        item.cookingTime === appliedFilters.cookingTime;

      const matchesDifficulty =
        appliedFilters.difficulty === "all" ||
        item.difficulty === appliedFilters.difficulty;

      const matchesDiet =
        appliedFilters.diet === "all" ||
        item.diets.includes(appliedFilters.diet);

      return (
        matchesSearch &&
        matchesMealType &&
        matchesCookingTime &&
        matchesDifficulty &&
        matchesDiet
      );
    });

    const sorted = [...result];

    if (appliedFilters.sortBy === "az") {
      sorted.sort((a, b) => a.title.localeCompare(b.title));
    } else if (appliedFilters.sortBy === "fastest") {
      sorted.sort(
        (a, b) =>
          cookingTimeOrder[a.cookingTime] - cookingTimeOrder[b.cookingTime],
      );
    } else {
      sorted.sort((a, b) => b.popularity - a.popularity);
    }

    return sorted;
  }, [appliedFilters]);

  const handleSearchChange = (value: string) => {
    setDraftFilters((prev) => ({
      ...prev,
      search: value,
    }));
  };

  const handleSelectChange = (
    field: SelectField,
    keys: "all" | Iterable<Key>,
  ) => {
    const value = getSelectionValue(keys);

    setDraftFilters((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleApplyFilters = () => {
    setAppliedFilters(draftFilters);
  };

  const handleClearFilters = () => {
    setDraftFilters(initialFilters);
    setAppliedFilters(initialFilters);
  };

  return (
    <main className="min-h-screen bg-brand-cream px-4 py-10 xxs:px-4 xs:px-5 md:px-6 lg:px-8 xl:px-10 xxl:px-0">
      <div className="mx-auto w-full max-w-full md:max-w-[900px] lg:max-w-[1100px] xl:max-w-[1360px] xxl:max-w-[1680px]">
        <section className="mb-8 md:mb-10 xl:mb-12">
          <p className="mb-2 text-sm uppercase tracking-[0.18em] text-brand-primary">
            Explore
          </p>

          <h1 className="mb-3 text-[30px] font-semibold leading-tight text-brand-deep xs:text-[34px] md:text-[42px] lg:text-[50px]">
            Recipes
          </h1>

          <p className="max-w-[680px] text-[15px] leading-7 text-brand-deep/75 md:text-base">
            Browse recipes and filter them by meal type, cooking time,
            difficulty and diet.
          </p>
        </section>

        <section className="mb-8 rounded-[24px] border border-brand-gold bg-[#fffaf3] p-4 xs:p-5 md:p-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Input
              placeholder="Search recipe..."
              value={draftFilters.search}
              onValueChange={handleSearchChange}
              classNames={inputClassNames}
            />

            {selectConfigs.map((select) => (
              <Select
                key={select.field}
                placeholder={select.placeholder}
                classNames={selectClassNames}
                selectedKeys={[draftFilters[select.field]]}
                onSelectionChange={(keys) =>
                  handleSelectChange(select.field, keys)
                }
              >
                {select.options.map((item) => (
                  <SelectItem key={item.key} className={selectItemClassName}>
                    {item.label}
                  </SelectItem>
                ))}
              </Select>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-3">
            <Button
              onPress={handleApplyFilters}
              className="bg-brand-primary text-white hover:bg-brand-deep"
            >
              Apply Filters
            </Button>

            <Button
              variant="bordered"
              onPress={handleClearFilters}
              className="border-brand-gold text-brand-deep"
            >
              Clear Filters
            </Button>
          </div>
        </section>

        <section>
          <div className="mb-4 text-sm text-brand-deep/70">
            Found: {filteredRecipes.length}
          </div>

          {filteredRecipes.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
              {filteredRecipes.map((item) => (
                <Link
                  key={item.id}
                  href={`/recipes/${item.slug}`}
                  className="flex items-center gap-4 rounded-[22px] border border-brand-gold bg-[#fffaf3] p-4 transition-transform duration-300 hover:-translate-y-1"
                >
                  <div className="relative h-[72px] w-[72px] shrink-0 overflow-hidden rounded-full border border-brand-gold xs:h-[80px] xs:w-[80px]">
                    <Image
                      src={item.image}
                      alt={item.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h3 className="mb-1 text-[20px] font-semibold text-brand-deep">
                      {item.title}
                    </h3>

                    <p className="mb-2 text-sm text-brand-primary">
                      {item.categoryLabel}
                    </p>

                    <p className="text-sm text-brand-deep/70">
                      {item.cookingTimeLabel} • {item.difficultyLabel}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="rounded-[22px] border border-brand-gold bg-[#fffaf3] p-8 text-center text-brand-deep/70">
              No recipes found for the selected filters.
            </div>
          )}
        </section>
      </div>
    </main>
  );
}

export default function IngredientsPage() {
  return (
    <Suspense fallback={null}>
      <IngredientsWithNuqs />
    </Suspense>
  );
}
