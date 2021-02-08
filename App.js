import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

import Header from './Components/Header'
import ProductContainer from './Screens/Products/ProductContainer'

export default function App() {
  return (
    <View style={styles.container}>
      <Header />
      <ProductContainer />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
})
