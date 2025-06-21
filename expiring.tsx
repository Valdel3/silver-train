import { StyleSheet, FlatList } from 'react-native';
import { Text, View } from '@/components/Themed';
import { useCallback, useState } from 'react';
import { useFocusEffect } from 'expo-router';
import { Ingredient } from '../../types';
import { loadData } from '../../services/storage';
import { getExpiringSoon } from '../../services/query';

export default function ExpiringScreen() {
  const [expiringIngredients, setExpiringIngredients] = useState<Ingredient[]>([]);

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
          setExpiringIngredients(getExpiringSoon(allIngredients));
        }
      };
      loadIngredients();
    }, [])
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Expiring Soon</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <FlatList
        data={expiringIngredients}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <Text>{item.name}</Text>
            <Text>Expires on: {new Date(item.expirationDate).toLocaleDateString()}</Text>
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
}); 