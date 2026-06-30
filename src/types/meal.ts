export type LoadStatus = "loading" | "error" | "success";

export type MealSummary = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export type MealDetail = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
  strInstructions: string;
  strIngredient1: string;
  strIngredient2: string;
  strIngredient3: string;
  strIngredient4: string;
  strIngredient5: string;
};

export type MealsListState = {
  status: LoadStatus;
  items: MealSummary[];
  message: string;
};

export type MealDetailState = {
  status: LoadStatus;
  meal: MealDetail | null;
  message: string;
};