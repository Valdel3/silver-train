import { Ingredient } from '../types';

export const getExpiringSoon = (ingredients: Ingredient[]): Ingredient[] => {
  const now = new Date();
  const sevenDaysFromNow = new Date();
  sevenDaysFromNow.setDate(now.getDate() + 7);

  return ingredients.filter(ingredient => {
    if (ingredient.frozen) {
      return false; // For now, frozen items are never expiring soon
    }

    const expirationDate = new Date(ingredient.expirationDate);
    const isExpiring = expirationDate <= sevenDaysFromNow;
    const isOpen = ingredient.opened;

    return isExpiring || isOpen;
  });
};

export const getRipenessCheckItems = (ingredients: Ingredient[]): Ingredient[] => {
    const now = new Date();
    const threeDaysAgo = new Date();
    threeDaysAgo.setDate(now.getDate() - 3);
  
    return ingredients.filter(ingredient => {
      if (ingredient.ripeness) {
        const lastEdited = new Date(ingredient.ripeness.lastEdited);
        return lastEdited < threeDaysAgo;
      }
      return false;
    });
  };

export const getLowQuantityItems = (ingredients: Ingredient[]): Ingredient[] => {
    return ingredients.filter(ingredient => {
        if (typeof ingredient.quantity === 'number') {
            return ingredient.quantity <= 1;
        }
        // for now, ignore string quantities like "1/2" or "low"
        return false;
    });
}; 