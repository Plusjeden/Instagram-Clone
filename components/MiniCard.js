import { View, Text, Image, Pressable } from "react-native";
import React, { useState } from "react";
const MiniCard = (props) => {
  // const [date, setDate] = useState("null");
  const dateNow = new Date();
  const dateNow1 = Math.floor(dateNow.getTime() / 1000);

  const date2 = props.date.toMillis();

  const date1 = Math.round(dateNow1 - date2 / 1000);
  let date = "asd";

  if (date1 < 86400) {
    if (date1 < 3600) {
      date = `Uploaded ${Math.round(date1 / 60)} minutes ago`;
    } else {
      date = `Uploaded ${Math.round(date1 / 3600)} hours ago`;
    }
  } else {
    if (date1 < 172800) {
      date = `Uploaded yesterday`;
    } else {
      /*date = `Uploaded on ${props.time.toDate().getDate()}-${props.time
        .toDate()
        .getMonth()}-${props.time.toDate().getFullYear()}`;*/
      date = `Uploaded ${Math.round(date1 / 3600 / 24)} days ago`;
    }
  }
  return (
    <View style={{ width: "50%" }}>
      <Pressable
        onPress={() => {
          props.nav.navigate("ViewPost", {
            post: props.id,
            user: props.user,
            date: date,
          });
        }}
      >
        <Image
          source={{
            uri: props.image,
          }}
          style={{
            width: 210,
            height: 200,
          }}
        ></Image>
      </Pressable>
    </View>
  );
};

export default MiniCard;
