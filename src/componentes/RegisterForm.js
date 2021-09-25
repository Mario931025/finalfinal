import React,{useState} from 'react'
import { StyleSheet, Text, View, } from 'react-native'
import {Icon,Input,Button} from 'react-native-elements'
import {useNavigation} from '@react-navigation/native'
import {validateEmail} from '../utils/ValidarEmail'
import { isEmpty,size } from 'lodash' //si el valor esta vacio devullve un boolean
import { validarsesion } from '../utils/Acciones'
import * as firebase from 'firebase';
import Loading from '../componentes/Loading'




export default function RegisterForm(props) {

    const {toastRef} = props;

    //use sate es  como en get y set al mismo tiempo
    const [email, setemail] = useState("");
    const [password, setpassword] = useState("");
    const [repetirPassword, setrepetirPassword] = useState("")

    const navigation = useNavigation();
    const [show, setshow] = useState(false)
    const [loading, setloading] = useState(false)


    const crearcuenta = () => {

        if(isEmpty(email) || isEmpty(password) || isEmpty(repetirPassword))
        {
            toastRef.current.show("Todos los campos son obligatorios")
        } else if(!validateEmail(email)){
            toastRef.current.show("Ingrese correo valido, debe tener @ y extencion .com,.mx,etc")
        }else if(password !== repetirPassword) {
            toastRef.current.show("Las contraseñas deben de ser iguales")
        }else if(size(password) <6 ){
            toastRef.current.show("Las contraseñas deben de ser minimo 6 caracteres")
        }else{
            setloading(true);

            firebase
                .auth()
                .createUserWithEmailAndPassword(email,password)
                .then((response) => {
                    toastRef.current.show("Se ha creado el usuario correctamente")
                    setloading(false);
                } )
                .catch((err) => {
                    setloading(false);
                    toastRef.current.show("Ha ocurrido un error intentelo mas tarde")
                    console.log(err)
                   
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

            onChangeText={(text) => {
                setemail(text)
            }}
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
                name: show ? "eye-off-outline" : "eye-outline",
                color:"#128c7e",
                onPress: () => setshow(!show)
            }}
            onChangeText={(text) => {
                setpassword(text)
            }}
            secureTextEntry={!show}

            value={password}

           />

        <Input placeholder="Repetir contraseña" containerStyle={styles.input}
            leftIcon={{ 
                type:"material-community",
                name:"security",
                color:"#128c7e",
            }}

            rightIcon={{ 
                type:"material-community",
                name: show ? "eye-off-outline" : "eye-outline",
                color:"#128c7e",
                onPress: () => setshow(!show)
            }}
            onChangeText={(text) => {
                setrepetirPassword(text)
            }}
            secureTextEntry={!show}
            value={repetirPassword}

           />



            <Button title="CREAR CUENTA" containerStyle={styles.btnentrar} buttonStyle={{backgroundColor:"#25d366"}}
            onPress={() => { crearcuenta()  } }
            />

            <Button 
            title="Inicar Sesión"
            containerStyle={styles.btnentrar}
            buttonStyle={{backgroundColor:"#128c7e"}}
            onPress={ () => navigation.goBack() }
            />

        <Loading isVisible = {loading} text="Cargando configuración"/>
           
        </View>
    )
}

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
