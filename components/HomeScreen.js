import { View } from "react-native";
import Header from "./Header";
import BottomBar from "./BottomBar";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import { useEffect, useState } from "react";

const HomeScreen = ({ navigation, route }) => {
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  useEffect(() => {
    if (user == null) {
      navigation.navigate("Login");
    }
  }, [user]);

  return (
    <View style={{ height: "100%" }}>
      <Header></Header>
      <BottomBar></BottomBar>
    </View>
  );
};

export default HomeScreen;
