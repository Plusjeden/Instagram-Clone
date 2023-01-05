import { View, Text, Image, Pressable, Button } from "react-native";
import React, { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
const PostCard = (props) => {
  const [img, setImg] = useState(
    "https://www.signfix.com.au/wp-content/uploads/2017/09/placeholder-600x400.png"
  );
  const [likeCount, setLikes] = useState(props.likes.length);
  const [txt, setTxt] = useState(
    props.likes.includes(auth.currentUser.uid) ? "red" : "black"
  );
  const [user, setUser] = useState({});
  // const [date, setDate] = useState("null");
  useEffect(() => {
    getImg();
    getName();
  }, []);
  const getImg = async () => {
    const snap = await getDoc(doc(db, "users", `${props.user}`));
    const data = await snap.data().image;
    setImg(data);
  };

  const [usernm, setuserNm] = useState("");

  const getName = async () => {
    const snap = await getDoc(doc(db, "users", `${props.user}`));
    const data = await snap.data();
    setuserNm(data.username);
    setUser(data);
  };

  const dateNow = new Date();
  const dateNow1 = Math.floor(dateNow.getTime() / 1000);

  const date2 = props.time.toMillis();

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

  const handleLike = async () => {
    const data1 = await getDoc(doc(db, "posts", props.id));
    const data = data1.data().likedby;
    const isLiked = data.includes(auth.currentUser.uid);
    if (isLiked == false) {
      const ok = data;
      ok.push(auth.currentUser.uid);
      updateDoc(doc(db, "posts", props.id), {
        likedby: ok,
      });
      setLikes(likeCount + 1);
      setTxt("red");
    } else {
      const ok2 = data;
      ok2.splice(data.indexOf(auth.currentUser.uid));
      updateDoc(doc(db, "posts", props.id), {
        likedby: ok2,
      });
      setLikes(likeCount - 1);
      setTxt("black");
    }
  };

  return (
    <View
      style={{
        display: "flex",
        flexDirection: "column",

        backgroundColor: "#192536",
        marginTop: 15,
        width: "100%",
        alignSelf: "center",
        maxHeight: 700,
        marginBottom: 5,
        borderBottomColor: "#090e14",
        borderBottomWidth: 2,
        borderTopColor: "#090e14",
        borderTopWidth: 2,
      }}
    >
      <View
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          padding: 5,
          borderBottomColor: "#090e14",
          borderBottomWidth: 2,
          backgroundColor: "#202e42",
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
            source={{
              uri: img,
            }}
            style={{ height: 70, width: 70, borderRadius: 100, margin: 5 }}
          ></Image>
        </Pressable>

        <View>
          <Text
            style={{
              paddingLeft: 15,
              paddingRight: 10,
              fontSize: 30,
              color: "white",
            }}
          >
            {usernm}
          </Text>
          <Text
            style={{
              paddingLeft: 15,
              paddingRight: 10,
              fontSize: 20,
              color: "gray",
            }}
          >
            {date}
          </Text>
        </View>
      </View>
      <Text
        style={{
          margin: 10,
          fontSize: 30,
          color: "white",
        }}
      >
        {props.title}
      </Text>
      <Pressable
        onPress={() => {
          props.nav.navigate("ViewPost", {
            post: props.id,
            user: props.user,
            date: date,
            likes: likeCount,
            txt: txt,
            comments: props.comments,
            nav: props.nav,
          });
        }}
      >
        <Image
          source={{
            uri: props.image,
          }}
          style={{ height: 400, width: "100%" }}
        ></Image>
      </Pressable>
      <View style={{ display: "flex", flexDirection: "row" }}>
        <Pressable
          style={{
            marginTop: 10,
            marginBottom: 10,
            display: "flex",
            flexDirection: "column",
            marginLeft: 20,
            alignContent: "center",
            justifyContent: "center",
          }}
          onPress={handleLike}
        >
          <Image
            source={require("../../CoolApp/assets/like.png")}
            style={{
              height: 30,
              width: 33,
              margin: 5,
              tintColor: txt,
            }}
          ></Image>
          <Text style={{ fontSize: 15, color: "white" }}>
            {likeCount} {likeCount == 1 ? "Like" : "Likes"}
          </Text>
        </Pressable>
        <Pressable
          onPress={() => {
            props.nav.navigate("ViewPost", {
              post: props.id,
              user: props.user,
              date: date,
              likes: likeCount,
              txt: txt,
              comments: props.comments,
            });
          }}
          style={{
            marginLeft: 20,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          <Image
            source={{
              uri: "https://cdn.iconscout.com/icon/free/png-256/comment-2551199-2136583.png",
            }}
            style={{
              height: 30,
              width: 33,
              margin: 5,
              tintColor: "white",
              marginLeft: 25,
            }}
          ></Image>
          <Text style={{ fontSize: 15, color: "white" }}>
            {props.comments.length}{" "}
            {props.comments.length == 1 ? "Comment" : "Comments"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

export default PostCard;
