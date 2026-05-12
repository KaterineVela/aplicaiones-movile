import React from 'react';
import { View, Text, Button, Image, StyleSheet } from 'react-native';

export default function ProductoItem({ producto, onVer }) {
  return (
    <View style={styles.card}>

      <Image 
        source={{ uri: producto.imagen }} 
        style={styles.imagen} 
      />

      <Text style={styles.nombre}>{producto.nombre}</Text>
      <Text style={styles.precio}>${producto.precio}</Text>

      <Button title="Ver detalle" onPress={onVer} />

    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: 15,
    padding: 10,
    borderWidth: 1,
    borderRadius: 10
  },
  imagen: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    marginBottom: 10
  },
  nombre: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  precio: {
    fontSize: 14,
    marginBottom: 5
  }
});