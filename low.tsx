import { StyleSheet, FlatList, Button } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ingredient, GroceryItem } from '../../types';
import { loadData, saveData } from '../../services/storage';
import { getLowQuantityItems } from '../../services/query';

export default function LowQuantityScreen() {
  const [lowQuantityItems, setLowQuantityItems] = useState<Ingredient[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadIngredients = async () => {
        const data = await loadData();
        if (data && data.ingredients) {
          const allIngredients = data.ingredients.map(ing => ({
            ...ing,
            expirationDate: new Date(ing.expirationDate),
            ripeness: ing.ripeness ? { ...ing.ripeness, lastEdited: new Date(ing.ripeness.lastEdited) } : undefined,
          }));
          setLowQuantityItems(getLowQuantityItems(allIngredients));
        }
      };
      loadIngredients();
    }, [])
  );
  
  const handleAddToGroceryList = async (item: Ingredient) => {
    const newItem: GroceryItem = {
      id: Date.now().toString(),
      name: item.name,
      quantity: '1', // default quantity when adding to grocery list
    };
    const currentData = await loadData();
    const newGroceryList = [...(currentData?.groceryList || []), newItem];
    await saveData({ ingredients: currentData?.ingredients || [], groceryList: newGroceryList });
    // Maybe remove the item from the low quantity list after adding it?
    // For now, I'll just leave it. The user can refresh the screen.
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Low Quantity</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        data={lowQuantityItems}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name} ({item.quantity})</Text>
            <Button title="Add to Groceries" onPress={() => handleAddToGroceryList(item)} />
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