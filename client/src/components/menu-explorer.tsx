import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flame, Leaf, Carrot, Sprout, Mountain, Globe } from "lucide-react";
import FoodCard from "./food-card";
import type { MenuItem } from "@shared/schema";

const cuisineCategories = [
  { name: "North Indian", icon: Flame, color: "text-red-500" },
  { name: "South Indian", icon: Leaf, color: "text-green-500" },
  { name: "Punjabi", icon: Carrot, color: "text-orange-500" },
  { name: "Gujarati", icon: Sprout, color: "text-green-400" },
  { name: "Kashmiri", icon: Mountain, color: "text-blue-400" },
  { name: "International", icon: Globe, color: "text-purple-400" },
];

export default function MenuExplorer() {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);

  const { data: menuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: selectedCuisine ? ["/api/menu/cuisine", selectedCuisine] : ["/api/menu"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="menu" className="py-20" data-testid="menu-explorer">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16 fade-in"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="menu-title">
            Explore Our Cuisines
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="menu-subtitle">
            Authentic flavors from across the Indian subcontinent, prepared fresh and served fast
          </p>
        </motion.div>

        {/* Cuisine Categories */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-12"
          data-testid="cuisine-categories"
        >
          {cuisineCategories.map((category, index) => {
            const IconComponent = category.icon;
            const isSelected = selectedCuisine === category.name;
            
            return (
              <motion.div
                key={category.name}
                variants={itemVariants}
                className={`glass rounded-lg p-4 text-center hover:border-primary transition-all cursor-pointer ${
                  isSelected ? "border-primary neon-glow" : ""
                }`}
                onClick={() => setSelectedCuisine(isSelected ? null : category.name)}
                data-testid={`cuisine-category-${index}`}
              >
                <IconComponent className={`${category.color} text-2xl mb-2 mx-auto`} />
                <p className="font-semibold">{category.name}</p>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
            <p className="mt-4 text-muted-foreground">Loading delicious options...</p>
          </div>
        )}

        {/* Food Items Grid */}
        {!isLoading && (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            data-testid="food-items-grid"
          >
            {menuItems.map((item, index) => (
              <motion.div key={item.id} variants={itemVariants}>
                <FoodCard item={item} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && menuItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🍽️</div>
            <h3 className="text-xl font-semibold mb-2">No items found</h3>
            <p className="text-muted-foreground">
              {selectedCuisine
                ? `No ${selectedCuisine} dishes available right now. Try another cuisine!`
                : "Our chefs are preparing something special. Check back soon!"}
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
