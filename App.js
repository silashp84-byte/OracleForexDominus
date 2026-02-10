import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';

import ForexScreen from './src/screens/ForexScreen';
import StockExchangeScreen from './src/screens/StockExchangeScreen';
import PortfolioScreen from './src/screens/PortfolioScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Forex') {
              iconName = focused ? 'trending-up' : 'trending-up-outline';
            } else if (route.name === 'Bolsas') {
              iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            } else if (route.name === 'Portfolio') {
              iconName = focused ? 'wallet' : 'wallet-outline';
            }

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: '#00D4FF',
          tabBarInactiveTintColor: '#666',
          tabBarStyle: {
            backgroundColor: '#1a1a2e',
            borderTopColor: '#00D4FF',
          },
          headerStyle: {
            backgroundColor: '#1a1a2e',
          },
          headerTintColor: '#00D4FF',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        })}
      >
        <Tab.Screen 
          name="Forex" 
          component={ForexScreen}
          options={{
            title: 'Forex - Mercado de Divisas',
          }}
        />
        <Tab.Screen 
          name="Bolsas" 
          component={StockExchangeScreen}
          options={{
            title: 'Bolsas de Valores',
          }}
        />
        <Tab.Screen 
          name="Portfolio" 
          component={PortfolioScreen}
          options={{
            title: 'Meu Portfolio',
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}