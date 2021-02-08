import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import { 
  Container, 
  Header as NBHeader, 
  Icon as NBIcon, 
  Item as NBItem, 
  Input 
} from 'native-base'

import ProductList from './ProductList'

import data from '../../assets/data/products.json'

const { height } = Dimensions.get('window')

const ProductContainer = () => {

  const [products, setProducts] = useState([])

  useEffect(() => {
    setProducts(data)
    return () => {
      setProducts([])
    }
  }, [])

  return(
    <Container>
      <NBHeader searchBar rounded>
        <NBItem>
          <NBIcon name='ios-search' />
          <Input 
            placeholder='Search'
            // onFocus={}
            //onChangeText={(text) =>}
          />
        </NBItem>
      </NBHeader>
      <View style={styles.container}>
        <Text>Product Container</Text>
        <View style={styles.listContainer}>
          <FlatList
            numColumns={2}
            data={products}
            renderItem={({item}) => 
              <ProductList
                key={item.id}
                item={item} 
              />
            }
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  listContainer: {
    width: '100%',
    flex: 1,
    flexDirection: "row",
    alignItems: "flex-start",
    flexWrap: "wrap",
    backgroundColor: "gainsboro",
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center'
  }
})

export default ProductContainer