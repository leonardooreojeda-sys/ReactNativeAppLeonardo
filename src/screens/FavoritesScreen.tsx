import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchItalianMeals } from "../services/mealsApi";
import { useFavorites } from "../context/FavoritesContext";
import { MealSummary } from "../types/meal";
import { RootStackParamList } from "../../App";
import FavoriteButton from "../components/FavoriteButton";

type Props = NativeStackScreenProps<RootStackParamList, "Favorites">;

export default function FavoritesScreen({ navigation }: Props) {
  const { favoriteIds, isLoading } = useFavorites();
  const [allMeals, setAllMeals] = useState<MealSummary[]>([]);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    fetchItalianMeals()
      .then(setAllMeals)
      .finally(() => setFetching(false));
  }, []);

  const favoriteMeals = allMeals.filter((m) => favoriteIds.includes(m.idMeal));

  if (isLoading || fetching) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  if (favoriteMeals.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>
          Nessun preferito ancora. Tocca ♡ su un piatto dalla lista.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={favoriteMeals}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={styles.list}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.cardLeft}
              activeOpacity={0.75}
              onPress={() => navigation.navigate("MealDetail", { idMeal: item.idMeal })}
            >
              <Image source={{ uri: item.strMealThumb }} style={styles.thumb} />
              <Text style={styles.mealName}>{item.strMeal}</Text>
            </TouchableOpacity>
            <FavoriteButton idMeal={item.idMeal} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  centered: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center", padding: 24 },
  list: { padding: 16, gap: 12 },
  card: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#334155",
  },
  cardLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  thumb: { width: 80, height: 80, borderRadius: 12 },
  mealName: { color: "#f8fafc", fontSize: 15, fontWeight: "600", flex: 1, paddingHorizontal: 14 },
  emptyText: { color: "#94a3b8", fontSize: 15, textAlign: "center" },
});