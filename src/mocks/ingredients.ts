export type Option = {
  key: string;
  label: string;
};

export type RecipeCard = {
  id: number;
  slug: string;
  title: string;
  categoryLabel: string;
  mealType: string;
  mealTypeLabel: string;
  cookingTime: string;
  cookingTimeLabel: string;
  difficulty: string;
  difficultyLabel: string;
  diets: string[];
  dietLabels: string[];
  popularity: number;
  image: string;
  description: string;
};

export const mealTypes: Option[] = [
  { key: "all", label: "All Meal Types" },
  { key: "breakfast", label: "Breakfast" },
  { key: "dessert", label: "Dessert" },
  { key: "snack", label: "Snack" },
  { key: "brunch", label: "Brunch" },
];

export const cookingTimes: Option[] = [
  { key: "all", label: "Any Time" },
  { key: "under15", label: "Under 15 min" },
  { key: "15to30", label: "15–30 min" },
  { key: "30to60", label: "30–60 min" },
  { key: "over60", label: "1+ hour" },
];

export const difficulties: Option[] = [
  { key: "all", label: "Any Difficulty" },
  { key: "easy", label: "Easy" },
  { key: "medium", label: "Medium" },
  { key: "hard", label: "Hard" },
];

export const diets: Option[] = [
  { key: "all", label: "All Diets" },
  { key: "vegetarian", label: "Vegetarian" },
  { key: "gluten-free", label: "Gluten Free" },
  { key: "low-sugar", label: "Low Sugar" },
  { key: "high-protein", label: "High Protein" },
];

export const sortOptions: Option[] = [
  { key: "popular", label: "Most Popular" },
  { key: "fastest", label: "Quickest" },
  { key: "az", label: "A–Z" },
];

export const recipes: RecipeCard[] = [
  {
    id: 1,
    slug: "pear-cinnamon-toast",
    title: "Pear Cinnamon Toast",
    categoryLabel: "Breakfast",
    mealType: "breakfast",
    mealTypeLabel: "Breakfast",
    cookingTime: "under15",
    cookingTimeLabel: "12 min",
    difficulty: "easy",
    difficultyLabel: "Easy",
    diets: ["vegetarian"],
    dietLabels: ["Vegetarian"],
    popularity: 88,
    image: "/img/dish-6.jpg",
    description: "Crispy toast with pear slices, ricotta, cinnamon and honey.",
  },
  {
    id: 2,
    slug: "dark-chocolate-mousse",
    title: "Dark Chocolate Mousse",
    categoryLabel: "Dessert",
    mealType: "dessert",
    mealTypeLabel: "Dessert",
    cookingTime: "30to60",
    cookingTimeLabel: "35 min",
    difficulty: "medium",
    difficultyLabel: "Medium",
    diets: ["vegetarian", "gluten-free"],
    dietLabels: ["Vegetarian", "Gluten Free"],
    popularity: 97,
    image: "/img/dish-4.jpg",
    description:
      "Rich chocolate mousse with a silky texture and deep cocoa flavor.",
  },
  {
    id: 3,
    slug: "walnut-energy-bites",
    title: "Walnut Energy Bites",
    categoryLabel: "Snack",
    mealType: "snack",
    mealTypeLabel: "Snack",
    cookingTime: "under15",
    cookingTimeLabel: "10 min",
    difficulty: "easy",
    difficultyLabel: "Easy",
    diets: ["gluten-free", "high-protein"],
    dietLabels: ["Gluten Free", "High Protein"],
    popularity: 76,
    image: "/img/dish-8.jpg",
    description:
      "Quick no-bake walnut bites perfect for a light snack during the day.",
  },
  {
    id: 4,
    slug: "blue-cheese-brunch-tart",
    title: "Blue Cheese Brunch Tart",
    categoryLabel: "Brunch",
    mealType: "brunch",
    mealTypeLabel: "Brunch",
    cookingTime: "15to30",
    cookingTimeLabel: "25 min",
    difficulty: "medium",
    difficultyLabel: "Medium",
    diets: ["low-sugar"],
    dietLabels: ["Low Sugar"],
    popularity: 63,
    image: "/img/dish-7.jpg",
    description:
      "Savory tart with blue cheese, herbs and a crisp golden crust.",
  },
  {
    id: 5,
    slug: "cottage-cheese-pancakes",
    title: "Cottage Cheese Pancakes",
    categoryLabel: "Breakfast",
    mealType: "breakfast",
    mealTypeLabel: "Breakfast",
    cookingTime: "15to30",
    cookingTimeLabel: "20 min",
    difficulty: "easy",
    difficultyLabel: "Easy",
    diets: ["high-protein", "vegetarian"],
    dietLabels: ["High Protein", "Vegetarian"],
    popularity: 91,
    image: "/img/dish-8.jpg",
    description:
      "Soft golden pancakes made with cottage cheese and a touch of vanilla.",
  },
  {
    id: 6,
    slug: "apricot-jam-mini-tarts",
    title: "Apricot Jam Mini Tarts",
    categoryLabel: "Dessert",
    mealType: "dessert",
    mealTypeLabel: "Dessert",
    cookingTime: "30to60",
    cookingTimeLabel: "40 min",
    difficulty: "medium",
    difficultyLabel: "Medium",
    diets: ["vegetarian"],
    dietLabels: ["Vegetarian"],
    popularity: 72,
    image: "/img/dish-3.jpg",
    description:
      "Mini tarts filled with apricot jam and finished with a glossy glaze.",
  },
];
