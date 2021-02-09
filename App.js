import React from 'react'
import { LogBox } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'

// Navigators
import Main from './Navigators/Main'

// Screens
import Header from './Components/Header'
import ProductContainer from './Screens/Products/ProductContainer'

LogBox.ignoreAllLogs(true)

export default function App() {
  return (
    <NavigationContainer>
      <Header />
      <Main />
    </NavigationContainer>
  )
}