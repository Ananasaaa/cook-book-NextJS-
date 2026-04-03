export type Option = {
  key: string;
  label: string;
};

export type RecipeIngredient = {
  name: string;
  amount: string;
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
  ingredients: RecipeIngredient[];
  instructions: string;
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
    ingredients: [
      { name: "Sourdough bread", amount: "2 thick slices" },
      { name: "Ripe pear", amount: "1 medium, thinly sliced" },
      { name: "Ricotta", amount: "4 tbsp" },
      { name: "Unsalted butter", amount: "1 tbsp" },
      { name: "Honey", amount: "2 tsp" },
      { name: "Ground cinnamon", amount: "½ tsp" },
      { name: "Sea salt", amount: "1 pinch" },
    ],
    instructions:
      "Toast the bread until golden and crisp on the edges. Spread ricotta evenly on each slice while the toast is still warm.\n\nLayer pear slices on top in a single layer. Drizzle with honey, dust with cinnamon, and finish with a tiny pinch of salt.\n\nServe immediately while the toast is still crisp.",
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
    ingredients: [
      { name: "Dark chocolate (70%)", amount: "200 g, chopped" },
      { name: "Heavy cream", amount: "240 ml" },
      { name: "Large egg yolks", amount: "3" },
      { name: "Granulated sugar", amount: "3 tbsp" },
      { name: "Vanilla extract", amount: "½ tsp" },
      { name: "Fine sea salt", amount: "1 pinch" },
    ],
    instructions:
      "Melt the chocolate gently over a bain-marie or in short bursts in the microwave, stirring until smooth. Let cool slightly.\n\nWhisk egg yolks with sugar until pale and thick. Fold in the melted chocolate and vanilla.\n\nWhip the cream to soft peaks, then fold into the chocolate base in two additions until no streaks remain.\n\nDivide between serving glasses and chill for at least 2 hours before serving.",
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
    ingredients: [
      { name: "Walnuts", amount: "120 g, toasted" },
      { name: "Medjool dates", amount: "8, pitted" },
      { name: "Rolled oats", amount: "40 g" },
      { name: "Cocoa powder", amount: "1 tbsp" },
      { name: "Cinnamon", amount: "¼ tsp" },
      { name: "Maple syrup", amount: "1 tbsp" },
      { name: "Fine sea salt", amount: "1 pinch" },
    ],
    instructions:
      "Pulse walnuts in a food processor until finely chopped. Add dates, oats, cocoa, cinnamon, maple syrup, and salt. Process until the mixture sticks together when pressed.\n\nRoll into 12 bite-sized balls. Optionally roll extras in chopped walnuts or cocoa.\n\nRefrigerate for 30 minutes to firm up. Store in an airtight container for up to a week.",
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
    ingredients: [
      { name: "Shortcrust pastry", amount: "1 round (about 230 g)" },
      { name: "Heavy cream", amount: "120 ml" },
      { name: "Eggs", amount: "2 large" },
      { name: "Blue cheese", amount: "100 g, crumbled" },
      { name: "Fresh thyme", amount: "2 tsp leaves" },
      { name: "Black pepper", amount: "freshly ground" },
      { name: "Baby spinach", amount: "40 g, optional" },
    ],
    instructions:
      "Preheat the oven to 190°C. Line a tart tin with pastry and trim the edges. Prick the base with a fork and blind-bake for 12 minutes until lightly golden.\n\nWhisk cream and eggs with a pinch of salt and pepper. Stir in thyme and half the blue cheese.\n\nPour the filling into the shell. Scatter spinach if using, then top with remaining cheese.\n\nBake for 20–25 minutes until just set in the center. Cool slightly before slicing.",
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
    ingredients: [
      { name: "Cottage cheese", amount: "200 g" },
      { name: "Large eggs", amount: "2" },
      { name: "All-purpose flour", amount: "4 tbsp" },
      { name: "Vanilla extract", amount: "½ tsp" },
      { name: "Sugar", amount: "1 tbsp" },
      { name: "Butter or oil", amount: "for frying" },
      { name: "Sour cream or yogurt", amount: "to serve" },
    ],
    instructions:
      "Blend cottage cheese, eggs, flour, vanilla, and sugar until almost smooth; a few curds are fine for texture.\n\nHeat a non-stick pan over medium heat with a little butter. Drop 2–3 tbsp of batter per pancake and cook until bubbles form and the underside is golden.\n\nFlip carefully and cook the second side until set. Stack and keep warm while you finish the batch.\n\nServe warm with sour cream or yogurt and fresh berries if you like.",
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
    ingredients: [
      { name: "Sweet shortcrust pastry", amount: "300 g" },
      { name: "Apricot jam", amount: "180 g" },
      { name: "Apricot brandy or water", amount: "1 tbsp" },
      { name: "Egg yolk", amount: "1 (for glaze)" },
      { name: "Milk", amount: "1 tsp" },
      { name: "Powdered sugar", amount: "for dusting" },
    ],
    instructions:
      "Roll pastry thin and cut rounds to fit mini tart molds. Press gently into tins and chill for 15 minutes.\n\nFill each shell with jam mixed with brandy or water. Fold or lattice the tops if you like, or leave open.\n\nBrush exposed pastry with egg yolk mixed with milk. Bake at 180°C until golden and bubbling, about 18–22 minutes.\n\nCool on a rack. Dust with powdered sugar before serving.",
  },
];
