//te srive para manejar los metodos de firabse

import { firebaseapp } from "./Firebase";
import * as firebase from 'firebase';
import Constants from "expo-constants";
import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import 'firebase/firestore';
import uuid from 'random-uuid-v4'
//permite hacer una iteracion de cada imagen
import {map, result} from 'lodash'
//para que se conecta la BD
import { convertirFicheroBlob} from './ValidarEmail'

/// codigo para manejar las notificaciones y personalizarlas
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge:true
    })
})


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

export const validarPhone = (setphoneauth) => {

    db.collection("Usuarios") //solo aplica cuando el usuario mete # correctamente
    .doc(ObtenerUsuario().uid)
    .onSnapshot( snapshot => {
        //que que ocupamos si la ruta existe o no
        setphoneauth(snapshot.exists)
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

//metodo que agrega registro a la BD
//recibe el nombre de la coleccion, documento, y los datos

// merge de colocar los nuevos datos en firesote en un dcoumento.


export const addRegistroEspecifico = async (coleccion,doc,data) => {
    const resultado = { error: "", statusresponse : false, data: null}

    await  db
    .collection(coleccion)
    .doc(doc)
    .set(data,{
        merge:true
    } )

    .then((response) => {
        resultado.statusresponse = true
    })
    .catch((err)=> {
        resultado.error = err;
        console.log(err)
    })

    return resultado;

}

//funcion que sube la imagen al storage de firebase
//va arecibir un array de imagenes, y la ruta de la imagen 
//vamos a gurdar esas fotos en un folder en firebase que se llame fotos de perfil

export const subirImagenesBatch = async (imagenes, ruta) =>{

    //para subir las imagenes a firebase necesiotamos subirlas en formato blob (datos inmutables)

    const imagenesurl = [];


    //para que fluya el resto de la informacion en la aplicacion,
    //sube una imagen y continua con la ejecución

    await Promise.all(

        map(imagenes, async (image)=> {

                //convierte la imagen en forma blob
                const blob = await convertirFicheroBlob(image)

                //ruta para guardar la imagen en el storage en un lugar unico
                const ref = firebase.storage().ref(ruta).child(uuid())

                //sube la imagen a firebase
                //y obtenemos la ruta y el nombre del uuid unico

                await ref.put(blob)

                
                .then(async(result) => {
                    await firebase.storage()
                    .ref(`${ruta}/${result.metadata.name}`)
                    .getDownloadURL() //metodo que obtiene url de firebase y la pone en la ruta unica en el array

                    
                    .then((imagenurl) =>{
                        imagenesurl.push(imagenurl)
                        console.log(imagenurl)
                    })
                })
        })

    )
    return imagenesurl
}

export const actualizarPerfil = async (data)=> {

    let respuesta = false;

   await firebase.auth()
   .currentUser.updateProfile(data)

   .then((response) => {
       respuesta = true
   })
   .catch((error) =>{
       console.log(error)
   })

   return respuesta;

}

/// esta funcion sirve para reutantificar y poder cambiar los datos de perfil

export const reautenticar = async (verificationId,code) => {

    let response = { statusresponse: false}


    const credenciales = new firebase.auth.PhoneAuthProvider.credential(verificationId,code)

    await firebase
    .auth()
    .currentUser.reauthenticateWithCredential(credenciales)
    .then((resultado) => (response.statusresponse = true))
    .catch((err) => {console.log(err)})

    return response;
}

export const actualizaremailfirebase = async (email) => {
    let response =  { statusresponse : false}

    await firebase
    .auth()
    .currentUser.updateEmail(email)
    .then((respuesta) => {
        response.statusresponse = true
    })
    .catch((err)=> {
        response.statusresponse = false
        console.log(err)
    })

    return response;
}


export const actualizarTelefono = async (verificationId, code) => {

    let response = {statusresponse : false}

    const credenciales =  new firebase.auth.PhoneAuthProvider.credential(verificationId,code)

    await firebase
    .auth()
    .currentUser.updatePhoneNumber(credenciales)
    .then((resultado) => ( response.statusresponse = true))
    .catch ((err) => {
        console.log(err)
    })

    return response;


}