import { ScrollView, RefreshControl, View } from "react-native";
import React, { useEffect } from "react";
import PostCard from "../PostCard";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase";
import { useState } from "react";
import Header from "../Header";

const PostScreen = ({ navigation, route }) => {
  const [posts, setPosts] = useState([]);
  const [refreshing, setRefresh] = useState(false);
  const postRef = collection(db, "posts");
  const q = query(postRef, orderBy("timestamp", "desc"));

  const getPosts = async () => {
    const data = await getDocs(q);
    await setPosts(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    //console.log("post");
    setRefresh(false);
  };

  useEffect(() => {
    getPosts();
  }, []);

  return (
    <View>
      <ScrollView
        style={{ height: "100%", width: "100%", backgroundColor: "#1c2026" }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => {
              getPosts();
            }}
          ></RefreshControl>
        }
      >
        {posts.map((value) => (
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
        ))}
      </ScrollView>
    </View>
  );
};

export default PostScreen;
