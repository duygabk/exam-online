import * as firebase from "firebase";

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyC_pbuxgg-_MLI2ltEaRDjujcvgXH1gwyY",
  authDomain: "aaaaa-580ef.firebaseapp.com",
  databaseURL: "https://aaaaa-580ef.firebaseio.com",
  projectId: "aaaaa-580ef",
  storageBucket: "aaaaa-580ef.appspot.com",
  messagingSenderId: "868780603999",
  appId: "1:868780603999:web:3eeaf07ebe00853fceb9ea",
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const DATABASE = "app-data/exam";
const data = firebase.database().ref(DATABASE);

export function getAllExamFromFirebase() {
  return data.once("value").then((snapshot) => {
    // return JSON.parse(snapshot.val());
    return snapshot.val();
  });
}

export function addOneExamToFireBase(oneExam){
  return data.push(JSON.stringify(oneExam));
}

export function updateExamWithKey(examKey, editedExam) {
  return data.child(examKey).set(JSON.stringify(editedExam));
}

export function removeExamWithKey(examKey) {
  return data.child(examKey).remove();
}

// data for user
const USER_TABLE = "app-data/user";
const dataUSer = firebase.database().ref(USER_TABLE);

export function getAllUserFromFirebase() {
  return dataUSer.once("value").then(userSnapshot => {
    return userSnapshot.val();
  })
}

export function addUserToFireBase(user) {
  return dataUSer.push(JSON.stringify(user));
}
