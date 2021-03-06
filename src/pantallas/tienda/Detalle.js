import React,{useState,useEffect,useRef} from 'react'
import { StyleSheet, Text, View,Dimensions,ScrollView, Alert } from 'react-native'
import { Avatar , Icon, Input, Button, Rating } from 'react-native-elements'
import { obtenerRegistroxID , ObtenerUsuario,sendPushNotification,addRegistro,setMensajeNotificacion } from '../../utils/Acciones';
import { size } from 'lodash';
import Loading from '../../componentes/Loading'
import CarouselImages from '../../componentes/CarouselImages';
import Modal from '../../componentes/Modal';
import { enviarWhatsapp } from '../../utils/ValidarEmail';

export default function Detalle(props) {

    const {route} = props;
    const {id,titulo} = route.params

    const [producto, setproducto] = useState({})
    const [expopushtoken, setexpopushtoken] = useState("")
    const [nombrevendedor, setnombrevendedor] = useState("Nombre")
    const [photovendedor, setphotovendedor] = useState("")
    const [mensaje, setmensaje] = useState("")
    const [activeslide, setactiveslide] = useState(0)
    const [loading, setloading] = useState(false)
    const [isVisible, setisVisible] = useState(false)
    const usuarioactual = ObtenerUsuario()
    const [phonenumber, setphonenumber] = useState("")

    useEffect(() => {
        (async () => {
          setproducto((await obtenerRegistroxID ("Productos", id)).data);
        })();
      }, []);
    
      useEffect(() => {
        (async () => {
          if (size(producto) > 0) {
            const resultado = (
              await obtenerRegistroxID ("Usuarios", producto.usuario)
            ).data;
    
            setexpopushtoken(resultado.token);
            setnombrevendedor(resultado.displayName);
            setphotovendedor(resultado.photoURL);
            setphonenumber(resultado.phoneNumber);
          }
        })();
      }, [producto]);
    
      if (producto.lenght !== 0) {
        return (
          <ScrollView style={styles.container}>
            <CarouselImages
              imagenes={producto.imagenes}
              height={400}
              width={Dimensions.get("window").width}
              activeslide={activeslide}
              setactiveslide={setactiveslide}
            />
            <View style={styles.boxsuperior}>
              <View
                style={{
                  borderBottomColor: "#25D366",
                  borderBottomWidth: 2,
                  width: 100,
                  alignSelf: "center",
                }}
              />
              <Text style={styles.titulos}>{producto.titulo}</Text>
              <Text style={styles.precio}>
                {parseFloat(producto.precio).toFixed(2)}
              </Text>
    
              <View>
                <Text style={styles.descripcion}>{producto.descripcion}</Text>
                <Rating imageSize={20} startingValue={producto.rating} readonly />
              </View>
    
              <Text style={styles.titulos}>Contactar al Anunciante</Text>
              <View style={styles.avatarbox}>
                <Avatar
                  source={
                    photovendedor
                      ? { uri: photovendedor }
                      : require("../../../assets/avatarx.jpg")
                  }
                  style={styles.avatar}
                  rounded
                  size="large"
                />
                <View>
                  <Text style={styles.displayname}>
                    {nombrevendedor ? nombrevendedor : "An??nimo"}
                  </Text>
                  <View style={styles.boxinternoavatar}>
                    <Icon
                      type="material-community"
                      name="message-text-outline"
                      color="#25d366"
                      size={40}
                      onPress={() => {
                        setisVisible(true);
                      }}
                    />
                    <Icon
                      type="material-community"
                      name="whatsapp"
                      color="#25d366"
                      size={40}
                      onPress={() => {
                        const mensajewhatsapp = `Estimado ${nombrevendedor}, mi nombres es ${usuarioactual.displayName} me interesa el producto ${producto.titulo} que esta en BUNKANNICHIBOKU`;

                        enviarWhatsapp(phonenumber,mensajewhatsapp)

                      }}
                    />
                  </View>
                </View>
              </View>
              <EnviarMensaje
                isVisible={isVisible}
                setisVisible={setisVisible}
                nombrevendedor={nombrevendedor}
                avatarvendedor={photovendedor}
                mensaje={mensaje}
                setmensaje={setmensaje}
                receiver={producto.usuario}
                sender={usuarioactual.uid}
                token={expopushtoken}
                producto={producto}
                setloading={setloading}
                nombrecliente={usuarioactual.displayName}
              />
              <Loading isVisible={loading} text="Enviando el mensaje..." />
            </View>
          </ScrollView>
        );
      }
    }


function EnviarMensaje(props) {
    const {
      isVisible,
      setisVisible,
      nombrevendedor,
      avatarvendedor,
      mensaje,
      setmensaje,
      receiver,
      sender,
      token,
      producto,
      setloading,
      nombrecliente,
    } = props;
  
    const enviarNotificacion = async () => {
      if (!mensaje) {
        Alert.alert("Validaci??n", "Favor introduce ubn texto para el mensaje", [
          {
            style: "default",
            text: "Entendido",
          },
        ]);
      } else {
        setloading(true);
        const notificacion = {
          sender: sender,
          receiver: receiver,
          mensaje,
          fechacreacion: new Date(),
          productoid: producto.id,
          productotitulo: producto.titulo,
          visto: 0,
        };
  
        const resultado = await addRegistro("Notificaciones", notificacion);
        if (resultado.statusresponse) {
          const mensajenotificacion = setMensajeNotificacion(
            token,
            `Cliente Interesado - ${producto.titulo}`,
            `${nombrecliente}, te ha enviado un mensaje`,
            { data: "Prospecto Interesado" }
          );
  
          const respuesta = await sendPushNotification(mensajenotificacion);
          setloading(false);
  
          if (respuesta) {
            Alert.alert(
              "Acci??n realizada correctamente",
              "Se ha enviado el mensaje correctamente",
              [
                {
                  style: "cancel",
                  text: "Entendido",
                  onPress: () => setisVisible(false),
                },
              ]
            );
            setmensaje("");
          } else {
            Alert.alert(
              "Error",
              "Se ha producido un error al enviar mensaje, favor intentelo nuevamente  ",
              [
                {
                  style: "cancel",
                  text: "Entendido",
                },
              ]
            );
            setloading(false);
          }
        }
      }
    };
  
    return (
      <Modal isVisible={isVisible} setisVisible={setisVisible}>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            fontSize: 16,
            borderRadius: 20,
          }}
        >
          <Avatar
            source={
              avatarvendedor
                ? { uri: avatarvendedor }
                : require("../../../assets/avatarx.jpg")
            }
            style={styles.photovendor}
          />
  
          <Text style={{ color: "#075e54", fontSize: 16, fontWeight: "bold" }}>
            Env??ale un mensaje a {nombrevendedor}
          </Text>
  
          <Input
            placeholder="Escribe un mensaje"
            multiline={true}
            inputStyle={styles.textArea}
            onChangeText={(text) => {
              setmensaje(text);
            }}
            value={mensaje}
          />
          <Button
            title="Enviar mensaje"
            buttonStyle={styles.btnsend}
            containerStyle={{ width: "90%" }}
            onPress={enviarNotificacion}
          />
        </View>
      </Modal>
    );
  }

  const styles = StyleSheet.create({
    container: {
      backgroundColor: "#fff",
      flex: 1,
    },
    boxsuperior: {
      backgroundColor: "#fff",
      marginTop: -50,
      paddingTop: 20,
      borderTopLeftRadius: 50,
      borderTopRightRadius: 50,
      alignItems: "center",
    },
    titulos: {
      color: "#075e54",
      fontSize: 24,
      fontWeight: "bold",
      marginTop: 10,
    },
    precio: {
      fontSize: 18,
      color: "#128c7e",
      fontWeight: "bold",
      paddingLeft: 10,
    },
    descripcion: {
      fontWeight: "300",
      fontSize: 16,
      alignSelf: "center",
      paddingHorizontal: 10,
      marginVertical: 10,
      color: "#757575",
      textAlign: "center",
    },
    avatarbox: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 40,
      flex: 1,
    },
    avatar: {
      width: 60,
      height: 60,
    },
  
    boxinternoavatar: {
      justifyContent: "center",
      flexDirection: "row",
    },
    displayname: {
      fontSize: 20,
      fontWeight: "bold",
      color: "#075E54",
    },
    photovendor: {
      width: 60,
      height: 60,
      alignSelf: "center",
      marginTop: 20,
      marginBottom: 20,
    },
    textArea: {
      height: 150,
    },
    btnsend: {
      backgroundColor: "#075e54",
    },
  });
  
