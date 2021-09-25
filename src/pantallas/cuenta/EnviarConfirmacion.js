import React,{useState,useEffect} from 'react'
import { View, Text,TextInput,Image,StyleSheet } from 'react-native'
import { Button,Icon, } from 'react-native-elements'
import CountryPicker from 'react-native-country-picker-modal'
import { useNavigation } from '@react-navigation/native'
import { isEmpty } from 'lodash'

export default function EnviarConfirmacion() {
    
    const [country,setcountry] = useState('MX')
    const [callingcode, setcallingcode] = useState("52")
    const [phone, setphone] = useState("")
    
    return (
        <View style={styles.container}>
            <Image source={require('../../../assets/logo.png')}
            style={styles.imglogo}
            />
            <View style={styles.panel}>
                <View style={{ borderBottomColor:"#25d366",borderBottomWidth:100}}/>


                <View style={styles.panelinterno}>
                    <Icon
                    name="whatsapp"
                    type="material-community"
                    size={100}
                    color="#25d366"
                    />
                    <Text style={styles.titulo}>  Favor de ingresar un número de WhatsApp</Text>
                    
                    <View style={styles.telefono}>

                        <CountryPicker
                            withFlag
                            withCallingCode
                            withFilter
                            withCallingCodeButton
                            countryCode={country}
                            onSelect={(Country)=>{
                               
                                setcountry(Country.cca2)
                                setcallingcode(...Country.callingCode)
                            }}
                        />
                        <Text style={{color:"#000"}}>  |  </Text>
                        <TextInput
                            placeholder="Número de Whatsapp"
                            style={styles.input}
                            placeholderTextColor="#fff"
                            onChange={(text) => setphone(text)}
                            value={phone}
                        />

                    </View>

                    <Button
                    title="confirmar número"
                    buttonStyle={{backgroundColor:"#25d366",marginHorizontal:20}}
                    containerStyle={{marginVertical:20}}
                    />

                </View>
            </View>
           
        </View>
    )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        backgroundColor:"#128c7e"
    },
    imglogo:{
        width:106,
        height:106,
        alignSelf:"center",
        marginVertical:40
    },
    panel:{
        flex:1,
        backgroundColor:"#fff",
        paddingTop:25,
        borderTopRightRadius:50,
        borderTopLeftRadius:50,
        alignItems:"center"
    },
    panelinterno:{
        flex:1,
        justifyContent:"space-around",
        marginHorizontal:20
    },
    titulo:{
        fontSize:16,
        textAlign:"center",
        color:"#25d366",
        fontWeight:"bold"
    },telefono:{
        flexDirection:"row",
        alignItems:"center",
        borderRadius:10,
        height:50,
        marginHorizontal:20,
        paddingHorizontal:20,
        backgroundColor:"rgba(37,211,106,0.6)"

    },input:{
        width:"80%",
        height:50,
        marginLeft:5
    }


})
