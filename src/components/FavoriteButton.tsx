import { StyleSheet, Text, TouchableOpacity } from "react-native";
import { useFavorites } from "../context/FavoritesContext";

type Props = {
  idMeal: string;
};

export default function FavoriteButton({ idMeal }: Props) {
  const { isFavorite, toggleFavorite } = useFavorites();

  return (
    <TouchableOpacity style={styles.button} onPress={() => toggleFavorite(idMeal)}>
      <Text style={styles.heart}>{isFavorite(idMeal) ? "♥" : "♡"}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
  },
  heart: {
    fontSize: 22,
    color: "#38bdf8",
  },
});