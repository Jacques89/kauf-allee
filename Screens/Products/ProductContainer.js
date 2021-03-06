import React, { useState, useEffect } from 'react'
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native'
import {
  Container,
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

const ProductContainer = (props) => {
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [focus, setFocus] = useState()
  const [categories, setCategories] = useState([])
  const [productsCtg, setProductsCtg] = useState([])
  const [active, setActive] = useState()
  const [initialState, setInitialState] = useState([])

  useEffect(() => {
    setProducts(data)
    setFilteredProducts(data)
    setFocus(false)
    setCategories(productsCategories)
    setProductsCtg(data)
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
        ? [setProductsCtg(initialState), setActive(true)]
        : [
            setProductsCtg(
              products.filter((i) => i.category.$oid === ctg),
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
        <SearchedProduct
          navigation={props.navigation}
          filteredProducts={filteredProducts}
        />
      ) : (
        <ScrollView>
          <View>
            <View>
              <Banner />
            </View>
            <View>
              <CategoryFilter
                categories={categories}
                categoryFilter={changeCtg}
                productsCtg={productsCtg}
                active={active}
                setActive={setActive}
              />
            </View>
            {productsCtg.length > 0 ? (
              <View style={styles.listContainer}>
                {productsCtg.map((item) => {
                  return (
                    <ProductList
                      navigation={props.navigation}
                      key={item._id.$oid}
                      item={item}
                    />
                  )
                })}
              </View>
            ) : (
              <View style={[styles.center, { height: height / 2 }]}>
                <Text>No Products Found!</Text>
              </View>
            )}
          </View>
        </ScrollView>
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
    height: height,
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
