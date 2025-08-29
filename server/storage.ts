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
    // Initialize sample menu items
    const sampleMenuItems: MenuItem[] = [
      {
        id: "1",
        name: "Paneer Tikka Wrap",
        description: "Grilled paneer with fresh vegetables and mint chutney",
        price: "180.00",
        category: "Wraps",
        cuisine: "North Indian",
        isVegetarian: true,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: {
          calories: 420,
          protein: 28,
          carbs: 32,
          fat: 18,
          fiber: 8,
          sodium: 680
        },
        ingredients: ["paneer", "bell peppers", "onions", "mint chutney", "whole wheat wrap"],
        allergens: ["dairy", "gluten"],
        imageUrl: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["high-protein", "spicy", "vegetarian"],
        isAvailable: true
      },
      {
        id: "2", 
        name: "Brown Rice Veggie Biryani",
        description: "Aromatic brown rice with mixed vegetables and spices",
        price: "220.00",
        category: "Rice",
        cuisine: "Hyderabadi",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: {
          calories: 510,
          protein: 18,
          carbs: 72,
          fat: 14,
          fiber: 12,
          sodium: 520
        },
        ingredients: ["brown rice", "mixed vegetables", "biryani spices", "saffron"],
        allergens: [],
        imageUrl: "https://pixabay.com/get/g7cc1e9a6f9f4a5b701c5a79ad611fbaeccebc568faa8e18add0e5ae70a9bbf916d8d6316ef7b0f290b4525e0e31c80b88b0a17445f441b0397b0306cfa276244_1280.jpg",
        tags: ["healthy", "chef-special", "vegan"],
        isAvailable: true
      },
      {
        id: "3",
        name: "Masala Dosa",
        description: "Crispy dosa with spiced potato filling and chutney",
        price: "150.00",
        category: "South Indian",
        cuisine: "South Indian",
        isVegetarian: true,
        isVegan: true,
        spiceLevel: "mild",
        nutrition: {
          calories: 380,
          protein: 12,
          carbs: 68,
          fat: 8,
          fiber: 6,
          sodium: 420
        },
        ingredients: ["rice batter", "urad dal", "potato", "spices", "coconut chutney"],
        allergens: [],
        imageUrl: "https://images.unsplash.com/photo-1630383249896-424e482df921?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["student-combo", "traditional", "gluten-free"],
        isAvailable: true
      },
      {
        id: "4",
        name: "Butter Chicken",
        description: "Rich tomato-based curry with tender chicken pieces",
        price: "280.00",
        category: "Curry",
        cuisine: "North Indian",
        isVegetarian: false,
        isVegan: false,
        spiceLevel: "medium",
        nutrition: {
          calories: 520,
          protein: 35,
          carbs: 15,
          fat: 24,
          fiber: 3,
          sodium: 890
        },
        ingredients: ["chicken", "tomato sauce", "cream", "butter", "spices"],
        allergens: ["dairy"],
        imageUrl: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300",
        tags: ["popular", "high-protein", "non-vegetarian"],
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
    const item: MenuItem = { ...insertItem, id };
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
      createdAt: new Date()
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
