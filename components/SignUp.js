import { View, Text, TextInput, SafeAreaView } from "react-native";
import React, { useState } from "react";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, db } from "../firebase";
import { setDoc, doc } from "firebase/firestore";

export default function SignUp({ navigation, route }) {
  const [regMail, setRegMail] = useState();
  const [regPass, setRegPass] = useState();
  const [regPassConf, setRegPassConf] = useState();

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const register = async () => {
    if (!validateEmail(regMail)) {
      alert("Invalid email");
      return;
    }
    if (regPass != regPassConf) {
      alert("Passwords does not match");
      return;
    }
    if (regPass.length < 5) {
      alert("Password is too short");
      return;
    }

    try {
      const user = await createUserWithEmailAndPassword(auth, regMail, regPass);
      await alert("Account created");
      await updateProfile(auth.currentUser, {
        displayName: "New user",
        photoURL:
          "https://construct-static.com/images/v1027/r/uploads/tutorial/0/images/17449/windows-8-user-account_v650.jpg",
      });
      await setDoc(doc(db, "users", auth.currentUser.uid), {
        uuid: auth.currentUser.uid,
        mail: auth.currentUser.email,
        image: auth.currentUser.photoURL,
        username: auth.currentUser.displayName,
        posts: [],
      });
      await navigation.navigate("Login");
    } catch (error) {
      alert(error.message);
    }
  };

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
      <View
        style={{
          marginTop: 150,
          height: 700,
          position: "absolute",
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
          Sign up
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
            setRegMail(value);
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
            setRegPass(value);
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
          Confirm password:
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
            setRegPassConf(value);
          }}
        ></TextInput>
        <Pressable
          onPress={() => navigation.navigate("Login")}
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
            Already have an account?
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
          onPress={() => register()}
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
            Submit
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
