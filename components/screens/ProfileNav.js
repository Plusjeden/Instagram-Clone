import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import ViewPost from "./ViewPost";
import PostScreen from "./PostScreen";
import ShowProfile from "./ShowProfile";

export default function ProfileNav() {
  const Stack = createNativeStackNavigator();
  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ShowProfile" component={ShowProfile} />
        <Stack.Screen name="ViewPost" component={ViewPost} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
