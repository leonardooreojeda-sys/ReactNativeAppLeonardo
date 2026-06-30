import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { fetchMealById } from "../services/mealsApi";
import { loadFavoriteIds, saveFavoriteIds } from "../services/storage";
import { MealDetailState } from "../types/meal";
import { RootStackParamList } from "../../App";
import FavoriteButton from "../components/FavoriteButton";

type Props = NativeStackScreenProps<RootStackParamList, "MealDetail">;

export default function MealDetailScreen({ route, navigation }: Props) {
  const { idMeal } = route.params;

  const [state, setState] = useState<MealDetailState>({
    status: "loading",
    meal: null,
    message: "",
  });
  const [favoriteIds, setFavoriteIds] = useState<string[]>([]);

  async function loadMeal() {
    setState({ status: "loading", meal: null, message: "" });
    try {
      const meal = await fetchMealById(idMeal);
      if (!meal) {
        setState({ status: "error", meal: null, message: "Piatto non trovato." });
      } else {
        setState({ status: "success", meal, message: "" });
      }
    } catch (e: any) {
      setState({ status: "error", meal: null, message: e.message ?? "Errore di rete." });
    }
  }

  async function toggleFavorite(id: string) {
    const updated = favoriteIds.includes(id)
      ? favoriteIds.filter((f) => f !== id)
      : [...favoriteIds, id];
    setFavoriteIds(updated);
    await saveFavoriteIds(updated);
  }

  useEffect(() => {
    loadMeal();
    loadFavoriteIds().then(setFavoriteIds);
  }, [idMeal]);

  if (state.status === "loading") {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#38bdf8" />
        <Text style={styles.loadingText}>Caricamento dettaglio...</Text>
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
        <TouchableOpacity style={styles.button} onPress={loadMeal}>
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Text style={styles.backButtonText}>Go back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const meal = state.meal!;

  const ingredients = [1, 2, 3, 4, 5]
    .map((n) => meal[`strIngredient${n}` as keyof typeof meal])
    .filter(Boolean);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <View style={styles.titleRow}>
        <Text style={styles.title}>{meal.strMeal}</Text>
        <FavoriteButton
          idMeal={meal.idMeal}
          favoriteIds={favoriteIds}
          onToggle={toggleFavorite}
        />
      </View>

      <Text style={styles.sectionLabel}>INGREDIENTI</Text>
      {ingredients.map((ing, i) => (
        <Text key={i} style={styles.ingredient}>• {ing}</Text>
      ))}

      <Text style={styles.sectionLabel}>ISTRUZIONI</Text>
      <Text style={styles.instructions}>{meal.strInstructions}</Text>

      <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>Go back</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0f172a" },
  content: { padding: 20, gap: 8 },
  centered: { flex: 1, backgroundColor: "#0f172a", justifyContent: "center", alignItems: "center", padding: 24 },
  image: { width: "100%", height: 220, borderRadius: 14, marginBottom: 8 },
  titleRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  title: { color: "#f8fafc", fontSize: 22, fontWeight: "700", flex: 1 },
  sectionLabel: { color: "#64748b", fontSize: 11, fontWeight: "700", letterSpacing: 1.2, marginTop: 16 },
  ingredient: { color: "#cbd5e1", fontSize: 14, marginTop: 4 },
  instructions: { color: "#cbd5e1", fontSize: 14, lineHeight: 22, marginTop: 4 },
  loadingText: { color: "#94a3b8", marginTop: 12, fontSize: 14 },
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
  button: { backgroundColor: "#38bdf8", borderRadius: 10, paddingVertical: 14, alignItems: "center", marginTop: 24 },
  buttonText: { color: "#0f172a", fontSize: 15, fontWeight: "700" },
  backButton: { marginTop: 12, paddingVertical: 14, alignItems: "center" },
  backButtonText: { color: "#64748b", fontSize: 15 },
});