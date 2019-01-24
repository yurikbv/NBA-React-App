import * as firebase from 'firebase';

const config = {
  apiKey: "AIzaSyCChq0n39kbqdYjup0fc7LKARfwxIrlbLo",
  authDomain: "nba-full-a8fb7.firebaseapp.com",
  databaseURL: "https://nba-full-a8fb7.firebaseio.com",
  projectId: "nba-full-a8fb7",
  storageBucket: "nba-full-a8fb7.appspot.com",
  messagingSenderId: "816032445048"
};

firebase.initializeApp(config);

const firebaseDB = firebase.database();
const firebaseArticles = firebaseDB.ref('articles');
const firebaseTeams = firebaseDB.ref('teams');
const firebaseVideos = firebaseDB.ref('videos');

const firebaseLooper = (snapshot) => {
  const data = [];
  snapshot.forEach((childSnapshot) => {
    data.push(childSnapshot.val())
  });
  return data;
};

export {
  firebase,
  firebaseDB,
  firebaseArticles,
  firebaseTeams,
  firebaseVideos,
  firebaseLooper
}