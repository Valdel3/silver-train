# Kitchen Buddy

Kitchen Buddy is a React Native application built with Expo to help you manage your pantry, track expiring ingredients, and maintain a grocery list.

## Components

Here is a list of the main components and screens in the application.

### `(tabs)` Layout

This is the main tab navigator for the application.

-   **State**: None
-   **Props**: None

### Screens

#### `PantryScreen` (`app/(tabs)/pantry.tsx`)

Displays all the ingredients currently in the user's pantry.

-   **State**:
    -   `ingredients: Ingredient[]`: An array of ingredient objects to display.
-   **Props**: None

#### `ExpiringScreen` (`app/(tabs)/expiring.tsx`)

Displays ingredients that are expiring soon or have been opened.

-   **State**:
    -   `expiringIngredients: Ingredient[]`: An array of filtered ingredient objects.
-   **Props**: None

#### `GroceryScreen` (`app/(tabs)/grocery.tsx`)

Manages the user's grocery list.

-   **State**:
    -   `groceryList: GroceryItem[]`: An array of items in the grocery list.
    -   `newItemName: string`: The text for the new grocery item to be added.
-   **Props**: None

#### `RipenessCheckScreen` (`app/(tabs)/ripeness.tsx`)

Shows ingredients that require a ripeness check.

-   **State**:
    -   `ripenessCheckIngredients: Ingredient[]`: An array of filtered ingredient objects.
-   **Props**: None

#### `LowQuantityScreen` (`app/(tabs)/low.tsx`)

Shows ingredients that are low in quantity.

-   **State**:
    -   `lowQuantityItems: Ingredient[]`: An array of filtered ingredient objects.
-   **Props**: None

#### `RecentlyBoughtScreen` (`app/(tabs)/bought.tsx`)

Displays items that were recently marked as "bought" from the grocery list.

-   **State**:
    -   `recentlyBought: GroceryItem[]`: An array of recently bought grocery items.
-   **Props**: None

### Modals

#### `AddIngredientModal` (`app/modal.tsx`)

A modal screen to add a new ingredient or edit an existing one.

-   **State**:
    -   `name`, `brand`, `quantity`: string
    -   `expirationDate`: Date
    -   `frozen`, `opened`: boolean
    -   `ripeness`: Ripeness | undefined
    -   `showDatePicker`: boolean
-   **Props**: None (receives parameters via navigation)

#### `BarcodeScannerScreen` (`app/scanner.tsx`)

A screen to scan barcodes using the device's camera.

-   **State**:
    -   `hasPermission: boolean | null`
    -   `scanned: boolean`
-   **Props**: None

## Component Tree

```
<Tabs>
  ├── PantryScreen
  │   └── <Link> -> AddIngredientModal
  ├── ExpiringScreen
  ├── GroceryScreen
  ├── RipenessCheckScreen
  ├── LowQuantityScreen
  ├── RecentlyBoughtScreen
  │   └── <Link> -> AddIngredientModal
</Tabs>

<AddIngredientModal>
  └── <Link> -> BarcodeScannerScreen
</AddIngredientModal>

<BarcodeScannerScreen />
```

## Control Flow

1.  **Data Persistence**: The app uses `AsyncStorage` via the `saveData` and `loadData` functions in `services/storage.ts`. All data is stored in a single JSON object.
2.  **State Management**: Each screen is responsible for its own state, primarily managed with `useState`.
3.  **Data Loading**: Screens use the `useFocusEffect` hook to call `loadData` whenever the screen comes into focus. This ensures data is always fresh.
4.  **Callbacks & State Changes**:
    -   **Adding/Editing Ingredients**:
        -   The `PantryScreen` and `RecentlyBoughtScreen` link to the `AddIngredientModal`.
        -   The `AddIngredientModal` collects user input and, on save (`handleSave`), it loads the current data, adds the new ingredient, and saves the updated data back to storage.
        -   When the modal closes, the previous screen (e.g., `PantryScreen`) comes back into focus, and its `useFocusEffect` re-loads and displays the updated data.
    -   **Adding to Grocery List**:
        -   From `LowQuantityScreen`, pressing "Add to Groceries" (`handleAddToGroceryList`) loads the current data, adds the item to the `groceryList`, and saves. The `GroceryScreen` will show the updated list when it's focused.
        -   From `GroceryScreen`, the quick-add form (`handleAddItem`) does the same.
    -   **Buying from Grocery List**:
        -   In `GroceryScreen`, pressing "Buy" (`handleBuyItem`) moves an item from the `groceryList` to the `recentlyBought` list and saves the change.
    -   **Barcode Scanning**:
        -   `AddIngredientModal` links to `BarcodeScannerScreen`.
        -   `BarcodeScannerScreen`, on a successful scan, navigates back to the modal, passing the barcode data as a navigation parameter.
        -   `AddIngredientModal` uses `useLocalSearchParams` to get the barcode and then fetches data from the OpenFoodFacts API.
``` 