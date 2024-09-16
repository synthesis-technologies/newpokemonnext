import { gql, request } from 'graphql-request';
import { API_ENDPOINT } from '../constants/pokemon';
import { PokemonEvolution } from '../src/types';

const query = gql`
{
  pokemon_v2_evolutionchain {
    pokemon_v2_pokemonspecies {
      id
      name
      evolves_from_species_id
      pokemon_v2_generation {
        name
      }
      pokemon_v2_pokemons(limit: 1) {
        name
        pokemon_v2_pokemontypes {
          pokemon_v2_type {
            name
          }
        }
      }
      pokemon_v2_pokemonevolutions {
        min_level
        pokemon_v2_evolutiontrigger {
          name
        }
        pokemon_v2_item {
          name
        }
      }
    }
  }
}
`;

// Function to fetch and transform the data
export async function getPokemonEvolutions(): Promise<PokemonEvolution[]> {
  const data = await request(API_ENDPOINT, query);
  
  // Transform the data to match the PokemonEvolution type
  const evolutions: PokemonEvolution[] = data.pokemon_v2_evolutionchain.flatMap((chain: any) => {
    return chain.pokemon_v2_pokemonspecies.map((species: any) => ({
      evolvesFromSpeciesId: species.evolves_from_species_id,
      id: species.id,
      name: species.name,
      generation: species.pokemon_v2_generation.name,
      types: species.pokemon_v2_pokemons[0]?.pokemon_v2_pokemontypes.map((type: any) => type.pokemon_v2_type.name) || [],
      trigger: species.pokemon_v2_pokemonevolutions[0]?.pokemon_v2_evolutiontrigger?.name,
      minLevel: species.pokemon_v2_pokemonevolutions[0]?.min_level,
      item: species.pokemon_v2_pokemonevolutions[0]?.pokemon_v2_item?.name,
    }));
  });

  return evolutions;
}
