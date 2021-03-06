import React from 'react'
import { StyleSheet, Text, View,Linking } from 'react-native'
import { Avatar,Icon } from 'react-native-elements'
import { enviarWhatsapp } from '../../utils/ValidarEmail'


export default function Contacto(props) {
    
    const { route } = props
    const {displayName,
        phoneNumber,
        photoURL,
        email } = route.params

    const mensaje = `Hola, ${displayName}. Te escribo desde la app de Bunkan, me dejaste un mensaje.`

    

    
    return (
        <View style={styles.container}>
            <View style={styles.panel}>
                <Avatar
                    size="large"
                    source={  photoURL  ? { uri:photoURL} : require("../../../assets/avatarx.jpg")}
                    rounded
                    style={styles.avatar}
                    />
                <View  style={{ marginLeft:5}} >
                    <Text style={styles.text}>{displayName}</Text>
                    <Text style={styles.text}>{email}</Text>
                </View>
                    
            </View>
            <View  style={styles.rowicon}>
                <Icon
                type="material-community"
                name="whatsapp"
                reverse
                size={30}
                color="#25d366"
                onPress={() => enviarWhatsapp( phoneNumber, mensaje) }
                />

            <Icon
                type="material-community"
                name="phone-in-talk"
                reverse
                size={30}
                color="#25d366"
                onPress={() => Linking.openURL(`tel:${phoneNumber}`) }
                />

            </View>
        </View>

       
    )
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        backgroundColor:"#fff"
    },
    panel:{
        backgroundColor:"#075e54",
        flexDirection:"row",
        alignItems:"center",
        margin:10,
        padding: 20,
        borderRadius:20
    },
    avatar:{
        width:50,
        height:50
    },
    text:{
        fontWeight:"bold",
        fontSize:16,
        fontFamily:"Roboto",
        color:"#fff"
    },rowicon:{
        flexDirection:"row",
        alignItems:"center",
        justifyContent:"center"
    }
})
