import React,{useState} from 'react'
import { StyleSheet, Text, View,TouchableOpacity } from 'react-native'
import {Icon,Input,Button,Divider} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import {validateEmail} from '../utils/ValidarEmail'
import { isEmpty } from 'lodash' //si el valor esta vacio devullve un boolean
import { validarsesion,cerrarsesion } from '../utils/Acciones'
import Loading from '../componentes/Loading'
import * as firebase from 'firebase';
import * as GoogleSignIn from 'expo-google-sign-in'
import * as Facebook from 'expo-facebook'






export default function LoginForm(props) {

    const {toastRef} = props;

    //use sate es  como en get y set al mismo tiempo
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [show, setshow] = useState(true)
    const [loading, setloading] = useState(false)

    const navigation = useNavigation();


    const iniciarsesion = () => {

        if(isEmpty(email) || isEmpty(password))
        {
            toastRef.current.show("No te olvides de ingresar correo y contraseña")
        } else if(!validateEmail(email)){
            toastRef.current.show("Ingrese correo valido, debe tener @ y extencion .com,.mx,etc")
        }else{

            setloading(true)

            firebase.auth().signInWithEmailAndPassword(email,password)
            .then((response) => {
                setloading(false)
                toastRef.current.show("Ha iniciado seseión correctamente")
                console.log(firebase.auth().currentUser)

            } )
            .catch((err) =>{

                setloading(false)
                   console.log(err) 
                   toastRef.current.show("El usuario o la contraseña es incorrecta")
            })
        }
       
    }


    return (
        <View style={styles.container}>
           <View
           style={{borderBottomColor:"#25d366",borderBottomWidth:2,width:100 }}/>
           <Input placeholder="correo" containerStyle={styles.input} 
            rightIcon={{ 
                type:"material-community",
                name:"at",
                color:"#128c7e",
                
            }}

            leftIcon={{
                type:"material-community",
                name:"account-circle-outline",
                color:"#128c7e",
            }}
            onChangeText={ (text) => {
                setemail(text)
             } }

           value={email}
           />

           <Input placeholder="contraseña" containerStyle={styles.input}
            leftIcon={{ 
                type:"material-community",
                name:"security",
                color:"#128c7e",
            }}

            rightIcon={{ 
                type:"material-community",
                name: show ? "eye-outline" : "eye-off-outline",
                color:"#128c7e",
                onPress: () => setshow(!show)
            }}

            onChangeText={(text) => {
                setpassword(text)
            }}

            secureTextEntry={show}
            value={password}

           />
            <Button title="Entrar" containerStyle={styles.btnentrar} buttonStyle={{backgroundColor:"#25d366"}}
            onPress={() => {iniciarsesion()  } }
            />

            <Text style={styles.txtcrearcuenta}>¿no tienes cuenta?
                <Text style={styles.cuenta} onPress={() => navigation.navigate('register') } >{" "}  Crear cuenta</Text>
            </Text>
        <Divider style={{backgroundColor:"#128c7e", height:1,width:"90%",marginTop:20 }} />

        <Text style={styles.text}>O</Text>

        <View style={styles.btnlogin}>
            <TouchableOpacity style={styles.btnloginsocial}>
                <Icon size={24} type="material-community" name="google" color="white" backgroundColor="transparent"/>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btnloginsocial}>
                <Icon size={24} type="material-community" name="facebook" color="white" backgroundColor="transparent"/>
            </TouchableOpacity>
        </View>
           <Loading isVisible={loading} text="Cargando confirguración"/>
        </View>
    )
}

/*******************logica de google    */


/***************lOGICA DE FACEBOOK */



const styles = StyleSheet.create({
    container:{
        backgroundColor:"#fff",
        flex:1, //PARA QUE CUBRA TODA LA PANTALLA
        marginTop:20, // espacio entre el formulairo y el mensaje de bienvenida
        borderTopLeftRadius:50,
        borderTopRightRadius:50,
        alignItems:"center", //para aliniar los elementos al centro
        paddingTop:20,//para abjar los elementos del contenido de la cabecera
    },
    input:{
        width:"90%",
        marginTop:20,
        height:50
    },
    btnentrar:{
        width:"50%",
        marginTop:20
    },
    txtcrearcuenta:{
        marginTop:20
    },
    cuenta:{
        color:"#128c7e",
        fontFamily:"Roboto",
        fontSize:15
    },
    text:{
        fontWeight:"bold",
        fontSize:20,
        marginTop:20,
        color:"#128c7e"
    },
    btnlogin:{
        flexDirection:"row", //pone los elementos en fila
        justifyContent:"space-around", //distribuye elementos a lo largo de la pantalla
        width:"100%"
    },btnloginsocial:{
        backgroundColor:"#25d366",
        paddingHorizontal:40,
        paddingVertical:10,
        borderRadius:10
    }
})
