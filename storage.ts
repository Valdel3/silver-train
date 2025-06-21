import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ingredient, GroceryItem } from '../types';

const STORAGE_KEY = 'kitchenBuddyData';

export interface AppData {
  ingredients: Ingredient[];
  groceryList: GroceryItem[];
  recentlyBought: GroceryItem[];
}

export const saveData = async (data: AppData): Promise<void> => {
  try {
    const jsonValue = JSON.stringify(data);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
  } catch (e) {
    console.error("Failed to save data to storage", e);
  }
};

export const loadData = async (): Promise<AppData | null> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.error("Failed to load data from storage", e);
    return null;
  }
}; 