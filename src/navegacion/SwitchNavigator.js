import React,{useState,useEffect} from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Loading from '../componentes/Loading'
import RutasAutenticadas from './RutasAutenticadas'
import CuentaStack from './Cuenta'
import { validarPhone} from '../utils/Acciones'

export default function SwitchNavigator() {

    const [phoneauth, setphoneauth] = useState(false)
    const [loading, setloading] = useState(true)


    useEffect(() => {
        
        validarPhone(setphoneauth)

        setTimeout(() => {
            
            setloading(false)
            
        }, 5000); 
        
    }, [])

    if(loading) {
        return <Loading isVisible={loading} text="Cargando configuración"/>
    } else{
        return phoneauth ? <RutasAutenticadas/> : <CuentaStack/>
    }


}

