export type Ripeness = 'green' | 'ripe/mature' | 'advanced' | 'too ripe';

export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  ripeness?: {
    status: Ripeness;
    lastEdited: Date;
  };
  frozen: boolean;
  opened: boolean;
  expirationDate: Date;
  barcode?: string;
  quantity?: number | string; // number for items, string for fractions like "1/2"
}

export interface Shop {
  id: string;
  name:string;
  location: {
    latitude: number;
    longitude: number;
  };
  type: 'general' | 'butcher' | 'bakery' | 'other';
}

export interface GroceryItem {
    id: string;
    name: string;
    quantity?: number | string;
} 