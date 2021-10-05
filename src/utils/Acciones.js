//te srive para manejar los metodos de firabse

import { firebaseapp } from "./Firebase";
import * as firebase from 'firebase';
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import 'firebase/firestore';


const db = firebase.firestore(firebaseapp);

export const validarsesion = (setvalidarsesion) =>{

    firebase.auth().onAuthStateChanged((user) => {

        if(user){
            setvalidarsesion(true)
        }else{
            setvalidarsesion(false)
        }
    } )

}



export const cerrarsesion = () => {

    firebase.auth().signOut()
    console.log("Has cerrado sesión")
}

export const validarPhone = () => {

    firebase.auth().onAuthStateChanged((user) => {

        if(user.phoneNumber){
            setphoneauth(true)
        }

    })
}


export const enviarConfimacion = async (numero,recapcha) => {

    let verificationid = "";

    await firebase
    .auth()
    .currentUser.reauthenticateWithPhoneNumber(numero,recapcha.current)
    .then((response)=> {
        verificationid = response.verificationId
    })
    .catch((err)=>{
     console.log(` hay un error: ${err} `)
    })

    return verificationid

}

export const confirmarcodigo = async(verificationid,codigo)=> {

    let resultado = "";

    const credenciales = firebase.auth.PhoneAuthProvider.credential(verificationid,codigo)

    await firebase
    .auth()
    .currentUser
    .linkWithCredential(credenciales)
    .then((response => resultado = true ))
    .catch(err => console.log(err))

    return resultado;


}


export const enviarAutentificacionphone = async (numero,recapcha)=> {

    let verificationid = "";

   await firebase
        .auth()
        .currentUser.reauthenticateWithPhoneNumber(numero,recapcha.current)
        .then((response) => {
            verificationid = response.verificationId
        })
        .catch((err) => {
            console.log(`Tenemos error en la
            verificaicon del numero ${err}
            `)
        })

        return verificationid
}

export const obtenerToken = async () => {
    let token = "";
    if (Constants.isDevice) {
      const { status: existingStatus } = await Permissions.getAsync(
        Permissions.NOTIFICATIONS
      );
      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
        finalStatus = status;
      }
      if (finalStatus !== "granted") {
        alert("Failed to get push token for push notification!");
        return;
      }
      //aqui asigna el valor al token 
      token = (await Notifications.getExpoPushTokenAsync()).data;
    } else {
      alert("Must use physical device for Push Notifications");
    }
  
    if (Platform.OS === "android") {
      Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FF231F7C",
      });
    }
    return token;
  };


export const ObtenerUsuario = () => {
    return firebase.auth().currentUser;
}


export const addRegistroEspecifico = async (coleccion,doc,data) => {
    const resultado = { error: "", statusresponse : false, data: null}

    await  db
    .collection(coleccion)
    .doc(doc)
    .set(data)

    .then((response) => {
        resultado.statusresponse = true
    })
    .catch((err)=> {
        resultado.error = err;
        console.log(err)
    })

    return resultado;

}
