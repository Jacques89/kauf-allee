import React from 'react'
import { createStackNavigator } from '@react-navigation/stack'

import Cart from '../Screens/Cart/Cart'
import Checkout from '../Screens/Cart/Checkout'

const Stack = createStackNavigator()

const CartStack = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen 
        name='Cart'
        component={Cart}
        options={{
          headerShown: false
        }}
      />
      <Stack.Screen 
        name='Checkout'
        component={Checkout}
        options={{
          title: 'Checkout'
        }}
      />
    </Stack.Navigator>
  )
}

export default function CartNavigator() {
  return <CartStack />
}