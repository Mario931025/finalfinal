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