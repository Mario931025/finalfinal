import firebase from 'firebase/app'

const firebaseConfig = {
    apiKey: "AIzaSyCmyJhedg8JzQrqgQEAiVvLS-fEt3VW_wY",
    authDomain: "fesappprueba.firebaseapp.com",
    projectId: "fesappprueba",
    storageBucket: "fesappprueba.appspot.com",
    messagingSenderId: "598434285824",
    appId: "1:598434285824:web:27fef493e160d18b82cbe5"
  };


export const firebaseapp = firebase.initializeApp(firebaseConfig)