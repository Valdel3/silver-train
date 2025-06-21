import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useCallback, useState } from 'react';
import { Ingredient } from '../../types';
import { loadData } from '../../services/storage';
import { Link, useFocusEffect } from 'expo-router';

export default function PantryScreen() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);

  useFocusEffect(
    useCallback(() => {
      const loadIngredients = async () => {
        const data = await loadData();
        if (data && data.ingredients) {
          // Dates are stored as strings in JSON, so we need to convert them back
          const ingredientsWithDates = data.ingredients.map(ing => ({
            ...ing,
            expirationDate: new Date(ing.expirationDate),
            ripeness: ing.ripeness ? { ...ing.ripeness, lastEdited: new Date(ing.ripeness.lastEdited) } : undefined,
          }));
          setIngredients(ingredientsWithDates);
        }
      };
      loadIngredients();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Pantry</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <Link href="/modal" style={styles.addButton}>
        <Text style={styles.addButtonText}>Add Ingredient</Text>
      </Link>
      <FlatList
        data={ingredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text style={styles.itemName}>{item.name}{item.quantity ? ` (${item.quantity})` : ''}</Text>
            {item.brand && <Text style={styles.itemBrand}>{item.brand}</Text>}
            <Text>Expires on: {item.expirationDate.toLocaleDateString()}</Text>
            {item.ripeness && <Text>Ripeness: {item.ripeness.status}</Text>}
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
    justifyContent: 'center',
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
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  itemName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  itemBrand: {
    fontSize: 14,
    color: '#666',
  },
  addButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  }
}); 