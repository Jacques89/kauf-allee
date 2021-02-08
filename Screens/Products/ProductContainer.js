import React, { useState, useEffect } from 'react'
import { View, StyleSheet, ActivityIndicator, FlatList, Dimensions } from 'react-native'
import { 
  Container,
  Text as NBText,
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
  const [filteredProducts, setFilteredProducts] = useState([])

  useEffect(() => {
    setProducts(data)
    setFilteredProducts(data)
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
        <NBText>Product Container</NBText>
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