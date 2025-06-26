import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { PokedexScreen } from './screens/PokedexScreen';
import { PokemonDetailsScreen } from './screens/PokemonDetailsScreen'; // Nova tela
import { RootStackParamList } from './types/Navigation'; // Importando nossos tipos

// Criamos a pilha de navegação com os tipos definidos
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Pokedex">
          <Stack.Screen 
            name="Pokedex" 
            component={PokedexScreen} 
            options={{ title: 'Pokédex' }} // Título da tela na barra de navegação
          />
          <Stack.Screen 
            name="PokemonDetails" 
            component={PokemonDetailsScreen} 
            options={{ title: 'Detalhes do Pokémon' }} 
          />
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}