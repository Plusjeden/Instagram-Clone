import {
  View,
  Text,
  Button,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
  TextInput,
} from "react-native";
import React, { useEffect, useState } from "react";
import { db, auth } from "../../firebase";
import { doc, getDoc, query, updateDoc } from "firebase/firestore";
import Comment from "./Comment";
import Header from "../Header";

const ViewPost = (props) => {
  const [post, setPost] = useState({});
  const [user, setUser] = useState({});
  const [comms, setComms] = useState([]);
  const [likeCount, setLikes] = useState(props.route.params.likes);
  const [txt, setTxt] = useState(
    props.route.params.txt == "Like!" ? "black" : "red"
  );
  const [comment, setComment] = useState("");
  const handleLike = async () => {
    const data1 = await getDoc(doc(db, "posts", props.route.params.post));
    const data = data1.data().likedby;
    const isLiked = data.includes(auth.currentUser.uid);
    if (isLiked == false) {
      const ok = data;
      ok.push(auth.currentUser.uid);
      updateDoc(doc(db, "posts", props.route.params.post), {
        likedby: ok,
      });
      setLikes(likeCount + 1);
      setTxt("red");
    } else {
      const ok2 = data;
      ok2.splice(data.indexOf(auth.currentUser.uid));
      updateDoc(doc(db, "posts", props.route.params.post), {
        likedby: ok2,
      });
      setLikes(likeCount - 1);
      setTxt("black");
    }
  };

  const postComment = async () => {
    const data1 = await getDoc(doc(db, "posts", props.route.params.post));
    const data = await data1.data().comments;
    data.push({ content: comment, user: auth.currentUser.uid });
    await updateDoc(doc(db, "posts", props.route.params.post), {
      comments: data,
    });
    await getPost();
  };

  const getPost = async () => {
    const ref = doc(db, "posts", props.route.params.post);
    const data = await getDoc(ref);
    setPost(data.data());
    const asd = data.data().comments;
    asd.reverse();
    setComms(asd);
    const ref2 = doc(db, "users", props.route.params.user);
    const data2 = await getDoc(ref2);
    setUser(data2.data());
  };

  useEffect(() => {
    getPost();
  }, []);

  return (
    <View>
      <ScrollView style={{ backgroundColor: "#192536" }}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderColor: "#090e14",
            paddingVertical: 5,
            borderBottomWidth: 2,
            borderTopWidth: 2,
            backgroundColor: "#202e42",
            marginTop: 10,
          }}
        >
          <Pressable onPress={() => props.navigation.goBack()}>
            <Image
              source={{
                uri: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-back-512.png",
              }}
              style={{
                width: 50,
                height: 50,
                tintColor: "black",
                marginTop: 15,
              }}
            ></Image>
          </Pressable>
          <Pressable
            onPress={() => {
              props.navigation.navigate("ShowUser", {
                user: user,
              });
            }}
          >
            <Image
              source={{ uri: user.image }}
              style={{ width: 70, height: 70, margin: 5, borderRadius: 50 }}
            ></Image>
          </Pressable>

          <View>
            <Text style={{ fontSize: 35, marginLeft: 17, color: "white" }}>
              {user.username}
            </Text>
            <Text style={{ fontSize: 15, marginLeft: 17, color: "gray" }}>
              {props.route.params.date}
            </Text>
          </View>
        </View>
        <Text
          style={{ fontSize: 30, margin: 5, color: "white", marginLeft: 10 }}
        >
          {post.title}
        </Text>
        <Text
          style={{
            fontSize: 15,
            margin: 5,
            color: "white",
            marginLeft: 10,
            marginBottom: 10,
          }}
        >
          {post.desc}
        </Text>
        <Image
          resizeMode="contain"
          source={{ uri: post.image }}
          style={{
            width: useWindowDimensions().width + 100,
            height: 600,
            alignSelf: "center",
            backgroundColor: "black",
          }}
        ></Image>

        <View
          style={{
            display: "flex",
            flexDirection: "row",
            borderBottomColor: "black",
            paddingBottom: 5,
            borderBottomWidth: 2,
          }}
        >
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
                source={require("../../assets/like.png")}
                style={{
                  height: 30,
                  width: 33,
                  margin: 5,
                  tintColor: txt,
                }}
              ></Image>
              <Text style={{ fontSize: 15, color: "white" }}>
                {likeCount} Likes
              </Text>
            </Pressable>
            <Pressable
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
                {comms.length} {comms.length == 1 ? "Comment" : "Comments"}
              </Text>
            </Pressable>
          </View>
        </View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <TextInput
            onChangeText={(value) => {
              setComment(value);
            }}
            style={{
              height: 30,
              paddingLeft: 10,
              width: "80%",
              borderColor: "black",
              borderWidth: 2,
              borderRadius: 10,
              margin: 10,
              marginBottom: 10,
              color: "white",
            }}
            placeholder={"comment"}
          ></TextInput>
          <Pressable>
            <Text
              style={{ fontSize: 18, marginTop: 10, color: "white" }}
              onPress={postComment}
            >
              submit
            </Text>
          </Pressable>
        </View>
        {comms.map((value) => (
          <Comment
            key={Math.floor(Math.random() * 50000).toString()}
            content={value.content}
            user={value.user}
            nav={props.navigation}
          ></Comment>
        ))}
      </ScrollView>
    </View>
  );
};

export default ViewPost;
