import { View, Text, Image, Platform } from "react-native";
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { NavigationContainer } from "@react-navigation/native";
import MainScreen from "./screens/MainScreen";
import Profile from "./screens/Profile";
import Upload from "./screens/Upload";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import Post from "./Post";
import ShowProfile from "./screens/ShowProfile";
import ProfileNav from "./screens/ProfileNav";

const Nav = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

export default function BottomBar() {
  return (
    <NavigationContainer independent={true}>
      <Nav.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#223247",
            height: Platform.OS == "ios" ? 80 : 60,
          },
          tabBarActiveTintColor: "white",
          tabBarInactiveTintColor: "#0b121c",
          tabBarLabelStyle: {
            padding: 5,
            fontSize: 15,
            bottom: Platform.OS == "ios" ? -15 : 0,
          },
        }}
      >
        <Nav.Screen
          name="Main"
          component={MainScreen}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={{
                    uri: "https://cdn-icons-png.flaticon.com/512/25/25694.png",
                  }}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "white" : "#1c2026",
                    bottom: Platform.OS == "ios" ? -15 : -5,
                  }}
                ></Image>
              </View>
            ),
          }}
        />
        <Nav.Screen
          name="Upload"
          component={Upload}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={{
                    uri: "https://icons.veryicon.com/png/o/miscellaneous/standard-general-linear-icon/cloud-upload-14.png",
                  }}
                  resizeMode="contain"
                  style={{
                    width: 30,
                    height: 40,
                    tintColor: focused ? "white" : "#1c2026",
                    bottom: Platform.OS == "ios" ? -15 : -5,
                  }}
                ></Image>
              </View>
            ),
          }}
        />
        <Nav.Screen
          name="Profile"
          component={ProfileNav}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={require("../assets/user.jpg")}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "white" : "#1c2026",
                    bottom: Platform.OS == "ios" ? -15 : -5,
                  }}
                ></Image>
              </View>
            ),
          }}
        />
        <Nav.Screen
          name="Settings"
          component={Profile}
          options={{
            tabBarIcon: ({ focused }) => (
              <View style={{ justifyContent: "center", alignItems: "center" }}>
                <Image
                  source={{
                    uri: "https://upload.wikimedia.org/wikipedia/commons/d/dc/Settings-icon-symbol-vector.png",
                  }}
                  resizeMode="contain"
                  style={{
                    width: 25,
                    height: 25,
                    tintColor: focused ? "white" : "#1c2026",
                    bottom: Platform.OS == "ios" ? -15 : -5,
                  }}
                ></Image>
              </View>
            ),
          }}
        />
      </Nav.Navigator>
    </NavigationContainer>
  );
}
