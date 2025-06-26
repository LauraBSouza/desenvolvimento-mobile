import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { getPokemons } from '../services/api';
import { Pokemon } from '../types/Pokemon';
import { PokemonCard } from '../components/PokemonCard';

const PAGE_SIZE = 30;

export const PokedexScreen = () => {
  const insets = useSafeAreaInsets();

  const [pokemons, setPokemons] = useState<Pokemon[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [filteredPokemons, setFilteredPokemons] = useState<Pokemon[]>([]);
  const [offset, setOffset] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Carregamento inicial
  useEffect(() => {
    const fetchPokemons = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getPokemons(PAGE_SIZE, 0);
        setPokemons(data);
        setFilteredPokemons(data);
        setOffset(PAGE_SIZE);
        setHasMore(data.length === PAGE_SIZE);
      } catch (err) {
        setError('Falha ao carregar Pokémons. Verifique sua conexão.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPokemons();
  }, []);

  // Filtro de busca
  useEffect(() => {
    if (search.trim() === '') {
      setFilteredPokemons(pokemons);
    } else {
      setFilteredPokemons(
        pokemons.filter(p =>
          p.name.toLowerCase().includes(search.trim().toLowerCase())
        )
      );
    }
  }, [search, pokemons]);

  // Carregar mais pokémons ao chegar no fim da lista
  const loadMorePokemons = async () => {
    if (isLoadingMore || !hasMore || search.trim() !== '') return;
    try {
      setIsLoadingMore(true);
      const data = await getPokemons(PAGE_SIZE, offset);
      setPokemons(prev => [...prev, ...data]);
      setOffset(prev => prev + PAGE_SIZE);
      setHasMore(data.length === PAGE_SIZE);
    } catch (err) {
      setError('Falha ao carregar mais Pokémons.');
    } finally {
      setIsLoadingMore(false);
    }
  };

  const renderEmptyComponent = () => {
    if (isLoading) return null;
    if (search.trim() !== '') {
      return (
        <Text style={styles.emptyText}>
          Nenhum Pokémon encontrado para '{search}'
        </Text>
      );
    }
    return (
      <Text style={styles.emptyText}>
        Nenhum Pokémon para exibir no momento.
      </Text>
    );
  };

  const renderFooter = () => {
    if (!isLoadingMore) return null;
    return (
      <View style={{ padding: 16 }}>
        <ActivityIndicator size="small" />
      </View>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
        <Text>Carregando Pokémons...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, paddingTop: insets.top }}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar Pokémon"
        value={search}
        onChangeText={setSearch}
        autoCapitalize="none"
      />
      <FlatList
        data={filteredPokemons}
        renderItem={({ item }) => <PokemonCard pokemon={item} />}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={renderEmptyComponent}
        onEndReached={loadMorePokemons}
        onEndReachedThreshold={0.2}
        ListFooterComponent={renderFooter}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
    textAlign: 'center',
  },
  listContent: {
    padding: 8,
    flexGrow: 1,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 32,
    color: '#888',
    fontSize: 16,
  },
  searchInput: {
    margin: 8,
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
});