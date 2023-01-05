import {
  View,
  Text,
  ScrollView,
  Pressable,
  TextInput,
  Image,
  Button,
} from "react-native";
import React, { useState } from "react";
import { auth, db } from "../../firebase";
import {
  signOut,
  updateProfile,
  updateEmail,
  updatePassword,
} from "firebase/auth";
import { styles } from "../../styles";
import { storage } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { doc, updateDoc } from "firebase/firestore";

export default function Profile() {
  const [username, setUsername] = useState(auth.currentUser.displayName);
  const [mail, setMail] = useState(auth.currentUser.email);
  const [pass, setPass] = useState("");
  const [pass2, setPass2] = useState("");
  const [img, setImg] = useState(auth.currentUser.photoURL);
  const [userData, setUserData] = useState({
    name: auth.currentUser.displayName,
    image: auth.currentUser.photoURL,
    email: auth.currentUser.email,
  });
  const [textasd, setText] = useState("");

  const validateEmail = (email) => {
    return email.match(
      /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
    });
    if (!result.canceled) {
      const fileName = result.assets[0].uri.split("/").pop();
      const imageRef = ref(storage, fileName);
      const image = await fetch(result.assets[0].uri);
      const bytes = await image.blob();
      await uploadBytes(imageRef, bytes).then(() => {
        getDownloadURL(imageRef).then((url) => {
          setImg(url);
          setText("Image uploaded");
        });
      });
    }
  };

  const save = async () => {
    if (!validateEmail(mail)) {
      alert("Invalid email");
      return;
    }
    await updateProfile(auth.currentUser, {
      displayName: username,
      photoURL: img,
    }).catch((error) => alert(error));
    await updateEmail(auth.currentUser, mail);
    const dbRef = await doc(db, "users", auth.currentUser.uid);
    await updateDoc(dbRef, {
      username: username,
      image: img,
      email: mail,
    });
    await setUserData({ name: username, image: img, email: mail });
    if (pass != "" || pass2 != "") {
      if (pass == pass2) {
        updatePassword(auth.currentUser, pass).catch((error) => {
          alert(error);
        });
      } else {
        alert("Passwords do not match!");
      }
    }
    alert("Update successful");
  };
  return (
    <ScrollView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#1c2026",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          padding: 10,
          marginTop: 15,
          width: "100%",
          alignSelf: "center",
          backgroundColor: "#202e42",
          marginBottom: 15,
        }}
      >
        <Image
          style={{
            height: 150,
            width: 150,
            borderRadius: 100,
          }}
          source={{ uri: userData.image }}
        ></Image>
        <View style={{ display: "flex", flexDirection: "column", padding: 10 }}>
          <Text
            style={{ padding: 5, fontSize: 35, maxWidth: 200, color: "white" }}
          >
            {userData.name}{" "}
          </Text>
          <Text style={{ paddingLeft: 7, fontSize: 15, color: "white" }}>
            {auth.currentUser.email}
          </Text>
          <Pressable
            onPress={async () => await signOut(auth)}
            style={{
              width: 120,
              height: 30,
              backgroundColor: "#d41c1c",
              top: 20,
              borderRadius: 100,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Text style={{ top: 6, color: "white" }}>Log out</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ display: "flex", padding: 20 }}>
        <Text style={styles.profileText}>New username:</Text>
        <TextInput
          style={styles.inputProfile}
          onChangeText={(value) => {
            setUsername(value);
          }}
        ></TextInput>
        <Text style={styles.profileText}>New e-mail:</Text>
        <TextInput
          style={styles.inputProfile}
          onChangeText={(value) => {
            setMail(value);
          }}
        ></TextInput>
        <Text style={styles.profileText}>New profile picture:</Text>
        <Pressable
          onPress={pickImage}
          style={{
            height: 30,
            width: 150,
            alignSelf: "center",
            backgroundColor: "#354761",
            borderColor: "gray",
            borderWidth: 2,
            borderRadius: 10,
            marginTop: 5,
            paddingLeft: 10,
            color: "white",
          }}
        >
          <Text
            style={{ alignSelf: "center", marginTop: 2, color: "lightblue" }}
          >
            Upload
          </Text>
          <Text
            style={{
              fontSize: 15,
              alignSelf: "center",
              color: "green",
              marginTop: 9,
            }}
          >
            {textasd}
          </Text>
        </Pressable>
        <Text style={styles.profileText}>New password:</Text>
        <TextInput
          style={styles.inputProfile}
          secureTextEntry={true}
          onChangeText={(value) => {
            setPass(value);
          }}
        ></TextInput>
        <Text style={styles.profileText}>Confirm new password:</Text>
        <TextInput
          style={styles.inputProfile}
          secureTextEntry={true}
          onChangeText={(value) => {
            setPass2(value);
          }}
        ></TextInput>
        <Pressable
          onPress={save}
          style={{
            height: 30,
            width: 150,
            alignSelf: "center",
            backgroundColor: "#354761",
            borderColor: "gray",
            borderWidth: 2,
            borderRadius: 10,
            marginTop: 20,
            paddingLeft: 10,
            color: "white",
          }}
        >
          <Text
            style={{ alignSelf: "center", marginTop: 2, color: "lightblue" }}
          >
            Save
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
