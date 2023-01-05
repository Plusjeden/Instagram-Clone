import { View, Text, Image, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, updateDoc } from "firebase/firestore";

const Comment = (props) => {
  const [user, setUser] = useState({});

  const getUser = async () => {
    const ref = doc(db, "users", props.user);
    const data = await getDoc(ref);
    setUser(data.data());
  };

  useEffect(() => {
    getUser();
  }, []);

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",
        borderTopColor: "black",
        borderTopWidth: 2,
        padding: 10,
        backgroundColor: "#202e42",
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Pressable
          onPress={() => {
            props.nav.navigate("ShowUser", {
              user: user,
            });
          }}
        >
          <Image
            source={{ uri: user.image }}
            style={{ width: 50, height: 50, borderRadius: 100 }}
          ></Image>
        </Pressable>
        <Text style={{ fontSize: 18, marginLeft: 10, color: "lightgray" }}>
          {user.username}
        </Text>
      </View>
      <Text style={{ fontSize: 22, marginTop: 5, color: "white" }}>
        {props.content}
      </Text>
    </View>
  );
};

export default Comment;
