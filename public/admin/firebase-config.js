import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyACvMULzCWpxmAjCme3bhSrUDeehpuKIPI",
  authDomain: "drheshamngim.firebaseapp.com",
  projectId: "drheshamngim",
  storageBucket: "drheshamngim.appspot.com",
  messagingSenderId: "810852052392",
  appId: "1:810852052392:web:669c45a698ca9296db819d",
  measurementId: "G-H8LE96VNHK",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
