import type { MenuItem } from "@shared/schema";

// Utility functions for menu data management and filtering

export const cuisineCategories = [
  "North Indian",
  "South Indian", 
  "Punjabi",
  "Gujarati",
  "Bengali",
  "Maharashtrian",
  "Kashmiri",
  "Hyderabadi",
  "Nepali",
  "Bangladeshi",
  "Sri Lankan",
  "Pakistani",
  "International"
] as const;

export const dietaryFilters = [
  "vegetarian",
  "vegan", 
  "gluten-free",
  "dairy-free",
  "nut-free",
  "high-protein",
  "low-carb",
  "keto",
  "healthy"
] as const;

export const spiceLevels = [
  "mild",
  "medium", 
  "hot",
  "extra-hot"
] as const;

export const mealCategories = [
  "Breakfast",
  "Snacks",
  "Lunch", 
  "Dinner",
  "Beverages",
  "Desserts",
  "Wraps",
  "Rice",
  "Curry",
  "Bread",
  "South Indian",
  "Street Food"
] as const;

// Filter menu items by cuisine
export const filterByCuisine = (items: MenuItem[], cuisine: string): MenuItem[] => {
  return items.filter(item => 
    item.cuisine.toLowerCase() === cuisine.toLowerCase() && item.isAvailable
  );
};

// Filter menu items by category
export const filterByCategory = (items: MenuItem[], category: string): MenuItem[] => {
  return items.filter(item => 
    item.category.toLowerCase() === category.toLowerCase() && item.isAvailable
  );
};

// Filter menu items by dietary preferences
export const filterByDiet = (items: MenuItem[], dietType: string): MenuItem[] => {
  switch (dietType.toLowerCase()) {
    case "vegetarian":
      return items.filter(item => item.isVegetarian && item.isAvailable);
    case "vegan":
      return items.filter(item => item.isVegan && item.isAvailable);
    case "gluten-free":
      return items.filter(item => 
        item.tags?.includes("gluten-free") && item.isAvailable
      );
    case "high-protein":
      return items.filter(item => 
        item.nutrition && item.nutrition.protein >= 25 && item.isAvailable
      );
    case "low-carb":
      return items.filter(item => 
        item.nutrition && item.nutrition.carbs <= 20 && item.isAvailable
      );
    default:
      return items.filter(item => item.isAvailable);
  }
};

// Filter by spice level
export const filterBySpiceLevel = (items: MenuItem[], spiceLevel: string): MenuItem[] => {
  return items.filter(item => 
    item.spiceLevel?.toLowerCase() === spiceLevel.toLowerCase() && item.isAvailable
  );
};

// Filter by price range
export const filterByPriceRange = (
  items: MenuItem[], 
  minPrice: number, 
  maxPrice: number
): MenuItem[] => {
  return items.filter(item => {
    const price = parseFloat(item.price);
    return price >= minPrice && price <= maxPrice && item.isAvailable;
  });
};

// Search menu items by name or description
export const searchMenuItems = (items: MenuItem[], query: string): MenuItem[] => {
  if (!query.trim()) return items.filter(item => item.isAvailable);
  
  const searchTerm = query.toLowerCase();
  return items.filter(item => 
    (item.name.toLowerCase().includes(searchTerm) ||
     item.description.toLowerCase().includes(searchTerm) ||
     item.ingredients?.some(ingredient => 
       ingredient.toLowerCase().includes(searchTerm)
     ) ||
     item.tags?.some(tag => 
       tag.toLowerCase().includes(searchTerm)
     )) && item.isAvailable
  );
};

// Get popular items (mock logic based on tags)
export const getPopularItems = (items: MenuItem[]): MenuItem[] => {
  return items.filter(item => 
    item.tags?.includes("popular") && item.isAvailable
  ).slice(0, 8);
};

// Get chef's special items
export const getChefSpecials = (items: MenuItem[]): MenuItem[] => {
  return items.filter(item => 
    (item.tags?.includes("chef-special") || item.tags?.includes("chef's special")) && 
    item.isAvailable
  );
};

// Get student combo meals
export const getStudentCombos = (items: MenuItem[]): MenuItem[] => {
  return items.filter(item => 
    item.tags?.includes("student-combo") && item.isAvailable
  );
};

// Calculate total nutrition for multiple items
export const calculateTotalNutrition = (items: { menuItem: MenuItem; quantity: number }[]) => {
  return items.reduce((total, { menuItem, quantity }) => {
    if (!menuItem.nutrition) return total;
    
    return {
      calories: total.calories + (menuItem.nutrition.calories * quantity),
      protein: total.protein + (menuItem.nutrition.protein * quantity),
      carbs: total.carbs + (menuItem.nutrition.carbs * quantity),
      fat: total.fat + (menuItem.nutrition.fat * quantity),
      fiber: total.fiber + ((menuItem.nutrition.fiber || 0) * quantity),
      sodium: total.sodium + ((menuItem.nutrition.sodium || 0) * quantity),
    };
  }, {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
    fiber: 0,
    sodium: 0,
  });
};

// Get items by calorie range
export const filterByCalories = (
  items: MenuItem[], 
  minCalories: number, 
  maxCalories: number
): MenuItem[] => {
  return items.filter(item => {
    if (!item.nutrition) return false;
    return item.nutrition.calories >= minCalories && 
           item.nutrition.calories <= maxCalories && 
           item.isAvailable;
  });
};

// Get items suitable for specific dietary goals
export const getItemsForGoal = (items: MenuItem[], goal: string): MenuItem[] => {
  switch (goal.toLowerCase()) {
    case "weight-loss":
      return items.filter(item => 
        item.nutrition && 
        item.nutrition.calories <= 400 && 
        item.nutrition.protein >= 15 &&
        item.isAvailable
      );
    case "muscle-gain":
      return items.filter(item => 
        item.nutrition && 
        item.nutrition.protein >= 25 &&
        item.isAvailable
      );
    case "heart-healthy":
      return items.filter(item => 
        item.nutrition && 
        item.nutrition.fat <= 15 && 
        (item.nutrition.sodium || 0) <= 600 &&
        item.isAvailable
      );
    default:
      return items.filter(item => item.isAvailable);
  }
};

// Sort items by different criteria
export const sortMenuItems = (items: MenuItem[], sortBy: string): MenuItem[] => {
  const sortedItems = [...items];
  
  switch (sortBy.toLowerCase()) {
    case "price-low-high":
      return sortedItems.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
    case "price-high-low":
      return sortedItems.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
    case "calories-low-high":
      return sortedItems.sort((a, b) => 
        (a.nutrition?.calories || 0) - (b.nutrition?.calories || 0)
      );
    case "calories-high-low":
      return sortedItems.sort((a, b) => 
        (b.nutrition?.calories || 0) - (a.nutrition?.calories || 0)
      );
    case "protein-high-low":
      return sortedItems.sort((a, b) => 
        (b.nutrition?.protein || 0) - (a.nutrition?.protein || 0)
      );
    case "name-a-z":
      return sortedItems.sort((a, b) => a.name.localeCompare(b.name));
    case "name-z-a":
      return sortedItems.sort((a, b) => b.name.localeCompare(a.name));
    default:
      return sortedItems;
  }
};

// Get recommended items based on time of day
export const getRecommendedByTime = (items: MenuItem[]): MenuItem[] => {
  const hour = new Date().getHours();
  
  if (hour >= 6 && hour < 11) {
    // Breakfast time
    return items.filter(item => 
      item.category.toLowerCase().includes("breakfast") && item.isAvailable
    );
  } else if (hour >= 11 && hour < 16) {
    // Lunch time
    return items.filter(item => 
      (item.category.toLowerCase().includes("lunch") || 
       item.category.toLowerCase().includes("rice") ||
       item.category.toLowerCase().includes("curry")) && item.isAvailable
    );
  } else if (hour >= 16 && hour < 19) {
    // Snack time
    return items.filter(item => 
      (item.category.toLowerCase().includes("snack") ||
       item.category.toLowerCase().includes("street food")) && item.isAvailable
    );
  } else {
    // Dinner time
    return items.filter(item => 
      (item.category.toLowerCase().includes("dinner") ||
       item.category.toLowerCase().includes("curry")) && item.isAvailable
    );
  }
};

// Generate meal combinations for different plans
export const generateMealPlan = (
  items: MenuItem[], 
  days: number, 
  caloriesPerDay: number
): MenuItem[][] => {
  const mealsPerDay = 3; // breakfast, lunch, dinner
  const caloriesPerMeal = caloriesPerDay / mealsPerDay;
  const plan: MenuItem[][] = [];
  
  for (let day = 0; day < days; day++) {
    const dayMeals: MenuItem[] = [];
    let remainingCalories = caloriesPerDay;
    
    // Select meals trying to meet calorie target
    for (let meal = 0; meal < mealsPerDay; meal++) {
      const targetCalories = remainingCalories / (mealsPerDay - meal);
      const suitableItems = items.filter(item => 
        item.nutrition && 
        Math.abs(item.nutrition.calories - targetCalories) <= 100 &&
        item.isAvailable
      );
      
      if (suitableItems.length > 0) {
        const randomItem = suitableItems[Math.floor(Math.random() * suitableItems.length)];
        dayMeals.push(randomItem);
        remainingCalories -= randomItem.nutrition?.calories || 0;
      }
    }
    
    plan.push(dayMeals);
  }
  
  return plan;
};

// Check for allergen conflicts
export const checkAllergens = (items: MenuItem[], userAllergens: string[]): MenuItem[] => {
  return items.filter(item => {
    if (!item.allergens) return true;
    return !item.allergens.some(allergen => 
      userAllergens.includes(allergen.toLowerCase())
    );
  });
};

// Get items with specific nutritional benefits
export const getItemsByNutrition = (items: MenuItem[], nutritionType: string): MenuItem[] => {
  switch (nutritionType.toLowerCase()) {
    case "high-fiber":
      return items.filter(item => 
        item.nutrition && (item.nutrition.fiber || 0) >= 5 && item.isAvailable
      );
    case "low-sodium":
      return items.filter(item => 
        item.nutrition && (item.nutrition.sodium || 0) <= 300 && item.isAvailable
      );
    case "balanced":
      return items.filter(item => {
        if (!item.nutrition) return false;
        const { protein, carbs, fat } = item.nutrition;
        const total = protein + carbs + fat;
        const proteinRatio = protein / total;
        const carbRatio = carbs / total;
        const fatRatio = fat / total;
        
        return proteinRatio >= 0.15 && proteinRatio <= 0.35 &&
               carbRatio >= 0.45 && carbRatio <= 0.65 &&
               fatRatio >= 0.20 && fatRatio <= 0.35 &&
               item.isAvailable;
      });
    default:
      return items.filter(item => item.isAvailable);
  }
};
