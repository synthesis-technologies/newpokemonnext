export type PokemonEvolution = {
  evolvesFromSpeciesId: number | null;
  id: number;
  name: string;
  generation: string;
  types: string[];
  trigger?: string;
  minLevel?: number;
  item?: string;
};
