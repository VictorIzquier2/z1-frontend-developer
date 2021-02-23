import React, {useState, useEffect} from 'react';
import { StyleSheet, ImageBackground, Text, View, Button } from 'react-native';
import {Camera} from 'expo-camera';

export default function App() {
  const [permisos, setPermisos] = useState(null);
  const [tipo, setTipo] = useState(Camera.Constants.Type.back);
  const [success, setSuccess] = useState('Too Much Glare');
  const [loading, setLoading] = useState(true);

  if(loading) {
    return <View style={styles.center}><Text>Cargando...</Text></View>
  }
  const getPermisos = async () => {
    const {status} = await Camera.requestPermissionsAsync
    setPermisos(status == 'Approved')
  }
  useEffect(() => {
    getPermisos()
    fetch('https://front-exercise.z1.digital/evaluations')
      .then(response => response.json())
      .then(data => {
        setSuccess(data);
        setLoading(false);
      })
  }, [])

  if(permisos === null){
    return <View><Text>Esperando permisos...</Text></View>
  }
  if(permisos === false){
    return <View><Text>No tenemos acceso a la cámara</Text></View>
  }

  if(permisos === true){
    return (
      <View style={styles.container}>
        <ImageBackground
          style={styles.photo}
          source={require('./assets/Camera@2x.png')}
        >
          <Camera style={styles.camera} type={tipo}>
            <Button
              title='Voltear'
              onPress={() => {
                const {front, back} = Camera.Constants.Type
                const nuevoTipo = tipo === back ? front : back
                setTipo(nuevoTipo)
              }}
            />
          </Camera>
        </ImageBackground>
      </View>
    );
  }

  return(
    <View style={styles.container}>
      <Text>{success}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  camera: {
    flex: 1
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },  
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
