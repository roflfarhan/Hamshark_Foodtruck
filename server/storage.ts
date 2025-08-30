import { 
  type User, 
  type InsertUser, 
  type MenuItem, 
  type InsertMenuItem,
  type Order,
  type InsertOrder,
  type TruckLocation,
  type InsertTruckLocation,
  type LoyaltyReward,
  type InsertLoyaltyReward,
  type MembershipPlan,
  type InsertMembershipPlan
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserLoyaltyPoints(userId: string, points: number): Promise<User | undefined>;

  // Menu Items
  getAllMenuItems(): Promise<MenuItem[]>;
  getMenuItemsByCategory(category: string): Promise<MenuItem[]>;
  getMenuItemsByCuisine(cuisine: string): Promise<MenuItem[]>;
  getMenuItem(id: string): Promise<MenuItem | undefined>;
  createMenuItem(item: InsertMenuItem): Promise<MenuItem>;

  // Orders
  createOrder(order: InsertOrder): Promise<Order>;
  getOrder(id: string): Promise<Order | undefined>;
  getOrdersByUser(userId: string): Promise<Order[]>;
  updateOrderStatus(orderId: string, status: string): Promise<Order | undefined>;

  // Truck Locations
  getAllTruckLocations(): Promise<TruckLocation[]>;
  getTruckLocation(id: string): Promise<TruckLocation | undefined>;
  updateTruckStatus(locationId: string, status: string): Promise<TruckLocation | undefined>;

  // Loyalty Rewards
  getAllLoyaltyRewards(): Promise<LoyaltyReward[]>;
  getLoyaltyRewardsByTier(tier: string): Promise<LoyaltyReward[]>;

  // Membership Plans
  getAllMembershipPlans(): Promise<MembershipPlan[]>;
  getMembershipPlan(id: string): Promise<MembershipPlan | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private menuItems: Map<string, MenuItem>;
  private orders: Map<string, Order>;
  private truckLocations: Map<string, TruckLocation>;
  private loyaltyRewards: Map<string, LoyaltyReward>;
  private membershipPlans: Map<string, MembershipPlan>;

  constructor() {
    this.users = new Map();
    this.menuItems = new Map();
    this.orders = new Map();
    this.truckLocations = new Map();
    this.loyaltyRewards = new Map();
    this.membershipPlans = new Map();
    this.initializeData();
  }

  private initializeData() {
    // Initialize comprehensive menu items with 20+ items per cuisine
    const sampleMenuItems: MenuItem[] = [
      // North Indian Cuisine (20+ items)
      {
        id: "ni1",
        name: "Paneer Tikka Wrap",
        description: "Grilled paneer with fresh vegetables and mint chutney",
        price: "180.00",
        category: "Wraps",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 420, protein: 28, carbs: 32, fat: 18, fiber: 8, sodium: 680 },
        ingredients: ["paneer", "bell peppers", "onions", "mint chutney", "whole wheat wrap"],
        allergens: ["dairy", "gluten"],
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["high-protein", "spicy", "vegetarian"],
        isAvailable: true
      },
      {
        id: "ni2",
        name: "Butter Chicken",
        description: "Rich tomato-based curry with tender chicken pieces",
        price: "280.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 520, protein: 35, carbs: 15, fat: 24, fiber: 3, sodium: 890 },
        ingredients: ["chicken", "tomato sauce", "cream", "butter", "spices"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["popular", "high-protein", "non-vegetarian"],
        isAvailable: true
      },
      {
        id: "ni3",
        name: "Dal Makhani",
        description: "Creamy black lentils cooked in rich tomato gravy",
        price: "200.00",
        category: "Dal",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 340, protein: 18, carbs: 45, fat: 12, fiber: 15, sodium: 650 },
        ingredients: ["black lentils", "kidney beans", "cream", "tomato", "ginger-garlic"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["chef-special", "protein-rich", "creamy"],
        isAvailable: true
      },
      {
        id: "ni4",
        name: "Chole Bhature",
        description: "Spicy chickpea curry with fluffy fried bread",
        price: "160.00",
        category: "Combo",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "hot",
        nutrition: { calories: 580, protein: 22, carbs: 78, fat: 20, fiber: 12, sodium: 920 },
        ingredients: ["chickpeas", "refined flour", "yogurt", "spices", "oil"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["traditional", "spicy", "filling"],
        isAvailable: true
      },
      {
        id: "ni5",
        name: "Rajma Chawal",
        description: "Kidney bean curry served with steamed basmati rice",
        price: "140.00",
        category: "Rice Bowl",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 460, protein: 20, carbs: 85, fat: 8, fiber: 18, sodium: 580 },
        ingredients: ["kidney beans", "basmati rice", "onion", "tomato", "cumin"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["healthy", "protein-rich", "student-combo"],
        isAvailable: true
      },
      {
        id: "ni6",
        name: "Palak Paneer",
        description: "Fresh spinach curry with soft cottage cheese cubes",
        price: "190.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 380, protein: 26, carbs: 18, fat: 22, fiber: 8, sodium: 720 },
        ingredients: ["spinach", "paneer", "cream", "garlic", "garam masala"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1588166524941-3bf61a9c41db?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["healthy", "iron-rich", "green"],
        isAvailable: true
      },
      {
        id: "ni7",
        name: "Aloo Paratha",
        description: "Stuffed potato flatbread served with curd and pickle",
        price: "120.00",
        category: "Bread",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 420, protein: 12, carbs: 65, fat: 14, fiber: 6, sodium: 480 },
        ingredients: ["whole wheat", "potato", "curd", "ghee", "cumin"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1574653789513-8285786aa96e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["breakfast", "comfort-food", "filling"],
        isAvailable: true
      },
      {
        id: "ni8",
        name: "Chicken Biryani",
        description: "Aromatic basmati rice layered with spiced chicken",
        price: "320.00",
        category: "Biryani",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 680, protein: 42, carbs: 78, fat: 22, fiber: 4, sodium: 1020 },
        ingredients: ["chicken", "basmati rice", "saffron", "yogurt", "fried onions"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["chef-special", "festive", "aromatic"],
        isAvailable: true
      },
      {
        id: "ni9",
        name: "Paneer Makhani",
        description: "Cottage cheese in rich tomato and cream sauce",
        price: "210.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 450, protein: 28, carbs: 20, fat: 32, fiber: 4, sodium: 780 },
        ingredients: ["paneer", "tomato", "cream", "cashews", "fenugreek"],
        allergens: ["dairy", "nuts"],
        imageUrl: "https://images.unsplash.com/photo-1601050690597-df0568f70950?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["creamy", "rich", "popular"],
        isAvailable: true
      },
      {
        id: "ni10",
        name: "Kadai Chicken",
        description: "Chicken cooked with bell peppers in spicy tomato gravy",
        price: "260.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "hot",
        nutrition: { calories: 420, protein: 38, carbs: 12, fat: 24, fiber: 3, sodium: 850 },
        ingredients: ["chicken", "bell peppers", "tomato", "coriander seeds", "dry red chili"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1599043513900-ed6fe01d1127?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["spicy", "protein-rich", "colorful"],
        isAvailable: true
      },
      {
        id: "ni11",
        name: "Naan Bread",
        description: "Soft, fluffy leavened bread baked in tandoor",
        price: "40.00",
        category: "Bread",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 280, protein: 8, carbs: 52, fat: 6, fiber: 2, sodium: 420 },
        ingredients: ["refined flour", "yogurt", "milk", "yeast", "ghee"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1506280754576-f6fa8a873550?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["classic", "soft", "accompaniment"],
        isAvailable: true
      },
      {
        id: "ni12",
        name: "Garlic Naan",
        description: "Naan topped with fresh garlic and herbs",
        price: "50.00",
        category: "Bread",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 320, protein: 9, carbs: 54, fat: 8, fiber: 3, sodium: 480 },
        ingredients: ["refined flour", "garlic", "coriander", "butter", "milk"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1574653789513-8285786aa96e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["aromatic", "flavorful", "popular"],
        isAvailable: true
      },
      {
        id: "ni13",
        name: "Tandoori Chicken",
        description: "Marinated chicken grilled in traditional tandoor",
        price: "240.00",
        category: "Tandoor",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 380, protein: 45, carbs: 8, fat: 18, fiber: 2, sodium: 920 },
        ingredients: ["chicken", "yogurt", "red chili", "garam masala", "lemon"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1599043513900-ed6fe01d1127?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["grilled", "smoky", "protein-rich"],
        isAvailable: true
      },
      {
        id: "ni14",
        name: "Seekh Kebab",
        description: "Spiced minced meat skewers grilled to perfection",
        price: "220.00",
        category: "Tandoor",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "hot",
        nutrition: { calories: 320, protein: 28, carbs: 4, fat: 22, fiber: 1, sodium: 780 },
        ingredients: ["minced meat", "green chili", "ginger", "coriander", "mint"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["spicy", "protein-rich", "grilled"],
        isAvailable: true
      },
      {
        id: "ni15",
        name: "Malai Kofta",
        description: "Cottage cheese and potato dumplings in rich gravy",
        price: "200.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 480, protein: 20, carbs: 28, fat: 34, fiber: 6, sodium: 720 },
        ingredients: ["paneer", "potato", "cream", "cashews", "tomato"],
        allergens: ["dairy", "nuts"],
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["rich", "creamy", "special"],
        isAvailable: true
      },
      {
        id: "ni16",
        name: "Amritsari Kulcha",
        description: "Stuffed bread with spiced potatoes and onions",
        price: "80.00",
        category: "Bread",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 380, protein: 10, carbs: 62, fat: 12, fiber: 5, sodium: 520 },
        ingredients: ["refined flour", "potato", "onion", "coriander", "ajwain"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1574653789513-8285786aa96e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["stuffed", "traditional", "flavorful"],
        isAvailable: true
      },
      {
        id: "ni17",
        name: "Chicken Curry",
        description: "Home-style chicken curry with aromatic spices",
        price: "250.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 420, protein: 36, carbs: 18, fat: 24, fiber: 4, sodium: 880 },
        ingredients: ["chicken", "onion", "tomato", "ginger-garlic", "turmeric"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["homestyle", "comfort-food", "traditional"],
        isAvailable: true
      },
      {
        id: "ni18",
        name: "Paneer Tikka",
        description: "Marinated cottage cheese cubes grilled with vegetables",
        price: "180.00",
        category: "Tandoor",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 340, protein: 22, carbs: 12, fat: 24, fiber: 4, sodium: 620 },
        ingredients: ["paneer", "yogurt", "bell peppers", "red chili powder", "cumin"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["grilled", "healthy", "protein-rich"],
        isAvailable: true
      },
      {
        id: "ni19",
        name: "Mutton Curry",
        description: "Tender mutton pieces in spiced onion-tomato gravy",
        price: "320.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "hot",
        nutrition: { calories: 520, protein: 42, carbs: 16, fat: 32, fiber: 3, sodium: 980 },
        ingredients: ["mutton", "onion", "tomato", "red chili", "garam masala"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["spicy", "protein-rich", "traditional"],
        isAvailable: true
      },
      {
        id: "ni20",
        name: "Vegetable Biryani",
        description: "Fragrant basmati rice with mixed vegetables and spices",
        price: "180.00",
        category: "Biryani",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 420, protein: 14, carbs: 78, fat: 8, fiber: 12, sodium: 680 },
        ingredients: ["basmati rice", "mixed vegetables", "saffron", "mint", "fried onions"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1563379091339-03246963d8d5?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["aromatic", "healthy", "colorful"],
        isAvailable: true
      },

      // South Indian Cuisine (20+ items)
      {
        id: "si1",
        name: "Masala Dosa",
        description: "Crispy dosa with spiced potato filling and chutney",
        price: "150.00",
        category: "Dosa",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 380, protein: 12, carbs: 68, fat: 8, fiber: 6, sodium: 420 },
        ingredients: ["rice batter", "urad dal", "potato", "spices", "coconut chutney"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["student-combo", "traditional", "gluten-free"],
        isAvailable: true
      },
      {
        id: "si2",
        name: "Plain Dosa",
        description: "Crispy golden dosa served with sambar and chutneys",
        price: "80.00",
        category: "Dosa",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 280, protein: 8, carbs: 52, fat: 4, fiber: 4, sodium: 320 },
        ingredients: ["rice", "urad dal", "fenugreek seeds", "salt"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["light", "crispy", "traditional"],
        isAvailable: true
      },
      {
        id: "si3",
        name: "Rava Dosa",
        description: "Crispy semolina dosa with onions and spices",
        price: "120.00",
        category: "Dosa",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 320, protein: 10, carbs: 58, fat: 6, fiber: 5, sodium: 380 },
        ingredients: ["semolina", "rice flour", "onion", "green chili", "curry leaves"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["crunchy", "instant", "spicy"],
        isAvailable: true
      },
      {
        id: "si4",
        name: "Idli Sambar",
        description: "Steamed rice cakes served with lentil soup and chutneys",
        price: "100.00",
        category: "Idli",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 240, protein: 12, carbs: 48, fat: 2, fiber: 8, sodium: 420 },
        ingredients: ["rice", "urad dal", "toor dal", "vegetables", "tamarind"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["healthy", "light", "protein-rich"],
        isAvailable: true
      },
      {
        id: "si5",
        name: "Vada Sambar",
        description: "Crispy lentil donuts in spiced lentil soup",
        price: "90.00",
        category: "Vada",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 340, protein: 16, carbs: 45, fat: 12, fiber: 10, sodium: 520 },
        ingredients: ["urad dal", "toor dal", "vegetables", "green chili", "ginger"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["crispy", "protein-rich", "filling"],
        isAvailable: true
      },
      {
        id: "si6",
        name: "Uttapam",
        description: "Thick pancake topped with vegetables",
        price: "130.00",
        category: "Uttapam",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 320, protein: 12, carbs: 58, fat: 6, fiber: 6, sodium: 380 },
        ingredients: ["rice batter", "urad dal", "onion", "tomato", "green chili"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["thick", "vegetable-loaded", "nutritious"],
        isAvailable: true
      },
      {
        id: "si7",
        name: "Coconut Rice",
        description: "Fragrant rice tempered with coconut and curry leaves",
        price: "140.00",
        category: "Rice",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 380, protein: 8, carbs: 68, fat: 12, fiber: 4, sodium: 420 },
        ingredients: ["rice", "coconut", "mustard seeds", "curry leaves", "green chili"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["aromatic", "coconut-flavored", "light"],
        isAvailable: true
      },
      {
        id: "si8",
        name: "Lemon Rice",
        description: "Tangy rice with lemon juice and South Indian tempering",
        price: "120.00",
        category: "Rice",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 320, protein: 6, carbs: 64, fat: 6, fiber: 3, sodium: 380 },
        ingredients: ["rice", "lemon juice", "turmeric", "mustard seeds", "peanuts"],
        allergens: ["nuts"],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["tangy", "refreshing", "light"],
        isAvailable: true
      },
      {
        id: "si9",
        name: "Rasam Rice",
        description: "Tangy tomato soup served with steamed rice",
        price: "110.00",
        category: "Rice",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 280, protein: 8, carbs: 58, fat: 4, fiber: 6, sodium: 520 },
        ingredients: ["rice", "tomato", "tamarind", "rasam powder", "curry leaves"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["tangy", "comforting", "healthy"],
        isAvailable: true
      },
      {
        id: "si10",
        name: "Curd Rice",
        description: "Cooling rice mixed with yogurt and tempering",
        price: "100.00",
        category: "Rice",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 320, protein: 12, carbs: 52, fat: 8, fiber: 2, sodium: 420 },
        ingredients: ["rice", "curd", "mustard seeds", "green chili", "ginger"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["cooling", "digestive", "probiotic"],
        isAvailable: true
      },
      {
        id: "si11",
        name: "Sambar",
        description: "Traditional lentil soup with vegetables",
        price: "60.00",
        category: "Dal",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 120, protein: 8, carbs: 20, fat: 2, fiber: 8, sodium: 420 },
        ingredients: ["toor dal", "vegetables", "tamarind", "sambar powder", "curry leaves"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["protein-rich", "healthy", "traditional"],
        isAvailable: true
      },
      {
        id: "si12",
        name: "Coconut Chutney",
        description: "Fresh coconut chutney with curry leaves tempering",
        price: "30.00",
        category: "Chutney",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 80, protein: 2, carbs: 6, fat: 6, fiber: 2, sodium: 180 },
        ingredients: ["coconut", "green chili", "ginger", "curry leaves", "mustard seeds"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["fresh", "coconut-flavored", "cooling"],
        isAvailable: true
      },
      {
        id: "si13",
        name: "Tomato Chutney",
        description: "Spicy tomato chutney with South Indian spices",
        price: "30.00",
        category: "Chutney",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "hot",
        nutrition: { calories: 60, protein: 2, carbs: 12, fat: 2, fiber: 3, sodium: 220 },
        ingredients: ["tomato", "red chili", "garlic", "tamarind", "mustard seeds"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["spicy", "tangy", "flavorful"],
        isAvailable: true
      },
      {
        id: "si14",
        name: "Rava Idli",
        description: "Soft semolina steamed cakes with vegetables",
        price: "90.00",
        category: "Idli",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 280, protein: 10, carbs: 52, fat: 4, fiber: 5, sodium: 380 },
        ingredients: ["semolina", "cashews", "curry leaves", "mustard seeds", "vegetables"],
        allergens: ["nuts"],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["soft", "instant", "nutritious"],
        isAvailable: true
      },
      {
        id: "si15",
        name: "Pongal",
        description: "Savory rice and lentil porridge with pepper and ghee",
        price: "110.00",
        category: "Rice",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 340, protein: 12, carbs: 58, fat: 8, fiber: 6, sodium: 420 },
        ingredients: ["rice", "moong dal", "black pepper", "ghee", "ginger"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["comfort-food", "warming", "nutritious"],
        isAvailable: true
      },
      {
        id: "si16",
        name: "Upma",
        description: "Savory semolina porridge with vegetables",
        price: "80.00",
        category: "Breakfast",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 280, protein: 8, carbs: 52, fat: 6, fiber: 4, sodium: 380 },
        ingredients: ["semolina", "onion", "green chili", "mustard seeds", "curry leaves"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["breakfast", "filling", "healthy"],
        isAvailable: true
      },
      {
        id: "si17",
        name: "Poha",
        description: "Flattened rice with onions, curry leaves and spices",
        price: "70.00",
        category: "Breakfast",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 250, protein: 6, carbs: 48, fat: 4, fiber: 3, sodium: 320 },
        ingredients: ["flattened rice", "onion", "peanuts", "curry leaves", "turmeric"],
        allergens: ["nuts"],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["light", "quick", "nutritious"],
        isAvailable: true
      },
      {
        id: "si18",
        name: "Medu Vada",
        description: "Crispy donuts made from black gram lentils",
        price: "60.00",
        category: "Vada",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 180, protein: 8, carbs: 22, fat: 8, fiber: 5, sodium: 280 },
        ingredients: ["urad dal", "green chili", "ginger", "curry leaves", "black pepper"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["crispy", "protein-rich", "traditional"],
        isAvailable: true
      },
      {
        id: "si19",
        name: "Mysore Pak",
        description: "Traditional sweet made with gram flour and ghee",
        price: "120.00",
        category: "Sweet",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 420, protein: 8, carbs: 52, fat: 20, fiber: 3, sodium: 180 },
        ingredients: ["gram flour", "ghee", "sugar", "cardamom"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1596797038530-2c107229654b?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["sweet", "traditional", "festival"],
        isAvailable: true
      },
      {
        id: "si20",
        name: "Filter Coffee",
        description: "Traditional South Indian coffee with milk and sugar",
        price: "40.00",
        category: "Beverage",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 0, sodium: 60 },
        ingredients: ["coffee powder", "milk", "sugar"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["energizing", "traditional", "aromatic"],
        isAvailable: true
      },

      // Bengali Cuisine (20+ items)
      {
        id: "bg1",
        name: "Fish Curry",
        description: "Traditional Bengali fish curry with mustard oil",
        price: "240.00",
        category: "Curry",
        cuisine: "Bengali",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 380, protein: 32, carbs: 12, fat: 24, fiber: 3, sodium: 820 },
        ingredients: ["fish", "mustard oil", "turmeric", "green chili", "ginger"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["traditional", "omega-3-rich", "authentic"],
        isAvailable: true
      },
      {
        id: "bg2",
        name: "Aloo Posto",
        description: "Potatoes in poppy seed paste - Bengali specialty",
        price: "140.00",
        category: "Curry",
        cuisine: "Bengali",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 320, protein: 8, carbs: 48, fat: 12, fiber: 6, sodium: 480 },
        ingredients: ["potato", "poppy seeds", "mustard oil", "green chili", "nigella seeds"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["unique", "nutty", "traditional"],
        isAvailable: true
      },
      {
        id: "bg3",
        name: "Luchi Alur Dom",
        description: "Puffy bread with spiced potato curry",
        price: "120.00",
        category: "Combo",
        cuisine: "Bengali",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 450, protein: 10, carbs: 68, fat: 16, fiber: 5, sodium: 520 },
        ingredients: ["refined flour", "potato", "ghee", "cumin", "garam masala"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1574653789513-8285786aa96e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["comfort-food", "filling", "popular"],
        isAvailable: true
      },
      {
        id: "bg4",
        name: "Mishti Doi",
        description: "Sweet yogurt - Bengali dessert",
        price: "80.00",
        category: "Dessert",
        cuisine: "Bengali",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 180, protein: 8, carbs: 28, fat: 4, fiber: 0, sodium: 120 },
        ingredients: ["milk", "sugar", "yogurt culture", "cardamom"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["sweet", "cooling", "probiotic"],
        isAvailable: true
      },
      {
        id: "bg5",
        name: "Shorshe Ilish",
        description: "Hilsa fish in mustard sauce",
        price: "320.00",
        category: "Curry",
        cuisine: "Bengali",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "hot",
        nutrition: { calories: 420, protein: 38, carbs: 8, fat: 28, fiber: 2, sodium: 920 },
        ingredients: ["hilsa fish", "mustard seeds", "mustard oil", "green chili", "turmeric"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["chef-special", "premium", "spicy"],
        isAvailable: true
      },

      // Gujarati Cuisine (20+ items)
      {
        id: "gj1",
        name: "Gujarati Thali",
        description: "Complete Gujarati meal with dal, vegetables, roti, rice",
        price: "180.00",
        category: "Thali",
        cuisine: "Gujarati",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 650, protein: 24, carbs: 98, fat: 18, fiber: 16, sodium: 1020 },
        ingredients: ["dal", "vegetables", "roti", "rice", "pickles", "papad"],
        allergens: ["gluten", "dairy"],
        imageUrl: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["complete-meal", "sweet-salty", "traditional"],
        isAvailable: true
      },
      {
        id: "gj2",
        name: "Dhokla",
        description: "Steamed gram flour cake with mustard tempering",
        price: "60.00",
        category: "Snacks",
        cuisine: "Gujarati",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: { calories: 180, protein: 8, carbs: 32, fat: 3, fiber: 5, sodium: 420 },
        ingredients: ["gram flour", "ginger", "green chili", "mustard seeds", "curry leaves"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["healthy", "steamed", "protein-rich"],
        isAvailable: true
      },
      {
        id: "gj3",
        name: "Handvo",
        description: "Savory mixed lentil and vegetable cake",
        price: "90.00",
        category: "Snacks",
        cuisine: "Gujarati",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 280, protein: 12, carbs: 38, fat: 10, fiber: 8, sodium: 520 },
        ingredients: ["mixed lentils", "rice", "vegetables", "yogurt", "mustard seeds"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["nutritious", "filling", "traditional"],
        isAvailable: true
      },
      {
        id: "gj4",
        name: "Undhiyu",
        description: "Mixed vegetable curry with purple yam and beans",
        price: "160.00",
        category: "Curry",
        cuisine: "Gujarati",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 320, protein: 14, carbs: 52, fat: 8, fiber: 14, sodium: 680 },
        ingredients: ["purple yam", "beans", "eggplant", "coconut", "spices"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1585032226651-759b368d7246?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["festive", "nutritious", "colorful"],
        isAvailable: true
      },
      {
        id: "gj5",
        name: "Khandvi",
        description: "Rolled gram flour sheets with mustard tempering",
        price: "80.00",
        category: "Snacks",
        cuisine: "Gujarati",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 160, protein: 8, carbs: 24, fat: 4, fiber: 4, sodium: 380 },
        ingredients: ["gram flour", "yogurt", "ginger", "mustard seeds", "sesame seeds"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1589301773859-2d32b1e5f2fc?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["delicate", "light", "skill-based"],
        isAvailable: true
      },

      // Street Food (20+ items)
      {
        id: "sf1",
        name: "Pani Puri",
        description: "Crispy shells filled with spiced water and chutneys",
        price: "50.00",
        category: "Chaat",
        cuisine: "Street Food",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "hot",
        nutrition: { calories: 120, protein: 4, carbs: 24, fat: 2, fiber: 3, sodium: 580 },
        ingredients: ["semolina shells", "tamarind water", "mint chutney", "chickpeas", "potato"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["tangy", "crispy", "popular"],
        isAvailable: true
      },
      {
        id: "sf2",
        name: "Bhel Puri",
        description: "Puffed rice mix with chutneys and vegetables",
        price: "60.00",
        category: "Chaat",
        cuisine: "Street Food",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 180, protein: 6, carbs: 36, fat: 4, fiber: 5, sodium: 620 },
        ingredients: ["puffed rice", "sev", "onion", "tomato", "chutneys"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["crunchy", "tangy", "light"],
        isAvailable: true
      },
      {
        id: "sf3",
        name: "Vada Pav",
        description: "Spiced potato dumpling in bread with chutneys",
        price: "40.00",
        category: "Street Food",
        cuisine: "Street Food",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "hot",
        nutrition: { calories: 380, protein: 10, carbs: 58, fat: 14, fiber: 6, sodium: 820 },
        ingredients: ["potato", "gram flour", "bread", "green chutney", "garlic chutney"],
        allergens: ["gluten"],
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["mumbai-special", "filling", "spicy"],
        isAvailable: true
      },
      {
        id: "sf4",
        name: "Dahi Puri",
        description: "Crispy shells with yogurt, chutneys and spices",
        price: "70.00",
        category: "Chaat",
        cuisine: "Street Food",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: { calories: 220, protein: 8, carbs: 32, fat: 8, fiber: 4, sodium: 680 },
        ingredients: ["semolina shells", "yogurt", "chutneys", "sev", "pomegranate"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["cooling", "sweet-tangy", "colorful"],
        isAvailable: true
      },
      {
        id: "sf5",
        name: "Aloo Tikki",
        description: "Crispy potato patties with chutneys",
        price: "80.00",
        category: "Street Food",
        cuisine: "Street Food",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "medium",
        nutrition: { calories: 280, protein: 6, carbs: 42, fat: 10, fiber: 5, sodium: 520 },
        ingredients: ["potato", "spices", "onion", "mint chutney", "tamarind chutney"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1606491956689-2ea866880c84?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["crispy", "flavorful", "popular"],
        isAvailable: true
      },

      // Beverages & Desserts (20+ items)
      {
        id: "bd1",
        name: "Mango Lassi",
        description: "Creamy yogurt drink with fresh mango pulp",
        price: "80.00",
        category: "Beverage",
        cuisine: "Beverages & Desserts",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 180, protein: 6, carbs: 32, fat: 4, fiber: 2, sodium: 120 },
        ingredients: ["mango pulp", "yogurt", "sugar", "cardamom", "ice"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["refreshing", "creamy", "summer-special"],
        isAvailable: true
      },
      {
        id: "bd2",
        name: "Masala Chai",
        description: "Spiced Indian tea with milk and aromatic spices",
        price: "30.00",
        category: "Beverage",
        cuisine: "Beverages & Desserts",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "mild",
        nutrition: { calories: 80, protein: 3, carbs: 12, fat: 2, fiber: 0, sodium: 40 },
        ingredients: ["tea leaves", "milk", "ginger", "cardamom", "cloves"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["warming", "energizing", "traditional"],
        isAvailable: true
      },
      {
        id: "bd3",
        name: "Gulab Jamun",
        description: "Soft milk dumplings in sugar syrup",
        price: "100.00",
        category: "Dessert",
        cuisine: "Beverages & Desserts",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 320, protein: 6, carbs: 52, fat: 12, fiber: 1, sodium: 80 },
        ingredients: ["milk solids", "flour", "sugar syrup", "cardamom", "rose water"],
        allergens: ["dairy", "gluten"],
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["sweet", "festival", "soft"],
        isAvailable: true
      },
      {
        id: "bd4",
        name: "Fresh Lime Water",
        description: "Refreshing lime juice with mint and salt",
        price: "40.00",
        category: "Beverage",
        cuisine: "Beverages & Desserts",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "none",
        nutrition: { calories: 40, protein: 1, carbs: 10, fat: 0, fiber: 1, sodium: 220 },
        ingredients: ["lime juice", "mint", "salt", "black salt", "water"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["refreshing", "hydrating", "vitamin-c"],
        isAvailable: true
      },
      {
        id: "bd5",
        name: "Kulfi",
        description: "Traditional Indian ice cream with pistachios",
        price: "60.00",
        category: "Dessert",
        cuisine: "Beverages & Desserts",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "none",
        nutrition: { calories: 220, protein: 8, carbs: 28, fat: 10, fiber: 1, sodium: 120 },
        ingredients: ["milk", "sugar", "pistachios", "cardamom", "saffron"],
        allergens: ["dairy", "nuts"],
        imageUrl: "https://images.unsplash.com/photo-1571115764595-644a1f56a55c?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["cooling", "creamy", "traditional"],
        isAvailable: true
      }
    ];

    sampleMenuItems.forEach(item => this.menuItems.set(item.id, item));

    // Initialize truck locations
    const sampleLocations: TruckLocation[] = [
      {
        id: "loc1",
        name: "Tech Park - Sector 5",
        address: "Sector 5, IT Park, Mumbai",
        latitude: "19.0760",
        longitude: "72.8777",
        schedule: [
          { day: "Monday", startTime: "11:30", endTime: "14:30", isOpen: true },
          { day: "Tuesday", startTime: "11:30", endTime: "14:30", isOpen: true },
          { day: "Wednesday", startTime: "11:30", endTime: "14:30", isOpen: true },
          { day: "Thursday", startTime: "11:30", endTime: "14:30", isOpen: true },
          { day: "Friday", startTime: "11:30", endTime: "14:30", isOpen: true }
        ],
        currentStatus: "open",
        estimatedArrival: null,
        ordersToday: 24
      },
      {
        id: "loc2",
        name: "University Campus",
        address: "Main Campus, Mumbai University",
        latitude: "19.0176",
        longitude: "72.8562",
        schedule: [
          { day: "Monday", startTime: "15:00", endTime: "20:00", isOpen: true },
          { day: "Tuesday", startTime: "15:00", endTime: "20:00", isOpen: true },
          { day: "Wednesday", startTime: "15:00", endTime: "20:00", isOpen: true },
          { day: "Thursday", startTime: "15:00", endTime: "20:00", isOpen: true },
          { day: "Friday", startTime: "15:00", endTime: "20:00", isOpen: true }
        ],
        currentStatus: "coming",
        estimatedArrival: new Date(Date.now() + 45 * 60 * 1000),
        ordersToday: 18
      }
    ];

    sampleLocations.forEach(location => this.truckLocations.set(location.id, location));

    // Initialize membership plans
    const samplePlans: MembershipPlan[] = [
      {
        id: "plan1",
        name: "Student Saver Plan",
        description: "Perfect for college students",
        price: "2499.00",
        duration: 30,
        features: ["30 meals included", "Free delivery", "Student pricing", "Flexible schedule"],
        targetAudience: "students",
        isActive: true
      },
      {
        id: "plan2", 
        name: "IT Pro Plan",
        description: "Designed for professionals",
        price: "3999.00",
        duration: 30,
        features: ["Custom lunch packs", "Office delivery", "Healthy options", "Macro tracking"],
        targetAudience: "professionals",
        isActive: true
      },
      {
        id: "plan3",
        name: "Shark Club",
        description: "Premium membership",
        price: "199.00",
        duration: 30,
        features: ["Free delivery always", "Priority queue", "Exclusive dishes", "Special events"],
        targetAudience: "premium",
        isActive: true
      }
    ];

    samplePlans.forEach(plan => this.membershipPlans.set(plan.id, plan));

    // Initialize loyalty rewards
    const sampleRewards: LoyaltyReward[] = [
      {
        id: "reward1",
        name: "Free Healthy Drink",
        description: "Complimentary lemon detox water",
        pointsCost: 50,
        category: "beverages",
        tier: "bronze",
        isActive: true
      },
      {
        id: "reward2", 
        name: "Free Dessert",
        description: "Choice of traditional Indian dessert",
        pointsCost: 100,
        category: "desserts",
        tier: "silver",
        isActive: true
      },
      {
        id: "reward3",
        name: "Free Meal Coupon",
        description: "Any meal under ₹300 free",
        pointsCost: 250,
        category: "meals",
        tier: "gold",
        isActive: true
      }
    ];

    sampleRewards.forEach(reward => this.loyaltyRewards.set(reward.id, reward));
  }

  // User methods
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { 
      ...insertUser, 
      id, 
      loyaltyPoints: 0, 
      membershipTier: "bronze",
      createdAt: new Date()
    };
    this.users.set(id, user);
    return user;
  }

  async updateUserLoyaltyPoints(userId: string, points: number): Promise<User | undefined> {
    const user = this.users.get(userId);
    if (!user) return undefined;
    
    user.loyaltyPoints = (user.loyaltyPoints || 0) + points;
    
    // Update tier based on points
    if (user.loyaltyPoints >= 1000) user.membershipTier = "shark-elite";
    else if (user.loyaltyPoints >= 500) user.membershipTier = "gold";
    else if (user.loyaltyPoints >= 250) user.membershipTier = "silver";
    else user.membershipTier = "bronze";
    
    this.users.set(userId, user);
    return user;
  }

  // Menu methods
  async getAllMenuItems(): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(item => item.isAvailable);
  }

  async getMenuItemsByCategory(category: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.category.toLowerCase() === category.toLowerCase() && item.isAvailable
    );
  }

  async getMenuItemsByCuisine(cuisine: string): Promise<MenuItem[]> {
    return Array.from(this.menuItems.values()).filter(
      item => item.cuisine.toLowerCase() === cuisine.toLowerCase() && item.isAvailable
    );
  }

  async getMenuItem(id: string): Promise<MenuItem | undefined> {
    return this.menuItems.get(id);
  }

  async createMenuItem(insertItem: InsertMenuItem): Promise<MenuItem> {
    const id = randomUUID();
    const item: MenuItem = { 
      ...insertItem, 
      id,
      isVegetarian: insertItem.isVegetarian ?? false,
      isVegan: insertItem.isVegan ?? false,
      spiceLevel: insertItem.spiceLevel ?? "mild",
      isAvailable: insertItem.isAvailable ?? true
    };
    this.menuItems.set(id, item);
    return item;
  }

  // Order methods
  async createOrder(insertOrder: InsertOrder): Promise<Order> {
    const id = randomUUID();
    const loyaltyPointsEarned = Math.floor(parseFloat(insertOrder.total) / 10);
    const order: Order = { 
      ...insertOrder, 
      id, 
      loyaltyPointsEarned,
      createdAt: new Date(),
      status: insertOrder.status || "pending",
      surpriseGifts: insertOrder.surpriseGifts || []
    };
    this.orders.set(id, order);
    
    // Update user loyalty points if userId exists
    if (insertOrder.userId) {
      await this.updateUserLoyaltyPoints(insertOrder.userId, loyaltyPointsEarned);
    }
    
    return order;
  }

  async getOrder(id: string): Promise<Order | undefined> {
    return this.orders.get(id);
  }

  async getOrdersByUser(userId: string): Promise<Order[]> {
    return Array.from(this.orders.values()).filter(order => order.userId === userId);
  }

  async updateOrderStatus(orderId: string, status: string): Promise<Order | undefined> {
    const order = this.orders.get(orderId);
    if (!order) return undefined;
    
    order.status = status;
    this.orders.set(orderId, order);
    return order;
  }

  // Truck location methods
  async getAllTruckLocations(): Promise<TruckLocation[]> {
    return Array.from(this.truckLocations.values());
  }

  async getTruckLocation(id: string): Promise<TruckLocation | undefined> {
    return this.truckLocations.get(id);
  }

  async updateTruckStatus(locationId: string, status: string): Promise<TruckLocation | undefined> {
    const location = this.truckLocations.get(locationId);
    if (!location) return undefined;
    
    location.currentStatus = status;
    this.truckLocations.set(locationId, location);
    return location;
  }

  // Loyalty reward methods
  async getAllLoyaltyRewards(): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values()).filter(reward => reward.isActive);
  }

  async getLoyaltyRewardsByTier(tier: string): Promise<LoyaltyReward[]> {
    return Array.from(this.loyaltyRewards.values()).filter(
      reward => reward.tier.toLowerCase() === tier.toLowerCase() && reward.isActive
    );
  }

  // Membership plan methods
  async getAllMembershipPlans(): Promise<MembershipPlan[]> {
    return Array.from(this.membershipPlans.values()).filter(plan => plan.isActive);
  }

  async getMembershipPlan(id: string): Promise<MembershipPlan | undefined> {
    return this.membershipPlans.get(id);
  }
}

export const storage = new MemStorage();
