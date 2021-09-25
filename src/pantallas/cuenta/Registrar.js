import React,{useRef} from 'react'
import { StyleSheet, Text, View,Image,StatusBar } from 'react-native'
import Toast from 'react-native-easy-toast'
import RegisterForm from '../../componentes/RegisterForm'

export default function Registrar() {

    const toastRef = useRef();

    return (
        <View style={styles.container}>
            <StatusBar backgroundColor="#128c7e" />
            <Image source={require('../../../assets/logo.png')} style={styles.imglogo} />
            <Text style={styles.textobanner}>!Registrate!</Text>
            <RegisterForm toastRef={toastRef}/>
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
        marginTop:40,
        alignSelf:"center"
    },
    textobanner:{
        fontFamily:"Roboto",
        fontWeight:"bold",
        fontSize:30,
        color:"#fff",
        alignSelf:"center"
    }
})
