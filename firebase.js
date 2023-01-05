// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getFirestore } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth/react-native";

// TODO: Add SDKs for Firebase products that you want to use

// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration

const firebaseConfig = {
  apiKey: "AIzaSyDPAukrdEBx42xb6Qu9BacWT7M9GfDBgYU",

  authDomain: "coolapp-45881.firebaseapp.com",

  projectId: "coolapp-45881",

  storageBucket: "coolapp-45881.appspot.com",

  messagingSenderId: "884579815800",

  appId: "1:884579815800:web:c16ad28b35bf85a42eb88d",
};
export const app = initializeApp(firebaseConfig);
// Initialize Firebase
//export const auth = getAuth(app);
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
export const storage = getStorage(app);
export const db = getFirestore(app);
