// import * as firebase from "firebase";
import firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';

var config = {
    
    apiKey: process.env.VUE_APP_FIREBASE_API_KEY,
    authDomain: "droidconke-70d60.firebaseapp.com",
    databaseURL: "https://droidconke-70d60.firebaseio.com",
    projectId: "droidconke-70d60",
    storageBucket: "droidconke-70d60.appspot.com",
    // messagingSenderId: process.env.VUE_APP_FIREBASE_MESSAGE_ID,

  }; // 4. Get Firebase Configuration
  firebase.initializeApp(config);

  export default firebase
