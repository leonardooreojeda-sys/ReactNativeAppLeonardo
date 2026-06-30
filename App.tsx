import { Text } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import MealsListScreen from "./src/screens/MealsListScreen";
import MealDetailScreen from "./src/screens/MealDetailScreen";
import FavoritesScreen from "./src/screens/FavoritesScreen";
import { FavoritesProvider } from "./src/context/FavoritesContext";

export type RootStackParamList = {
  MealsList: undefined;
  MealDetail: { idMeal: string };
  Favorites: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      MealsList: "",
      MealDetail: "meals/:idMeal",
      Favorites: "favorites",
    },
  },
};

export default function App() {
  return (
    <FavoritesProvider>
      <NavigationContainer linking={linking}>
        <Stack.Navigator
          screenOptions={{
            headerStyle: { backgroundColor: "#0f172a" },
            headerTintColor: "#f8fafc",
            headerTitleStyle: { fontWeight: "700" },
          }}
        >
          <Stack.Screen
            name="MealsList"
            component={MealsListScreen}
            options={({ navigation }) => ({
              title: "Italian Meals",
              headerRight: () => (
                <Text
                  style={{ color: "#38bdf8", fontSize: 22, paddingRight: 8 }}
                  onPress={() => navigation.navigate("Favorites")}
                >
                  ♥
                </Text>
              ),
            })}
          />
          <Stack.Screen name="MealDetail" component={MealDetailScreen} options={{ title: "Meal Detail" }} />
          <Stack.Screen name="Favorites" component={FavoritesScreen} options={{ title: "I tuoi preferiti" }} />
        </Stack.Navigator>
      </NavigationContainer>
    </FavoritesProvider>
  );
}