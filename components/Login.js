import {
  View,
  Text,
  TextInput,
  Button,
  SafeAreaView,
  Image,
} from "react-native";
import { useEffect, useState } from "react";
import React from "react";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth } from "../firebase";

export default function Login({ navigation, route }) {
  const [logMail, setLogMail] = useState();
  const [logPass, setLogPass] = useState();
  const [user, setUser] = useState({});

  onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, logMail, logPass);
      alert("Logged in");
      navigation.navigate("Home");
    } catch (error) {
      alert(error.message);
    }
  };

  useEffect(() => {
    if (user != null) {
      navigation.navigate("Home");
    }
  }, []);

  return (
    <SafeAreaView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#192536",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../assets/logo.png")}
        style={{ width: 300, height: 55 }}
      ></Image>
      <View
        style={{
          marginTop: 50,
          height: 500,
          width: "90%",
          borderRadius: 30,
          backgroundColor: "#242f40",
          display: "flex",
          color: "white",
        }}
      >
        <Text
          style={{
            textAlign: "center",
            paddingTop: 30,
            fontSize: 30,
            color: "white",
          }}
        >
          Sign in
        </Text>
        <Text
          style={{
            textAlign: "center",
            paddingTop: 50,
            fontSize: 20,
            color: "white",
          }}
        >
          E-mail:
        </Text>
        <TextInput
          style={{
            height: 45,
            width: "75%",
            alignSelf: "center",
            backgroundColor: "#26364d",
            borderColor: "gray",
            borderWidth: 3,
            borderRadius: 10,
            marginTop: 10,
            paddingLeft: 10,
            color: "white",
          }}
          onChangeText={(value) => {
            setLogMail(value);
          }}
        ></TextInput>
        <Text
          style={{
            textAlign: "center",
            paddingTop: 50,
            fontSize: 20,
            color: "white",
          }}
        >
          Password:
        </Text>
        <TextInput
          secureTextEntry={true}
          textContentType="password"
          style={{
            height: 45,
            width: "75%",
            alignSelf: "center",
            backgroundColor: "#26364d",
            borderColor: "gray",
            borderWidth: 3,
            borderRadius: 10,
            marginTop: 10,
            paddingLeft: 10,
            color: "white",
          }}
          onChangeText={(value) => {
            setLogPass(value);
          }}
        ></TextInput>
        <Pressable
          onPress={() => navigation.navigate("SignUp")}
          style={{
            width: 250,
            alignSelf: "center",
            marginTop: 20,
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ marginTop: "5%", color: "white" }}>
            Don't have an account?
          </Text>
          <Text
            style={{
              marginTop: "5%",
              textDecorationLine: "underline",
              color: "lightblue",
              marginLeft: 5,
            }}
          >
            Click Here
          </Text>
        </Pressable>
        <Pressable
          onPress={login}
          style={{
            height: 30,
            width: 150,
            alignSelf: "center",
            backgroundColor: "#354761",
            borderColor: "gray",
            borderWidth: 2,
            borderRadius: 10,
            marginTop: 50,
            paddingLeft: 10,
            color: "white",
          }}
        >
          <Text
            style={{ alignSelf: "center", marginTop: 3, color: "lightblue" }}
          >
            Log in
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
