import React,{useState,useEffect,useRef } from 'react'
import { View, Text,StyleSheet,StatusBar } from 'react-native'
import {Icon,Avatar,Input}from 'react-native-elements'
import { cargarImagenesxAspecto } from '../../utils/ValidarEmail'
import{subirImagenesBatch} from '../../utils/Acciones'


export default function Perfil() {
    return (
        <View>
            <StatusBar backgroundColor="#128c7e" />
            <CabeceraBG/>
            <HeaderAvatar/>
        </View>
    )
}


function CabeceraBG() {

    return(
        <View style={styles.prueba}>
            <View style={styles.bg}>
                <Text
                    style={{color:"#fff",fontSize:18,fontWeight:"bold"}}
                >
                    Nombre
                </Text>
            </View>
        </View>
    )
}


function HeaderAvatar(props){

    const cambiarfoto = async() =>{

       //se pasan los valoires 1 y 1 por se trata de imagen cuadrada
       const resultado = await cargarImagenesxAspecto([1,1])
       const url = await subirImagenesBatch([resultado.imagen],"Perfil")

       console.log(url)

    }

    return(
        <View style= {styles.avatarline}>
            <Avatar
                size={200}
                rounded
                source={{
                     uri:
                     'https://randomuser.me/api/portraits/women/57.jpg',
                     }}
                title="Bj"
                containerStyle={{backgroundColor:'grey'}}
                onPress={cambiarfoto}
         >
                <Avatar.Accessory size={23} />
            </Avatar>
        </View>
    )
}


const styles = StyleSheet.create({
    bg:{
        width:"100%",
        height:200,
        borderBottomLeftRadius:200,
        borderBottomRightRadius:200,
        backgroundColor:"#128c7e",
        justifyContent:"center",
        alignItems:"center",
        borderWidth:5,
        borderColor:"black"
    },
    avatarline:{
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop:-70,
        borderWidth:5,
        borderColor:"black"
    },
    prueba:{
        borderWidth:5,
        borderColor:"black"
    }

})