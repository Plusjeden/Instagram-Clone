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
  getDoc,
  collection,
  query,
  where,
  orderBy,
  updateDoc,
} from "firebase/firestore";
import { useState } from "react";
import PostCard from "../PostCard";
import { styles } from "../../styles";
import MiniCard from "../MiniCard";

const ShowUser = (props) => {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(props.route.params.user);
  const [viewType, setViewType] = useState(true);
  const [refreshing, setRefresh] = useState(false);
  const [follow, setFollow] = useState(
    user.followers.includes(auth.currentUser.uid)
  );
  const [followCount, setFollowCount] = useState(user.followers.length);

  const getPosts = async () => {
    const q = query(
      collection(db, "posts"),
      where("author.id", "==", user.uuid)
    );
    const data = await getDocs(query(q, orderBy("timestamp", "desc")));
    await setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //console.log("post");
    setRefresh(false);
    //if (user.uuid == auth.currentUser.uid) console.log(123);
  };

  const handleFollow = async () => {
    if (auth.currentUser.uid != user.uuid) {
      if (follow == false) {
        const ok = user.followers;
        console.log(ok);
        ok.push(auth.currentUser.uid);
        updateDoc(doc(db, "users", user.uuid), {
          followers: ok,
        });
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const data = await snap.data().following;
        data.push(user.uuid);
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          following: data,
        });
        setFollowCount(follow + 1);
        setFollow(true);
      } else {
        const ok2 = user.followers;
        ok2.splice(user.followers.indexOf(auth.currentUser.uid));
        updateDoc(doc(db, "users", user.uuid), {
          followers: ok2,
        });
        const snap = await getDoc(doc(db, "users", auth.currentUser.uid));
        const data = await snap.data().following;
        data.splice(data.indexOf(user.uuid));
        await updateDoc(doc(db, "users", auth.currentUser.uid), {
          following: data,
        });
        setFollowCount(follow - 1);
        setFollow(false);
      }
    } else {
      alert("You can't follow yourself!");
    }
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
        <Pressable onPress={() => props.navigation.goBack()}>
          <Image
            source={{
              uri: "https://cdn4.iconfinder.com/data/icons/ionicons/512/icon-ios7-arrow-back-512.png",
            }}
            style={{
              width: 50,
              height: 50,
              tintColor: "black",
              marginLeft: -15,
              position: "absolute",
            }}
          ></Image>
        </Pressable>
        <Image
          style={{
            height: 150,
            width: 150,
            borderRadius: 100,
            marginLeft: 30,
          }}
          source={{ uri: user.image }}
        ></Image>
        <View style={{ display: "flex", flexDirection: "column", padding: 10 }}>
          <Text
            style={{ padding: 5, fontSize: 35, maxWidth: 200, color: "white" }}
          >
            {user.username}{" "}
          </Text>
          <Text style={{ paddingLeft: 7, fontSize: 15, color: "white" }}>
            {followCount} {followCount == 1 ? "Follower" : "Followers"}
          </Text>
          <Pressable
            style={{
              width: 80,
              height: 30,
              backgroundColor: "blue",
              top: 20,
              borderRadius: 100,
              display: "flex",
              alignItems: "center",
            }}
            onPress={handleFollow}
          >
            <Text style={{ top: 6, color: "white" }}>
              {follow ? "Followed" : "Follow"}
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
            User posts:
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

        {viewType ? (
          posts.map((value) => (
            <PostCard
              title={value.title}
              user={value.author.id}
              image={value.image}
              key={value.id}
              time={value.timestamp}
              likes={value.likedby}
              id={value.id}
              nav={props.navigation}
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
              justifyContent: "center",
              alignContent: "center",
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
                nav={props.navigation}
                desc={value.desc}
              />
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default ShowUser;
