import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMenuItemSchema, 
  insertOrderSchema, 
  insertTruckLocationSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Menu routes
  app.get("/api/menu", async (req, res) => {
    try {
      const menuItems = await storage.getAllMenuItems();
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items" });
    }
  });

  app.get("/api/menu/category/:category", async (req, res) => {
    try {
      const { category } = req.params;
      const menuItems = await storage.getMenuItemsByCategory(category);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by category" });
    }
  });

  app.get("/api/menu/cuisine/:cuisine", async (req, res) => {
    try {
      const { cuisine } = req.params;
      const menuItems = await storage.getMenuItemsByCuisine(cuisine);
      res.json(menuItems);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu items by cuisine" });
    }
  });

  app.get("/api/menu/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const menuItem = await storage.getMenuItem(id);
      if (!menuItem) {
        return res.status(404).json({ message: "Menu item not found" });
      }
      res.json(menuItem);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch menu item" });
    }
  });

  // Order routes
  app.post("/api/orders", async (req, res) => {
    try {
      const validatedOrder = insertOrderSchema.parse(req.body);
      const order = await storage.createOrder(validatedOrder);
      res.status(201).json(order);
    } catch (error) {
      res.status(400).json({ message: "Invalid order data", error });
    }
  });

  app.get("/api/orders/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch order" });
    }
  });

  app.patch("/api/orders/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const order = await storage.updateOrderStatus(id, status);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }
      res.json(order);
    } catch (error) {
      res.status(500).json({ message: "Failed to update order status" });
    }
  });

  // Truck location routes
  app.get("/api/trucks", async (req, res) => {
    try {
      const locations = await storage.getAllTruckLocations();
      res.json(locations);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch truck locations" });
    }
  });

  app.get("/api/trucks/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const location = await storage.getTruckLocation(id);
      if (!location) {
        return res.status(404).json({ message: "Truck location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch truck location" });
    }
  });

  app.patch("/api/trucks/:id/status", async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      const location = await storage.updateTruckStatus(id, status);
      if (!location) {
        return res.status(404).json({ message: "Truck location not found" });
      }
      res.json(location);
    } catch (error) {
      res.status(500).json({ message: "Failed to update truck status" });
    }
  });

  // Membership plans routes
  app.get("/api/membership-plans", async (req, res) => {
    try {
      const plans = await storage.getAllMembershipPlans();
      res.json(plans);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership plans" });
    }
  });

  app.get("/api/membership-plans/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const plan = await storage.getMembershipPlan(id);
      if (!plan) {
        return res.status(404).json({ message: "Membership plan not found" });
      }
      res.json(plan);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch membership plan" });
    }
  });

  // Loyalty rewards routes
  app.get("/api/loyalty-rewards", async (req, res) => {
    try {
      const rewards = await storage.getAllLoyaltyRewards();
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty rewards" });
    }
  });

  app.get("/api/loyalty-rewards/tier/:tier", async (req, res) => {
    try {
      const { tier } = req.params;
      const rewards = await storage.getLoyaltyRewardsByTier(tier);
      res.json(rewards);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch loyalty rewards by tier" });
    }
  });

  // HealthifyMe integration mock endpoint
  app.post("/api/healthifyme/log-meal", async (req, res) => {
    try {
      const { orderId, mealType = "lunch" } = req.body;
      const order = await storage.getOrder(orderId);
      
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Mock HealthifyMe integration response
      res.json({
        success: true,
        message: "Meal logged successfully to HealthifyMe",
        mealType,
        totalCalories: order.items?.reduce((total, item) => {
          // This would normally fetch nutrition data from menu items
          return total + 400; // Mock calories per item
        }, 0) || 0
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to log meal to HealthifyMe" });
    }
  });

  // Receipt sharing mock endpoint
  app.post("/api/orders/:id/share", async (req, res) => {
    try {
      const { id } = req.params;
      const { method } = req.body; // 'whatsapp' or 'email'
      
      const order = await storage.getOrder(id);
      if (!order) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Mock sharing response
      res.json({
        success: true,
        message: `Receipt shared via ${method}`,
        shareUrl: `https://hamshark.com/receipt/${id}`
      });
    } catch (error) {
      res.status(500).json({ message: "Failed to share receipt" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
