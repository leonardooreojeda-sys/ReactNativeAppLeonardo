import { StyleSheet, Text, TouchableOpacity } from "react-native";

type Props = {
  idMeal: string;
  favoriteIds: string[];
  onToggle: (idMeal: string) => void;
};

export default function FavoriteButton({ idMeal, favoriteIds, onToggle }: Props) {
  const isFav = favoriteIds.includes(idMeal);

  return (
    <TouchableOpacity style={styles.button} onPress={() => onToggle(idMeal)}>
      <Text style={styles.heart}>{isFav ? "♥" : "♡"}</Text>
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