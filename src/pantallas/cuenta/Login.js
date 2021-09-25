
import React,{useRef} from 'react'
//usamos ref para poner una referencia de datos en este componente

//sirve para ccdeder a las propiedades de nuestro componentre y pasarrlas a otro, mediante variable

import { View, Text,StyleSheet,Image,StatusBar } from 'react-native'
import { useNavigation } from '@react-navigation/core'
import LoginForm from '../../componentes/LoginForm'
import Toast from 'react-native-easy-toast'
import { color } from 'react-native-elements/dist/helpers'

export default function login() {

    const toastRef = useRef();


    return (
        <View style={ styles.container}>
            <StatusBar backgroundColor="#128c7e"/>
            <Image source={require('../../../assets/logo.png')} style={styles.imglogo} />
            <Text style={styles.textobanner}>!Bienvenido!</Text>
            <LoginForm toastRef={toastRef} />
            <Toast ref={toastRef} position="center" opacity={0.9}/>
        </View>
    )
}


const styles = StyleSheet.create({

    container:{
        flex:1,
        backgroundColor:"#128c7e"
    },
    imglogo:{
        width: 106,
        height:106,
        marginTop: 40,
        alignSelf:"center"  //te sirve para aliniar los objetos en ecentro de la pantalla
    },
    textobanner:{
        fontFamily:"Roboto", //no es compatible con IOS
        fontWeight:"bold",
        fontSize:30,
        color:"#fff",
        alignSelf:"center" 
    }

})