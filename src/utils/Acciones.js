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
import { FireSQL } from 'firesql'





const db = firebase.firestore(firebaseapp);

//conecta firessotore con sql
const fireSQL = new FireSQL(firebase.firestore(), { includeId: "id" });
//codigo para manejar las notificaciones y personalizarlas

/// codigo para manejar las notificaciones y personalizarlas
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge:true
    })
})



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

//funcion que se encarga de subir los productos a firebase

export const addRegistro = async(coleccion,data) => {

    const resultado = {error: "", statusresponse: false}
  
    await db.collection(coleccion)
    .add(data)

    .then((response)=> {
      resultado.statusresponse = true;
    })
    .catch((err)=>{
      resultado.error = err;
    })
    
    return resultado;
  }

//funcion lista los productos en mi tienda 
//retorna una arreglo de los productos

export const listarMisProductos = async () => {

    let productos = []

    await db
    .collection("Productos")
    .where("usuario" , "==", ObtenerUsuario().uid) //campo usuario sea igual al id del usuario
    .where("status","==",1)
    .get() //obtiene los datos en este caso de los productos de este usuario 
    .then((response) => {
        response.forEach((doc)=> {
            const producto = doc.data()
            producto.id = doc.id
            productos.push(producto)
        })
    })
    .catch((err) => {
        console.log(err)
    })

    return productos;
}

export const actualizarRegistro = async(coleccion,documento,data) => {

    let response = {statusresponse:false}

    await db.collection(coleccion).doc(documento)
    .update(data)
    .then(res => response.statusresponse=true)
    .catch(err => console.log(err))

    return response

}

//funcion que elimina el registro de BD

export const eliminarProducto = async(coleccion,documento) => {
    let response ={ statusresponse : false}

    await db.collection(coleccion).doc(documento)
    .delete()
    .then(result => response.statusresponse = true)
    .catch(err => console.log(err))

    return response
}

//funcion que se encarga de obtener el id del producto 

export const obtenerRegistroxID = async(coleccion,documento) => {
    let response ={ statusresponse : false , data: null}

    await db.collection(coleccion)
    .doc(documento)
    .get()
    .then((result) => {
        const producto = result.data()

        producto.id = result.id
        
        response.data = producto
        response.statusresponse = true

    })

    .catch((err) => {
        console.log(err)
    })

    return response;
}

//se encarga de mostrar los productos en home,
//solo va a mostrar los productos activos

export const ListarProductos = async () => {

    const productoList = []
    let index = 0

    await db.collection("Productos")
    .where("status","==",1)
    .get()
    .then( response => {

        response.forEach((doc) => {

            const producto = doc.data()
            
            producto.id = doc.id

            productoList.push(producto)

        })

    })
    .catch( err => console.log(err))


    for(const registro of productoList ){
        const usuario = await obtenerRegistroxID("Usuarios" , registro.usuario)
        productoList[index].usuario = usuario.data
        index ++;
    }

    return productoList;
}


export const listarproductosxcategoria = async(categoria) => {

    const productoslist = []

    let index = 0;

    await db.collection("Productos")
    .where("status","==",1)
    .where("categoria","==",categoria)
    .get()
    .then(response => {

        response.forEach((doc) => {

            const producto = doc.data()

            producto.id = doc.id
            
            productoslist.push(producto)

        })
    })

    .catch(err => console.log(err))

    for(const registro of productoslist) {

        const usuario =  await obtenerRegistroxID("Usuarios" , registro.usuario)
        productoslist[index].usuario =  usuario.data

        index ++;

    }

    return  productoslist;


}


export const Buscar = async (search) => {
    let productos = [];
  
    await fireSQL
      .query(`SELECT * FROM Productos WHERE titulo LIKE '${search}%' `)
      .then((response) => {
        productos = response;
      });
  
    return productos;
  };


  export const iniciarnotificaciones = (
    notificationListener,
    responseListener
  ) => {
    notificationListener.current = Notifications.addNotificationReceivedListener(
      (notification) => {
        console.log(notification);
        console.log("me presionaste chido")
      }
    );
  
    responseListener.current = Notifications.addNotificationResponseReceivedListener(
      (response) => {
        console.log(response);
      }
    );
  
    return () => {
      Notifications.removeNotificationSubscription(notificationListener);
      Notifications.removeNotificationSubscription(responseListener);
    };
  };
  

  export const  sendPushNotification = async(mensaje) => {

    let respuesta = false

  
    await fetch('https://exp.host/--/api/v2/push/send', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Accept-encoding': 'gzip, deflate',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mensaje),
    }).then(response => {
        respuesta = true;
    })

    return respuesta;
  }

  //3nvia mensaje al vendedor para el servidor de exponotifications

  export const setMensajeNotificacion = (token,titulo,body,data) => {

    const message = {
        to: token,
        sound: 'default',
        title: titulo,
        body: body,
        data:data ,
      };

      return message

  }

  //funcion para las notificaciones de la app
  //receiver es el userid y visto valor 0= no ha visto el mensaje
  
  export const ListarNotificaciones = async()=> {

    let respuesta =  { statusresponse: false, data: [] };

    let index = 0

    await db.collection("Notificaciones")
    .where("receiver","==",ObtenerUsuario().uid )
    .where("visto","==",0)
    .get()
    .then((response) => {

        let datos;

        response.forEach((doc) => {
            datos = doc.data()
            datos.id = doc.id
            respuesta.data.push(datos)
        })

        respuesta.statusresponse = true

    })

    for(const notificacion of  respuesta.data  ) {

        const usuario = await obtenerRegistroxID("Usuarios",notificacion.sender)
        respuesta.data[index].sender = usuario.data;
        index++;

    }

    return respuesta;

  }