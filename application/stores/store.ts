import { create } from 'zustand'

interface Character {
  id: number;
  name: string;
  image: string;
  episode: string[];
}


interface CharacterStore {
  selectedCharacters: Character[];
  setSelectedCharacters: (characters: Character[]) => void;
}

export const store = create<CharacterStore>((set) => ({
  selectedCharacters: [],
  setSelectedCharacters: (characters: Character[]) => set({ selectedCharacters: characters }),
}));
