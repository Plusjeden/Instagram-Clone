import { View, Text, ScrollView, Button, Image, TextInput } from "react-native";
import React from "react";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { storage, db, auth } from "../../firebase";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { styles } from "../../styles";
import {
  addDoc,
  collection,
  serverTimestamp,
  updateDoc,
  doc,
  getDoc,
} from "firebase/firestore";
import Pressable from "react-native/Libraries/Components/Pressable/Pressable";
export default function Upload() {
  const [img, setImg] = useState("");
  const [postTitle, setTitle] = useState("");
  const [postDesc, setDesc] = useState("");
  const [textasd, setText] = useState("");

  const postRef = collection(db, "posts");

  const submitPost = async () => {
    if (postTitle != "" && postDesc != "" && img != "") {
      const post = await addDoc(postRef, {
        title: postTitle,
        desc: postDesc,
        image: img,
        date: "12/11/2022",
        timestamp: serverTimestamp(),
        author: {
          id: auth.currentUser.uid,
        },
        likedby: [],
        comments: [],
      }).then(alert("Post created"));
      const data1 = await getDoc(doc(db, "users", auth.currentUser.uid));
      const data = data1.data().posts;
      data.push(post.id);
      console.log(data);
      await updateDoc(doc(db, "users", auth.currentUser.uid), {
        posts: data,
      });
    } else alert("You need to fill all information before posting");
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
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

  return (
    <ScrollView
      style={{
        height: "100%",
        width: "100%",
        backgroundColor: "#192536",
      }}
    >
      <View style={{ width: "95%", alignSelf: "center" }}>
        <Text style={styles.profileText}>Create a new post:</Text>
        <Text style={styles.profileText}>Title:</Text>
        <TextInput
          keyboardAppearance="dark"
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
            setTitle(value);
          }}
        ></TextInput>
        <Text style={styles.profileText}>Select photo:</Text>
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
            marginTop: 50,
            paddingLeft: 10,
            color: "white",
          }}
        >
          <Text
            style={{ alignSelf: "center", marginTop: 2, color: "lightblue" }}
          >
            Upload image
          </Text>
        </Pressable>
        <Text style={{ fontSize: 20, alignSelf: "center", color: "green" }}>
          {textasd}
        </Text>
        <Text style={styles.profileText}>Description:</Text>
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
            setDesc(value);
          }}
        ></TextInput>
        <Pressable
          onPress={submitPost}
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
            style={{ alignSelf: "center", marginTop: 2, color: "lightblue" }}
          >
            Upload post
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}
