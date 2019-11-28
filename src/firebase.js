import firebase from 'firebase/app';
import 'firebase/database';

const firebaseConfig = {
    apiKey: "AIzaSyDeDpcgUhIRq4pS05q_gcbCsimItUJHRr0",
    authDomain: "lauren-overflow.firebaseapp.com",
    databaseURL: "https://lauren-overflow.firebaseio.com",
    projectId: "lauren-overflow",
    storageBucket: "lauren-overflow.appspot.com",
    messagingSenderId: "149714945568",
    appId: "1:149714945568:web:ed5b8dc1ef6d00d8f31e45"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;