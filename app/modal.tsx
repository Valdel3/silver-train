import { View, Text, TextInput, Button, StyleSheet, Switch, Alert, Pressable, Platform } from 'react-native';
import { useEffect, useState } from 'react';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';
import { loadData, saveData } from '../services/storage';
import { Ingredient, Ripeness } from '../types';
import DateTimePicker from '@react-native-community/datetimepicker';

export default function AddIngredientModal() {
  const [name, setName] = useState('');
  const [brand, setBrand] = useState('');
  const [quantity, setQuantity] = useState('');
  const [expirationDate, setExpirationDate] = useState(new Date());
  const [frozen, setFrozen] = useState(false);
  const [opened, setOpened] = useState(false);
  const [ripeness, setRipeness] = useState<Ripeness | undefined>(undefined);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();
  const { barcode } = params;

  useEffect(() => {
    if (barcode && typeof barcode === 'string') {
      const fetchFoodData = async () => {
        try {
          const response = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
          const data = await response.json();
          if (data.status === 1) {
            const product = data.product;
            setName(product.product_name || '');
            setBrand(product.brands || '');
          } else {
            Alert.alert('Product not found', `Could not find a product with the barcode ${barcode}`);
          }
        } catch (error) {
          Alert.alert('Error', 'Could not fetch product data.');
          console.error(error);
        }
      };
      fetchFoodData();
    }
  }, [barcode]);

  const handleSave = async () => {
    let finalExpirationDate = expirationDate;
    if (frozen) {
        const sixMonthsFromNow = new Date();
        sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);
        if (finalExpirationDate < sixMonthsFromNow) {
            finalExpirationDate = sixMonthsFromNow;
        }
    }

    const newIngredient: Ingredient = {
      id: Date.now().toString(),
      name,
      brand: brand || undefined,
      quantity: quantity || undefined,
      expirationDate: finalExpirationDate,
      frozen,
      opened,
      barcode: typeof barcode === 'string' ? barcode : undefined,
      ripeness: ripeness ? { status: ripeness, lastEdited: new Date() } : undefined,
    };

    const currentData = await loadData();
    const newIngredients = [...(currentData?.ingredients || []), newIngredient];
    await saveData({ ingredients: newIngredients });
    
    router.back();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    const currentDate = selectedDate || expirationDate;
    setShowDatePicker(Platform.OS === 'ios');
    setExpirationDate(currentDate);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Add Ingredient</Text>
      <Link href="/scanner" style={styles.scanButton}>
        <Text style={styles.scanButtonText}>Scan Barcode</Text>
      </Link>
      <TextInput
        style={styles.input}
        placeholder="Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Brand (optional)"
        value={brand}
        onChangeText={setBrand}
      />
      <TextInput
        style={styles.input}
        placeholder="Quantity (e.g., 12, 1/2, 2kg)"
        value={quantity}
        onChangeText={setQuantity}
      />
      <View style={styles.switchContainer}>
        <Text>Frozen</Text>
        <Switch value={frozen} onValueChange={setFrozen} />
      </View>
      <View style={styles.switchContainer}>
        <Text>Opened</Text>
        <Switch value={opened} onValueChange={setOpened} />
      </View>
      <View style={styles.ripenessContainer}>
        <Text>Ripeness:</Text>
        <View style={styles.ripenessButtons}>
            {(['green', 'ripe/mature', 'advanced', 'too ripe'] as Ripeness[]).map(r => (
                <Pressable 
                    key={r} 
                    onPress={() => setRipeness(ripeness === r ? undefined : r)}
                    style={[styles.ripenessButton, ripeness === r && styles.ripenessButtonSelected]}
                >
                    <Text style={[styles.ripenessButtonText, ripeness === r && styles.ripenessButtonTextSelected]}>{r}</Text>
                </Pressable>
            ))}
        </View>
      </View>
      <View>
        <Button onPress={() => setShowDatePicker(true)} title="Select Expiration Date" />
        <Text style={{alignSelf: 'center', marginVertical: 5}}>Expires on: {expirationDate.toLocaleDateString()}</Text>
        {showDatePicker && (
            <DateTimePicker
                testID="dateTimePicker"
                value={expirationDate}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
        )}
      </View>
      <Button title="Save" onPress={handleSave} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  scanButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginBottom: 15,
    alignItems: 'center',
  },
  scanButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  ripenessContainer: {
    marginBottom: 15,
  },
  ripenessButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 5,
  },
  ripenessButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  ripenessButtonSelected: {
    backgroundColor: '#007BFF',
    borderColor: '#007BFF',
  },
  ripenessButtonText: {
    color: '#333',
  },
  ripenessButtonTextSelected: {
    color: 'white',
  },
});
