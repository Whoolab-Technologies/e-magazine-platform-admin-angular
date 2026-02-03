import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";

export const environment = {
  production: true,
  hmr: false,

  firebaseConfig: {
    apiKey: "YOUR_FIREBASE_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_FIREBASE_APP_ID",
  },

  cloudBaseUrl: "https://REGION-YOUR_PROJECT_ID.cloudfunctions.net",

  endPoints: {
    notification: "/notification",
    class: "/createClass",
    admin: "/createAdmin",
    removeClass: "/removeClass",
    removeSubject: "/removeSubject",
    editSubject: "/editSubject",
  },
};

// Initialize Firebase
export const app = initializeApp(environment.firebaseConfig);
export const analytics = getAnalytics(app);
