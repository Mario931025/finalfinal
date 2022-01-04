import React,{useEffect} from 'react'
import { StyleSheet} from 'react-native'
import { SearchBar } from 'react-native-elements'
import { Buscar } from '../utils/Acciones';

export default function Busqueda(props) {

    const {
        setproductlist,
        actualizarProductos,
        setsearch,
        search,
        setmensajes
      } = props;


      useEffect(() => {

        let resultados = [];

        if(search) {
            ( async () => {
                resultados = await Buscar(search)

                setproductlist(resultados)

                if(resultados.length === 0) {
                    setmensajes("No se encontraron datos con la busqueda " + search)
                }
            })();
        }


      }, [search])

    return (
       <SearchBar
        placeholder="¿que estas buscando?"
        containerStyle={{ backgroundColor:"transparent" , borderTopColor:"transparent" , borderBottomColor:"transparenttransparent"}}
        inputContainerStyle={{
            backgroundColor:"#fff",
            alignItems:"center"
        }}

        inputStyle={{  fontFamily:"Roboto", fontSize:20}}

        onChangeText={(text) => {
            setsearch(text)
        }}

        value={search}

        onClear={() => {
            setsearch("")
            setproductlist([])
            actualizarProductos()
        }}
       />

    )
}

const styles = StyleSheet.create({})
