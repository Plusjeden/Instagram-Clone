import {
  View,
  Text,
  ScrollView,
  Image,
  Pressable,
  Button,
  RefreshControl,
} from "react-native";
import React, { useEffect } from "react";
import { auth, db } from "../../firebase";
import {
  doc,
  getDocs,
  collection,
  query,
  getDoc,
  where,
  orderBy,
} from "firebase/firestore";
import { useState } from "react";
import PostCard from "../PostCard";
import { styles } from "../../styles";
import MiniCard from "../MiniCard";

const ShowProfile = ({ navigation }) => {
  const [posts, setPosts] = useState([]);
  const [postsFollowing, setPostsFollowing] = useState([]);
  const [user, setUser] = useState(auth.currentUser);
  const [viewType, setViewType] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [following, setFollowing] = useState("?");
  const [followCount, setFollowCount] = useState("?");
  const [followView, setFollowView] = useState(false);

  const getPosts = async () => {
    const q = query(
      collection(db, "posts"),
      where("author.id", "==", user.uid)
    );
    const data = await getDocs(query(q, orderBy("timestamp", "desc")));
    await setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
    const dataa = await snap.data().followers;
    const dataaa = await snap.data().following;
    setFollowCount(dataa.length);
    setFollowing(dataaa.length);
    if (dataaa.length != 0) {
      const q2 = query(
        collection(db, "posts"),
        where("author.id", "in", dataaa)
      );
      const data2 = await getDocs(q2);
      setPostsFollowing(
        data2.docs.map((doc) => ({ ...doc.data(), id: doc.id }))
      );
    }
    setRefresh(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            getPosts();
          }}
        ></RefreshControl>
      }
      style={{ backgroundColor: "#1c2026" }}
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
          source={{ uri: user.photoURL }}
        ></Image>
        <View style={{ display: "flex", flexDirection: "column", padding: 10 }}>
          <Text
            style={{ padding: 5, fontSize: 35, maxWidth: 200, color: "white" }}
          >
            {user.displayName}{" "}
          </Text>
          <Text
            style={{
              paddingLeft: 7,
              fontSize: 19,
              color: "white",
              marginTop: 5,
            }}
          >
            {followCount} {followCount == 1 ? "Follower" : "Followers"}
          </Text>
          <Pressable
            onPress={() => {
              followView ? setFollowView(false) : setFollowView(true);
            }}
          >
            <Text
              style={{
                paddingLeft: 7,
                fontSize: 19,
                color: "white",
                marginTop: 15,
              }}
            >
              {following} Following
            </Text>
            <Text
              style={{
                paddingLeft: 7,
                fontSize: 15,
                color: "white",
                marginTop: 0,
              }}
            >
              Click here
            </Text>
          </Pressable>
        </View>
      </View>
      <View>
        <View style={{ display: "flex", flexDirection: "row" }}>
          <Text
            style={{
              color: "white",
              fontSize: 25,
              marginVertical: 10,
              marginLeft: 10,
            }}
          >
            {followView ? "Following: " : "User posts: "}
          </Text>
          <Text
            style={{
              fontSize: 20,
              color: "white",
              marginVertical: 15,
              marginLeft: 60,
            }}
          >
            View type:{" "}
          </Text>
          <Pressable
            onPress={() => {
              setViewType(true);
            }}
            style={{ marginHorizontal: 10, marginVertical: 15 }}
          >
            <Image
              source={require("../../assets/squares.png")}
              style={{
                height: 30,
                width: 30,
                tintColor: viewType ? "white" : "black",
              }}
            ></Image>
          </Pressable>
          <Pressable
            onPress={() => {
              setViewType(false);
            }}
            style={{ marginHorizontal: 10, marginVertical: 15 }}
          >
            <Image
              source={{
                uri: "https://uxwing.com/wp-content/themes/uxwing/download/web-app-development/four-squares-icon.png",
              }}
              style={{
                height: 30,
                width: 30,
                tintColor: !viewType ? "white" : "black",
              }}
            ></Image>
          </Pressable>
        </View>

        {!followView ? (
          viewType ? (
            posts.map((value) => (
              <PostCard
                title={value.title}
                user={value.author.id}
                image={value.image}
                key={value.id}
                time={value.timestamp}
                likes={value.likedby}
                id={value.id}
                nav={navigation}
                desc={value.desc}
                comments={value.comments}
              />
            ))
          ) : (
            <View
              style={{
                display: "flex",
                flexDirection: "row",
                flexWrap: "wrap",
                width: "100%",
              }}
            >
              {posts.map((value) => (
                <MiniCard
                  date={value.timestamp}
                  title={value.title}
                  user={value.author.id}
                  image={value.image}
                  key={value.id}
                  time={value.timestamp}
                  likes={value.likedby}
                  id={value.id}
                  nav={navigation}
                  desc={value.desc}
                />
              ))}
            </View>
          )
        ) : viewType ? (
          postsFollowing.map((value) => (
            <PostCard
              title={value.title}
              user={value.author.id}
              image={value.image}
              key={value.id}
              time={value.timestamp}
              likes={value.likedby}
              id={value.id}
              nav={navigation}
              desc={value.desc}
              comments={value.comments}
            />
          ))
        ) : (
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              flexWrap: "wrap",
              width: "100%",
            }}
          >
            {postsFollowing.map((value) => (
              <MiniCard
                date={value.timestamp}
                title={value.title}
                user={value.author.id}
                image={value.image}
                key={value.id}
                time={value.timestamp}
                likes={value.likedby}
                id={value.id}
                nav={navigation}
                desc={value.desc}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ShowProfile;
