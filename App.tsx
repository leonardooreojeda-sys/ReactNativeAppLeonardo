import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import * as Linking from "expo-linking";
import MealsListScreen from "./src/screens/MealsListScreen";
import MealDetailScreen from "./src/screens/MealDetailScreen";

export type RootStackParamList = {
  MealsList: undefined;
  MealDetail: { idMeal: string };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const linking = {
  prefixes: [Linking.createURL("/"), "myapp://"],
  config: {
    screens: {
      MealsList: "",
      MealDetail: "meals/:idMeal",
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: "#0f172a" },
          headerTintColor: "#f8fafc",
          headerTitleStyle: { fontWeight: "700" },
        }}
      >
        <Stack.Screen name="MealsList" component={MealsListScreen} options={{ title: "Italian Meals" }} />
        <Stack.Screen name="MealDetail" component={MealDetailScreen} options={{ title: "Meal Detail" }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}