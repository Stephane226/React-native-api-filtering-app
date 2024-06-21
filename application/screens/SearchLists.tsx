import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';
import CheckBox from "expo-checkbox";
import DropDownPicker from 'react-native-dropdown-picker';
import { useQuery } from 'react-query';
import { store } from '../stores/store';


const fetchCharacters = async (query: string) => {
  const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}`);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};


const MultiSelectAutocomplete: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<any[]>([]);
  const selectedCharacters = store(state => state.selectedCharacters);
  const setSelectedCharacters = store(state => state.setSelectedCharacters);

  const handleSearch = async (text: string) => {
    setQuery(text);
    if (text.length === 0) {
      setSearchResults([]);
      return;
    }
    setLoading(true);
    try {
      const data = await fetchCharacters(text);
      setSearchResults(data.results);
      setItems(data.results.map((character: any) => ({
        label: character.name,
        value: character.id,
        character: character
      })));
      setError('');
    } catch (error) {
      setError('Error fetching data');
      setSearchResults([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleSearch(query);
  }, [query]);

  const toggleCharacterSelection = (selectedItems: any[]) => {
    const selected = selectedItems && selectedItems.map(item => items.find(i => i.value === item).character);
    setSelectedCharacters(selected || []);
  };

  const renderItem = (item: any, index: number, isSelected: boolean) => {
    if (!item.character) {
      return null;
    }

    return (
      <View style={styles.characterContainer}>
        <CheckBox
          value={isSelected}
          onValueChange={() => toggleCharacterSelection(
            isSelected
              ? selectedCharacters.filter((c) => c.id !== item.value).map((c) => c.id)
              : [...selectedCharacters, item.character].map((c) => c.id)
          )}
        />
        <Image source={{ uri: item.character.image }} style={styles.characterImage} />
        <View style={{ flex: 1 }}>
          <Text>{item.character.name}</Text>
          <Text>Episodes: {item.character.episode.length}</Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <DropDownPicker
        open={open}
        value={selectedCharacters.map(character => character.id)}
        items={items}
        setOpen={setOpen}
        setValue={() => { console.log('clicked item') }}
        setItems={setItems}
        searchable={true}
        placeholder="Search for characters"
        onChangeSearchText={handleSearch}
        loading={loading}
        activityIndicatorColor="blue"
        multiple={true}
        mode="BADGE"
        badgeDotColors={["#e76f51", "#00b4d8", "#e9c46a"]}
        renderListItem={({ item, index, isSelected }) => renderItem(item, index, isSelected)}
      />
      {loading && <ActivityIndicator style={styles.loader} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}
     
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginTop: 100
  },
  characterImage: {
    width: 30,
    height: 30,
    marginHorizontal: 10

  },
  loader: {
    marginTop: 10,
  },
  error: {
    marginTop: 10,
    color: 'red',
  },
  characterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'lightgray',
  },
  selectedCharactersContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 10,
  },
  selectedCharacterButton: {
    backgroundColor: 'lightgray',
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  selectedCharacterText: {
    color: 'black',
    fontWeight: 'bold',
  },
});

export default MultiSelectAutocomplete;
