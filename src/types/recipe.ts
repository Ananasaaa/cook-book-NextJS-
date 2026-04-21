export type Option = {
  [x: string]: string;
  key: string;
  label: string;
};

export type RecipeIngredient = {
  name: string;
  amount: string;
};

export type RecipeCard = {
  id: string | number;
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
  ingredients: RecipeIngredient[];
  instructions: string;
};
