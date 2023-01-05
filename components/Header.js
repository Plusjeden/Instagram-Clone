import { View, Text, SafeAreaView, Button, Image } from "react-native";
import React from "react";

export default function Header(props) {
  return (
    <SafeAreaView
      style={{
        width: "100%",
        backgroundColor: "#223247",
        height: "15%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 280, height: 50, marginTop: 10 }}
      ></Image>
    </SafeAreaView>
  );
}
