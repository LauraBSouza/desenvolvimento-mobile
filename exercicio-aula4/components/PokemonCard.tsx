// components/PokemonCard.tsx
import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native'; // TouchableOpacity adicionado para interatividade
import { Pokemon } from '../types/Pokemon'; // Tipo que define a estrutura de um objeto Pokémon
import { useNavigation } from '@react-navigation/native'; // Hook para acessar o objeto de navegação
import { NativeStackNavigationProp } from '@react-navigation/native-stack'; // Tipo para a prop de navegação da stack
import { RootStackParamList } from '../types/Navigation'; // Nossos tipos customizados para as rotas e seus parâmetros
import { capitalize } from '../utils/format'; // Função utilitária para capitalizar strings

interface Props {
  pokemon: Pokemon; // Propriedade que o componente recebe, contendo os dados do Pokémon
}

type PokemonCardNavigationProp = NativeStackNavigationProp<RootStackParamList, 'PokemonDetails'>;

export const PokemonCard = ({ pokemon }: Props) => {
  const navigation = useNavigation<PokemonCardNavigationProp>();

  const handlePress = () => {
    navigation.navigate('PokemonDetails', { pokemonId: pokemon.id });
  };

  return (
    <TouchableOpacity onPress={handlePress} style={styles.touchableCard}>
      {/* View interna que mantém a estrutura e estilização visual original do card. */}
      <View style={styles.cardInner}>
        <Image source={{ uri: pokemon.image }} style={styles.image} />
        <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  touchableCard: {
    flex: 1,
    margin: 8,
  },
  cardInner: {
    backgroundColor: '#e0e0e0',
    padding: 12,
    borderRadius: 12,
    alignItems: 'center',
    flex: 1,
  },
  image: { width: 80, height: 80 }, // Estilo para a imagem do Pokémon.
  name: { marginTop: 8, fontWeight: 'bold' }, // Estilo para o nome do Pokémon.
});