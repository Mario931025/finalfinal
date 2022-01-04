import React,{useState,useEffect,useRef } from 'react'
import { View, Text,StyleSheet,StatusBar } from 'react-native'
import {Avatar}from 'react-native-elements'
import { cargarImagenesxAspecto,validateEmail } from '../../utils/ValidarEmail'
import{subirImagenesBatch, ObtenerUsuario,addRegistroEspecifico,actualizarPerfil,reautenticar,enviarAutentificacionphone,actualizaremailfirebase, actualizarTelefono } from '../../utils/Acciones'
import Loading from '../../componentes/Loading'
import InputEditable from '../../componentes/InputEditable'
import Modal from '../../componentes/Modal'
import CodeInput from 'react-native-code-input'
import  FirebaseRecaptcha  from '../../utils/FirebaseRecapcha'

export default function Perfil() {

    const [imagenperfil, setimagenperfil] = useState("")
    const [loading, setloading] = useState(false)
    const usuario = ObtenerUsuario();
    const [displayName, setdisplayName] = useState("")
    const [phoneNumber, setphoneNumber] = useState("")
    const [email, setemail] = useState("")

    const [editablename, seteditablename] = useState(false)
    const [editableemail, seteditableemail] = useState(false)
    const [editablephone, seteditablephone] = useState(false)

    const [verificationid, setverificationid] = useState("")
    const [isVisible, setisVisible] = useState(false)
    const [updatephone, setupdatephone] = useState(false)

    const recapcha = useRef();



    useEffect(() => {
        
        setimagenperfil(usuario.photoURL)

        //para poder impimir los datos del usuario
        const { displayName,phoneNumber,email} = usuario

        setdisplayName(displayName)
        setphoneNumber(phoneNumber)
        setemail(email)


    }, [])


    //funcion que cambia los valores de las variables depedneindo cada input

    const onChangeInput = (input,valor) => {

        switch(input){
            case "displayName":
                setdisplayName(valor)
                break;
            
            case "email":
                setemail(valor)
                break;

            case "phoneNumber":
                setphoneNumber(valor)
                break;
        }

    }

    const obtenerValor = (input) => {

        switch(input){
            case "displayName":
             return   displayName
                break;
            
            case "email":
              return  email
                break;

            case "phoneNumber":
              return  phoneNumber
                break;
        }

    }


    //funcion que se cancarga de actualizar el input de perfil

    const actualizarValor = async(input,valor)=>{

        switch(input) {
            case "displayName":
                //console.log(  )
                await actualizarPerfil({displayName : valor})
                addRegistroEspecifico("Usuarios" ,usuario.uid,{ displayName : valor})
              //  console.log(usuario);
                break;

            case "email" :

            if(valor !== usuario.email){
                if(validateEmail(valor)){
                    const verification = await enviarAutentificacionphone(phoneNumber,recapcha)

                    if(verification) {
                        setverificationid(verification)
                        setisVisible(true)
                    }else{
                        alert("Ha ocurrido un eror en la verificacion")
                        setemail(usuario.email)
                    }
                }
            }

            break;
            
            case "phoneNumber":

            if(valor !== usuario.phoneNumber ){
                const verification = await enviarAutentificacionphone(phoneNumber,recapcha)

                if(verification){
                    setverificationid(verification)
                    setupdatephone(true)
                    setisVisible(true)
                }else{
                    alert("Ha ocurrido un eror en la verificacion")
                    setphoneNumber(usuario.phoneNumber)
                }
            }

            break;
        }
    }

    // funcion que actualiza el correo electronico en BD

    const ConfirmarCodigo = async(verificationid,code)=>{
    
        setloading(true)


        if(updatephone){
            const telefono =  await actualizarTelefono(verificationid,code)
            const updateregistro =  await addRegistroEspecifico("Usuarios",usuario.uid,{phoneNumber : phoneNumber})

            setupdatephone(false)
           // console.log(telefono)
           // console.log(updateregistro)

        } else{

            const resultado = await reautenticar(verificationid,code)
       // console.log(resultado)
       // setloading(false)
       if(resultado.statusresponse){
        const emailresponse = await actualizaremailfirebase(email)
        const updateregistro = await addRegistroEspecifico("Usuarios",usuario.uid,{email: email})

      //  console.log(emailresponse)
     //   console.log(updateregistro)

        setloading(false)
        setisVisible(false)
    }else{
        alert("Ha ocurrido un error al actualizar el correo electronico")
        setloading(false)
        setisVisible(false)
            }

        }
        

      setloading(false)
      setisVisible(false)
        
    }

   // console.log(ObtenerUsuario())

    return (
        <View>
            <StatusBar backgroundColor="#128c7e" />
            <CabeceraBG nombre={displayName} />
            <HeaderAvatar usuario={usuario}
            imagenperfil ={imagenperfil}
            setimagenperfil={setimagenperfil}
            setloading={setloading}
            />
            <FormDatos
            onChangeInput={onChangeInput}
            obtenerValor={obtenerValor}
            
            seteditableemail={seteditableemail}
            seteditablename={seteditablename}
            seteditablephone={seteditablephone}

            editablename={editablename}
            editableemail={editableemail}
            editablephone={editablephone}

            actualizarValor={actualizarValor}

            />
          

           <ModalVerification
                isvisibleModal={isVisible}
                setisvisibleModal={setisVisible}
                verificationid={verificationid}
                ConfirmarCodigo={ConfirmarCodigo}
            />
            <FirebaseRecaptcha
                referencia = {recapcha}
            />
            <Loading isVisible={loading} text={"Favor espere"}/>

        </View>
    )
}


function CabeceraBG(props) {

    const {nombre} = props

    return(
        <View>
            <View style={styles.bg}>
                <Text
                    style={{color:"#fff",fontSize:18,fontWeight:"bold"}}
                >
                    { nombre }
                </Text>
            </View>
        </View>
    )
}


function HeaderAvatar(props){

    const {usuario,setimagenperfil,imagenperfil,setloading} = props;
    
    const {uid} = usuario;

    const cambiarfoto = async() =>{



       //se pasan los valoires 1 y 1 por se trata de imagen cuadrada
       const resultado = await cargarImagenesxAspecto([1,1])

        if(resultado.status){

            setloading(true)

            const url = await subirImagenesBatch([resultado.imagen],"Perfil")

            // variable que sube la nueva foto de perfil al campho photourl del usuario (fijarse en los campos del usario de firebase)
              const update = await actualizarPerfil({ photoURL : url[0] })
              const response = await addRegistroEspecifico("Usuarios",uid,{photoURL : url[0]})
      
              if(response.statusresponse){

                setimagenperfil(url[0])
                setloading(false)
                 
              }else{
                  console.log("eror al cargar la imagen")
                  setloading(false)
                  alert("Ha ocurridoun error con la imagen, revisa su tamaño y formato (jpg,png)")
              }
             // console.log(url)

        }

      

    }

    return(
        <View style= {styles.avatarline}>
            <Avatar
                size={200}
                rounded
                source={  imagenperfil ? {uri:imagenperfil} : require("../../../assets/avatarx.jpg")}
                title="Bj"
                containerStyle={{backgroundColor:'grey'}}
                onPress={cambiarfoto}
         >
                <Avatar.Accessory size={23} />
            </Avatar>
        </View>
    )
}

function FormDatos (props) {

    const { onChangeInput, obtenerValor,editableemail,editablename,editablephone,
        seteditableemail,seteditablename,seteditablephone,actualizarValor
    } = props

    return(
        <View>
            <InputEditable
                id="displayName"
                label = "Nombre"
                obtenerValor = {obtenerValor}
                placeholder = "Nombre"
                onChangeInput = {onChangeInput}
                editable={editablename}
                seteditable={seteditablename}
                actualizarValor={actualizarValor}
            />
             <InputEditable
                id="email"
                label = "Correo"
                obtenerValor = {obtenerValor}
                placeholder = "ejemplo@ejemplo.com"
                onChangeInput = {onChangeInput}
                editable={editableemail}
                seteditable={seteditableemail}
                actualizarValor={actualizarValor}
            />
             <InputEditable
                id="phoneNumber"
                label = "Télefono"
                obtenerValor = {obtenerValor}
                placeholder = "+00000000"
                onChangeInput = {onChangeInput}
                editable={editablephone}
                seteditable={seteditablephone}
                actualizarValor={actualizarValor}
            />

        </View>
    )

}

function ModalVerification (props) {

    const { isvisibleModal,setisvisibleModal,ConfirmarCodigo, verificationid } = props


    return(
        <Modal isVisible={isvisibleModal} setisVisible={setisvisibleModal}>

            <View style={styles.confirmacion}>
                <Text style={styles.titulomodal}>Confirma tu código</Text>
                <Text style={styles.detalle}>Se ha enviado un código de verificación a su número de télefono</Text>
                <CodeInput
                    secureTextEntry
                    activeColor="#128c7e"
                    inactiveColor="#128c7e"
                    autoFocus={false}
                    inputPosition="center"
                    size={40}
                    containerStyle={{marginTop:30}}
                    codeInputStyle={{borderWidth:1.5}}
                    codeLength={6}
                    onFulfill={(code)=> { 
                        ConfirmarCodigo(verificationid,code)
                    }}
                />
            </View>

        </Modal>
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
     //   borderWidth:5,
      //  borderColor:"black"
    },
    avatarline:{
        flexDirection:"row",
        justifyContent:"space-around",
        marginTop:-70,
      //  borderWidth:5,
      //  borderColor:"black"
    },
    prueba:{
      //  borderWidth:5,
      //  borderColor:"black"
    },
    confirmacion:{
        height:200,
        width:"100%",
        alignItems:"center"
    },titulomodal:{
        fontWeight:"bold",
        fontSize:18,
        marginTop:20
    },detalle:{
        marginTop:20,
        fontSize:14,
        textAlign:"center"
    }

})