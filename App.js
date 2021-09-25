import {StatusBar} from 'expo-status-bar'
import React,{useState,useEffect} from 'react';
import { StyleSheet, Text, View } from 'react-native';
import RutasAutenticadas from './src/navegacion/RutasAutenticadas';
import RutasNoAutenticadas from './src/navegacion/RutasNoAutenticadas'
import SwitchNavigator from './src/navegacion/SwitchNavigator'
import Loading from './src/componentes/Loading';
import { validarsesion,cerrarsesion } from './src/utils/Acciones';

export default function App() {

 // cerrarsesion()

  const [user, setuser] = useState(false)
  const [loading, setloading] = useState(false)

  useEffect(() => {

    setloading(true)
    validarsesion(setuser)
    setloading(false)
    
  }, [])


  if(loading){
    return <Loading isVisible = {loading} Text="Empezando un mundo nuevo"/>
  }

 return user ? <SwitchNavigator/> : <RutasNoAutenticadas/>

}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent: 'center',
   
  },
});
