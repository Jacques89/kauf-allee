import React, { useState, useEffect } from 'react'
import {
  View,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Dimensions,
} from 'react-native'
import {
  Container,
  Text as NBText,
  Header as NBHeader,
  Icon as NBIcon,
  Item as NBItem,
  Input,
} from 'native-base'

import ProductList from './ProductList'
import SearchedProduct from './SearchedProducts'
import Banner from '../../Components/Banner'
import CategoryFilter from '../Products/CategoryFilter'

import data from '../../assets/data/products.json'
import productsCategories from '../../assets/data/categories.json'

const { height } = Dimensions.get('window')

const ProductContainer = () => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [focus, setFocus] = useState()
  const [categories, setCategories] = useState([])
  const [productCtg, setProductCtg] = useState([])
  const [active, setActive] = useState()
  const [initialState, setInitialState] = useState([])

  useEffect(() => {
    setProducts(data)
    setFilteredProducts(data)
    setFocus(false)
    setCategories(productsCategories)
    setActive(-1)
    setInitialState(data)

    return () => {
      setProducts([])
      setFilteredProducts([])
      setFocus()
      setCategories([])
      setActive()
      setInitialState()
    }
  }, [])

  const searchProduct = (text) => {
    setFilteredProducts(
      products.filter((i) => i.name.toLowerCase().includes(text.toLowerCase()))
    )
  }

  const openList = () => {
    setFocus(true)
  }

  const onBlur = () => {
    setFocus(false)
  }

  // Categories
  const changeCtg = (ctg) => {
    {
      ctg === 'all'
        ? [setProductCtg(initialState), setActive(true)]
        : [
          setProductCtg(
            products.filter((i) => i.category._id === ctg),
            setActive(true)
          ),
        ]
    }
  }

  return (
    <Container>
      <NBHeader searchBar rounded>
        <NBItem>
          <NBIcon name="ios-search" />
          <Input
            placeholder="Search"
            onFocus={openList}
            onChangeText={(text) => searchProduct(text)}
          />
          {focus == true ? <NBIcon onPress={onBlur} name="ios-close" /> : null}
        </NBItem>
      </NBHeader>
      {focus === true ? (
        <SearchedProduct filteredProducts={filteredProducts} />
      ) : (
        <View>
          <View>
            <Banner />
            <View>
              <CategoryFilter 
                categories={categories}
                categoryFilter={changeCtg}
                productsCategories={productCtg}
                active={active}
                setActive={setActive}
              />
            </View>
          </View>
          <View style={styles.listContainer}>
            <FlatList
              numColumns={2}
              data={products}
              renderItem={({ item }) => (
                <ProductList key={item.id} item={item} />
              )}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>
      )}
    </Container>
  )
}

const styles = StyleSheet.create({
  container: {
    flexWrap: 'wrap',
    backgroundColor: 'gainsboro',
  },
  listContainer: {
    width: '100%',
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    backgroundColor: 'gainsboro',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
})

export default ProductContainer
