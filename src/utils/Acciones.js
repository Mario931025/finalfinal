//te srive para manejar los metodos de firabse

import { firebaseapp } from "./Firebase";
import * as firebase from 'firebase';

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