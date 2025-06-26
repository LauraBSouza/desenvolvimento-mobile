import axios from 'axios';
import { Pokemon } from '../types/Pokemon';

const API_URL = 'https://pokeapi.co/api/v2';

export const getPokemons = async (limit = 30, offset = 0): Promise<Pokemon[]> => {
  try {
    const response = await axios.get(`${API_URL}/pokemon?limit=${limit}&offset=${offset}`);
    const results = response.data.results;

    const pokemons = await Promise.all(
      results.map(async (item: any) => {
        const details = await axios.get(item.url);
        return {
          id: details.data.id,
          name: details.data.name,
          image: details.data.sprites.other['official-artwork'].front_default,
          types: details.data.types.map((t: any) => t.type.name),
          height: details.data.height,
          weight: details.data.weight,
        };
      })
    );

    return pokemons;
  } catch (error) {
    throw new Error('Erro ao buscar Pokémons');
  }
};

export const getPokemonById = async (id: number): Promise<Pokemon> => {
  try {
    const response = await axios.get(`${API_URL}/pokemon/${id}`);
    const data = response.data;
    return {
      id: data.id,
      name: data.name,
      image: data.sprites.other['official-artwork'].front_default,
      types: data.types.map((t: any) => t.type.name),
    };
  } catch (error) {
    throw new Error('Erro ao buscar detalhes do Pokémon');
  }
};