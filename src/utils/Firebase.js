import firebase from 'firebase/app'

const firebaseConfig = {
  apiKey: "AIzaSyBum-rqpDfzfb6uYofSP2GCoyOr46T-w4k",
  authDomain: "bunkan-app-8d29e.firebaseapp.com",
  projectId: "bunkan-app-8d29e",
  storageBucket: "bunkan-app-8d29e.appspot.com",
  messagingSenderId: "891363942478",
  appId: "1:891363942478:web:fe675089ff8b010f22631f",
  measurementId: "G-G4W7R4BK4X"
  };


export const firebaseapp = firebase.initializeApp(firebaseConfig)