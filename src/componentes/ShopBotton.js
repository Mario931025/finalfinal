import React from 'react'
import {StyleSheet,Text,View,TouchableHighlight} from 'react-native'
//el touchableHighLight es como bootn que cambia de color a otro cuando lo presionas
import {Icon} from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function ShopBotton() {

    const navigation = useNavigation();

    return (
        <TouchableHighlight  style={styles.container} onPress={() => {navigation.navigate("mitienda")}}>
            <Icon name="store" color="#fff" size={30}/>

        </TouchableHighlight>
       
    )
}

const styles = StyleSheet.create({
    
    container: {
        backgroundColor:"#25d366", //te sirve para ponder color de fondo
        alignItems:"center", //aliniar los elementos
        justifyContent:"center", //textos
        width: 72,
        height:72,
        borderRadius: 36, //esquinas redondeanas
        top:-20, //para que suba
        shadowRadius:5,// sombra al raido
        shadowOffset:{height:10},
        shadowOpacity:0.3,// da una opacidad
        borderWidth: 3,
        borderColor:"#fff",
        padding:20 //da mas espacio para que el usario orpima el boton
    }
})
