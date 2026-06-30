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
import { MealsListState } from "../types/meal";
import { RootStackParamList } from "../../App";
import FavoriteButton from "../components/FavoriteButton";

type Props = NativeStackScreenProps<RootStackParamList, "MealsList">;

export default function MealsListScreen({ navigation }: Props) {
  const { favoriteIds } = useFavorites();
  const [state, setState] = useState<MealsListState>({
    status: "loading",
    items: [],
    message: "",
  });

  async function loadMeals() {
    setState({ status: "loading", items: [], message: "" });
    try {
      const meals = await fetchItalianMeals();
      if (meals.length === 0) {
        setState({ status: "success", items: [], message: "Nessun piatto italiano disponibile." });
      } else {
        setState({ status: "success", items: meals, message: "" });
      }
    } catch (e: any) {
      setState({ status: "error", items: [], message: e.message ?? "Errore di rete." });
    }
  }

  useEffect(() => {
    loadMeals();
  }, []);

  if (state.status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Caricamento piatti...</Text>
      </View>
    );
  }

  if (state.status === "error") {
    return (
      <View style={styles.centered}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>Errore</Text>
          <Text style={styles.errorSub}>{state.message}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={loadMeals}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (state.items.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>Nessun piatto italiano disponibile.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.favCount}>Preferiti salvati: {favoriteIds.length}</Text>
      <FlatList
        data={state.items}
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
  favCount: { color: "#64748b", fontSize: 12, textAlign: "center", paddingTop: 12 },
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
  loadingText: { color: "#94a3b8", marginTop: 12, fontSize: 14 },
  emptyText: { color: "#94a3b8", fontSize: 15 },
  errorBox: {
    backgroundColor: "#1e293b",
    borderRadius: 12,
    padding: 20,
    borderWidth: 1,
    borderColor: "#ef4444",
    gap: 6,
    width: "100%",
    marginBottom: 20,
  },
  errorTitle: { color: "#ef4444", fontSize: 18, fontWeight: "700" },
  errorSub: { color: "#94a3b8", fontSize: 14 },
  button: { backgroundColor: "#38bdf8", borderRadius: 10, paddingVertical: 14, paddingHorizontal: 40, alignItems: "center" },
  buttonText: { color: "#0f172a", fontSize: 15, fontWeight: "700" },
});