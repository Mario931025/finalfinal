import React from 'react'
import { StyleSheet, Text, View } from 'react-native'
import {FirebaseRecapchaVerifierModal} from 'expo-firebase-recaptcha'
import Constants from 'expo-constants'

export default function FirebaseRecapcha(props) {

    const  { referencia} = props    

    return (
       <FirebaseRecapchaVerifierModal
        ref={ referencia}
        title="CONFIRMA QUE NO ERES UN ROBOT"
        cancelLabel="x"
        firebaseConfig={Constants.manifest.extra.firebase}
       />
    )
}

const styles = StyleSheet.create({})
