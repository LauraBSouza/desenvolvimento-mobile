// screens/PokemonDetailsScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../types/Navigation';
import { Pokemon } from '../types/Pokemon'; 
import { getPokemonById } from '../services/api';
import { capitalize } from '../utils/format';
type PokemonDetailsScreenRouteProp = RouteProp<RootStackParamList, 'PokemonDetails'>;

export const PokemonDetailsScreen = () => {
  const route = useRoute<PokemonDetailsScreenRouteProp>();
  const { pokemonId } = route.params; // Extrai o pokemonId dos parâmetros da rota

  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const details = await getPokemonById(pokemonId);
        setPokemon(details);
      } catch (err) {
        setError('Falha ao carregar detalhes do Pokémon.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [pokemonId]);

  if (isLoading) {
    return <ActivityIndicator size="large" style={styles.centered} />;
  }

  if (error) {
    return <Text style={styles.errorText}>{error}</Text>;
  }

  if (!pokemon) {
    return <Text style={styles.centered}>Pokémon não encontrado.</Text>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Image source={{ uri: pokemon.image }} style={styles.image} />
      <Text style={styles.name}>{capitalize(pokemon.name)}</Text>
      <Text style={styles.idText}>ID: #{pokemon.id}</Text>
      
      <View style={styles.typesContainer}>
        <Text style={styles.sectionTitle}>Tipos:</Text>
        {pokemon.types.map((type) => (
          // Aqui usaríamos o <PokemonTypeBadge typeName={type} key={type} />
          <Text key={type} style={styles.typeText}>{capitalize(type)}</Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    color: 'red',
    fontSize: 16,
  },
  image: {
    width: 200,
    height: 200,
    marginBottom: 16,
    backgroundColor: '#f0f0f0', // Fundo enquanto a imagem carrega
    borderRadius: 100,
  },
  name: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  idText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 16,
  },
  typesContainer: {
    marginBottom: 16,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  typeText: { 
    fontSize: 16,
    marginHorizontal: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#ddd',
    borderRadius: 4,
    marginBottom: 4,
  },
  detailsSection: {
    marginTop: 16,
    alignItems: 'flex-start',
    width: '100%',
  }
});