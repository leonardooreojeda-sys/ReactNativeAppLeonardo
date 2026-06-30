import { createContext, useContext, useEffect, useState } from "react";
import { loadFavoriteIds, saveFavoriteIds } from "../services/storage";

type FavoritesContextType = {
  favoriteIds: string[];
  isLoading: boolean;
  isFavorite: (idMeal: string) => boolean;
  toggleFavorite: (idMeal: string) => Promise<void>;
};

const FavoritesContext = createContext<FavoritesContextType | null>(null);

export function FavoritesProvider({ children }: { children: React.ReactNode }) {
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadFavoriteIds().then((ids) => {
      setFavoriteIds(ids);
      setIsLoading(false);
    });
  }, []);

  function isFavorite(idMeal: string) {
    return favoriteIds.includes(idMeal);
  }

  async function toggleFavorite(idMeal: string) {
    const updated = favoriteIds.includes(idMeal)
      ? favoriteIds.filter((id) => id !== idMeal)
      : [...favoriteIds, idMeal];
    setFavoriteIds(updated);
    await saveFavoriteIds(updated);
  }

  return (
    <FavoritesContext.Provider value={{ favoriteIds, isLoading, isFavorite, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
}

export function useFavorites() {
  const ctx = useContext(FavoritesContext);
  if (!ctx) throw new Error("useFavorites must be used inside FavoritesProvider");
  return ctx;
}