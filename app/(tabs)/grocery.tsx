import { StyleSheet, FlatList, TextInput, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { GroceryItem } from '../../types';
import { loadData, saveData } from '../../services/storage';

export default function GroceryScreen() {
  const [groceryList, setGroceryList] = useState<GroceryItem[]>([]);
  const [newItemName, setNewItemName] = useState('');

  useFocusEffect(
    useCallback(() => {
      const loadGroceryList = async () => {
        const data = await loadData();
        if (data && data.groceryList) {
          setGroceryList(data.groceryList);
        }
      };
      loadGroceryList();
    }, [])
  );

  const handleAddItem = async () => {
    if (newItemName.trim() === '') return;
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: newItemName.trim(),
    };
    const newGroceryList = [...groceryList, newItem];
    setGroceryList(newGroceryList);
    const currentData = await loadData();
    await saveData({ ingredients: currentData?.ingredients || [], groceryList: newGroceryList });
    setNewItemName('');
  };

  const handleBuyItem = async (itemId: string) => {
    const newGroceryList = groceryList.filter(item => item.id !== itemId);
    setGroceryList(newGroceryList);
    const currentData = await loadData();
    await saveData({ ingredients: currentData?.ingredients || [], groceryList: newGroceryList });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Grocery List</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <View style={styles.addForm}>
        <TextInput
          style={styles.input}
          placeholder="Add new item"
          value={newItemName}
          onChangeText={setNewItemName}
        />
        <Button title="Add" onPress={handleAddItem} />
      </View>
      <FlatList
        data={groceryList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Button title="Buy" onPress={() => handleBuyItem(item.id)} />
          </View>
        )}
        style={{width: '100%'}}
      />
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        paddingTop: 50,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 15,
        height: 1,
        width: '80%',
    },
    addForm: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 15,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        borderRadius: 5,
        marginRight: 10,
    },
    itemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
}); 