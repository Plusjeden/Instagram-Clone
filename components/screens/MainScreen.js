import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ViewPost from "./ViewPost";
import PostScreen from "./PostScreen";
import ShowUser from "./ShowUser";

export default function MainScreen() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="PostScreen" component={PostScreen} />
        <Stack.Screen name="ViewPost" component={ViewPost} />
        <Stack.Screen name="ShowUser" component={ShowUser} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
