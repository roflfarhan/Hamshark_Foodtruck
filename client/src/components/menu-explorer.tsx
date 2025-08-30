import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Flame, Leaf, Fish, Utensils, Wheat, Milk, Car, Coffee, Filter, Search, Award } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import FoodCard from "./food-card";
import type { MenuItem } from "@shared/schema";

const cuisineCategories = [
  { name: "North Indian", icon: Flame, color: "text-red-500" },
  { name: "South Indian", icon: Leaf, color: "text-green-500" },
  { name: "Bengali", icon: Fish, color: "text-blue-500" },
  { name: "Gujarati", icon: Utensils, color: "text-green-400" },
  { name: "Punjabi", icon: Wheat, color: "text-orange-500" },
  { name: "Maharashtrian", icon: Utensils, color: "text-purple-500" },
  { name: "Rajasthani", icon: Flame, color: "text-yellow-500" },
  { name: "Mughlai", icon: Utensils, color: "text-indigo-500" },
  { name: "Street Food", icon: Car, color: "text-pink-500" },
  { name: "Beverages & Desserts", icon: Coffee, color: "text-amber-500" },
];

const allergenFilters = [
  { name: "Nut-Free", icon: "🌰", key: "nuts" },
  { name: "Dairy-Free", icon: "🥛", key: "dairy" },
  { name: "Gluten-Free", icon: "🌾", key: "gluten" },
];

const dietaryFilters = [
  { name: "Vegetarian", icon: "🥗", key: "vegetarian" },
  { name: "Vegan", icon: "🌱", key: "vegan" },
  { name: "High Protein", icon: "💪", key: "high-protein" },
];

export default function MenuExplorer() {
  const [selectedCuisine, setSelectedCuisine] = useState<string | null>(null);
  const [selectedAllergenFilters, setSelectedAllergenFilters] = useState<string[]>([]);
  const [selectedDietaryFilters, setSelectedDietaryFilters] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const { data: allMenuItems = [], isLoading } = useQuery<MenuItem[]>({
    queryKey: selectedCuisine ? ["/api/menu/cuisine", selectedCuisine] : ["/api/menu"],
  });

  // Filter menu items based on selected filters and search
  const filteredMenuItems = allMenuItems.filter((item) => {
    // Search filter
    if (searchQuery && !item.name.toLowerCase().includes(searchQuery.toLowerCase()) && 
        !item.description.toLowerCase().includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Allergen filters
    if (selectedAllergenFilters.length > 0) {
      const hasAllergens = selectedAllergenFilters.some(allergen => 
        item.allergens?.includes(allergen)
      );
      if (hasAllergens) return false;
    }

    // Dietary filters
    if (selectedDietaryFilters.length > 0) {
      const meetsDietaryReqs = selectedDietaryFilters.every(filter => {
        switch (filter) {
          case "vegetarian":
            return item.isVegetarian;
          case "vegan":
            return item.isVegan;
          case "high-protein":
            return item.nutrition && item.nutrition.protein >= 25;
          default:
            return item.tags?.includes(filter);
        }
      });
      if (!meetsDietaryReqs) return false;
    }

    return true;
  });

  const toggleAllergenFilter = (allergen: string) => {
    setSelectedAllergenFilters(prev => 
      prev.includes(allergen) 
        ? prev.filter(a => a !== allergen)
        : [...prev, allergen]
    );
  };

  const toggleDietaryFilter = (filter: string) => {
    setSelectedDietaryFilters(prev => 
      prev.includes(filter) 
        ? prev.filter(f => f !== filter)
        : [...prev, filter]
    );
  };

  const clearAllFilters = () => {
    setSelectedCuisine(null);
    setSelectedAllergenFilters([]);
    setSelectedDietaryFilters([]);
    setSearchQuery("");
  };

  const chefSpecials = filteredMenuItems.filter(item => 
    item.tags?.includes("chef-special") || item.tags?.includes("chef's special")
  );

  const popularItems = filteredMenuItems.filter(item => 
    item.tags?.includes("popular")
  );

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

        {/* Search and Filters Section */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              type="text"
              placeholder="Search dishes, ingredients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 glass"
              data-testid="search-input"
            />
          </div>

          {/* Filter Toggle */}
          <div className="text-center">
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="glass"
              data-testid="filter-toggle"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters & Preferences
            </Button>
          </div>

          {/* Filters Panel */}
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="glass rounded-lg p-6 space-y-6"
              data-testid="filters-panel"
            >
              {/* Allergen Filters */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  🚫 Allergen-Free Options
                </h3>
                <div className="flex flex-wrap gap-2">
                  {allergenFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={selectedAllergenFilters.includes(filter.key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleAllergenFilter(filter.key)}
                      className={`${selectedAllergenFilters.includes(filter.key) ? "bg-green-600 hover:bg-green-700" : ""}`}
                      data-testid={`allergen-filter-${filter.key}`}
                    >
                      <span className="mr-1">{filter.icon}</span>
                      {filter.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Dietary Filters */}
              <div>
                <h3 className="text-lg font-semibold mb-3 flex items-center">
                  🥗 Dietary Preferences
                </h3>
                <div className="flex flex-wrap gap-2">
                  {dietaryFilters.map((filter) => (
                    <Button
                      key={filter.key}
                      variant={selectedDietaryFilters.includes(filter.key) ? "default" : "outline"}
                      size="sm"
                      onClick={() => toggleDietaryFilter(filter.key)}
                      className={`${selectedDietaryFilters.includes(filter.key) ? "bg-blue-600 hover:bg-blue-700" : ""}`}
                      data-testid={`dietary-filter-${filter.key}`}
                    >
                      <span className="mr-1">{filter.icon}</span>
                      {filter.name}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Active Filters Summary */}
              {(selectedCuisine || selectedAllergenFilters.length > 0 || selectedDietaryFilters.length > 0 || searchQuery) && (
                <div className="border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Active Filters:</h4>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={clearAllFilters}
                      data-testid="clear-filters"
                    >
                      Clear All
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {selectedCuisine && (
                      <Badge variant="secondary">{selectedCuisine}</Badge>
                    )}
                    {selectedAllergenFilters.map(filter => (
                      <Badge key={filter} variant="secondary">No {filter}</Badge>
                    ))}
                    {selectedDietaryFilters.map(filter => (
                      <Badge key={filter} variant="secondary">{filter}</Badge>
                    ))}
                    {searchQuery && (
                      <Badge variant="secondary">"{searchQuery}"</Badge>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* Chef's Specials Section */}
          {chefSpecials.length > 0 && (
            <div className="glass rounded-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Award className="mr-2 text-yellow-500" />
                Chef's Recommendations
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chefSpecials.slice(0, 3).map((item: MenuItem) => (
                  <div key={item.id} className="bg-gradient-to-r from-yellow-500/10 to-orange-500/10 rounded-lg p-4 border border-yellow-500/20">
                    <h4 className="font-semibold text-yellow-400">{item.name}</h4>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                      <span className="font-bold text-lg">₹{item.price}</span>
                      <Badge className="bg-yellow-500 text-black">Chef's Choice</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Results Summary */}
          <div className="text-center text-muted-foreground">
            Showing {filteredMenuItems.length} of {allMenuItems.length} dishes
          </div>
        </div>

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
            {filteredMenuItems.map((item: MenuItem, index: number) => (
              <motion.div key={item.id} variants={itemVariants}>
                <FoodCard item={item} index={index} />
              </motion.div>
            ))}
          </motion.div>
        )}

        {/* Empty State */}
        {!isLoading && filteredMenuItems.length === 0 && (
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
