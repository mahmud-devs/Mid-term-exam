// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyAatIpp3mODnGYk4BT83_c0gxJH01ANheY",
  authDomain: "infinite-chat-on.firebaseapp.com",
  projectId: "infinite-chat-on",
  storageBucket: "infinite-chat-on.appspot.com",
  messagingSenderId: "710740363507",
  appId: "1:710740363507:web:5237e242bfb41925148f86",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
