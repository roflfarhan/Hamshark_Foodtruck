import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { Truck, Clock, Users, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { TruckLocation } from "@shared/schema";

export default function TruckLocator() {
  const { data: locations = [], isLoading } = useQuery<TruckLocation[]>({
    queryKey: ["/api/trucks"],
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "bg-green-500";
      case "coming":
        return "bg-yellow-500 text-black";
      case "closed":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  const getStatusText = (status: string) => {
    switch (status.toLowerCase()) {
      case "open":
        return "Open";
      case "coming":
        return "Coming";
      case "closed":
        return "Closed";
      default:
        return "Unknown";
    }
  };

  return (
    <section id="locator" className="py-20 bg-secondary" data-testid="truck-locator">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="locator-title">
            Find Our Trucks
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="locator-subtitle">
            Track our food trucks in real-time and never miss your favorite meal
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Placeholder */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-2"
          >
            <div className="glass rounded-lg p-6 h-96 relative overflow-hidden" data-testid="truck-map">
              <img
                src="https://images.unsplash.com/photo-1524661135-423995f22d0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=400"
                alt="Food truck location map"
                className="w-full h-full object-cover rounded-lg"
              />
              <div className="absolute top-8 left-8 bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-semibold pulse-glow">
                <Truck className="inline mr-1 h-4 w-4" />
                Truck #1 - Live
              </div>
              <div className="absolute top-20 right-12 bg-secondary text-white px-3 py-1 rounded-full text-sm">
                <Clock className="inline mr-1 h-4 w-4" />
                Arrives in 15 min
              </div>
            </div>
          </motion.div>

          {/* Truck Schedule */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-2xl font-bold mb-4" data-testid="schedule-title">Today's Schedule</h3>

            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="glass rounded-lg p-4 animate-pulse">
                    <div className="h-4 bg-muted rounded mb-2"></div>
                    <div className="h-3 bg-muted rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-muted rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : (
              locations.map((location, index) => (
                <motion.div
                  key={location.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="glass rounded-lg p-4"
                  data-testid={`truck-location-${index}`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold" data-testid={`location-name-${index}`}>
                      {location.name}
                    </h4>
                    <Badge className={getStatusColor(location.currentStatus || "closed")}>
                      {getStatusText(location.currentStatus || "closed")}
                    </Badge>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-2" data-testid={`location-address-${index}`}>
                    {location.address}
                  </p>
                  
                  {location.currentStatus === "open" && (
                    <div className="flex items-center text-primary text-sm">
                      <Users className="mr-2 h-4 w-4" />
                      <span data-testid={`location-orders-${index}`}>
                        {location.ordersToday} orders today
                      </span>
                    </div>
                  )}
                  
                  {location.currentStatus === "coming" && location.estimatedArrival && (
                    <div className="flex items-center text-primary text-sm">
                      <Clock className="mr-2 h-4 w-4" />
                      <span data-testid={`location-arrival-${index}`}>
                        Arrives in 45 minutes
                      </span>
                    </div>
                  )}
                  
                  {location.currentStatus === "closed" && (
                    <div className="flex items-center text-muted-foreground text-sm">
                      <Clock className="mr-2 h-4 w-4" />
                      <span>Opens tomorrow</span>
                    </div>
                  )}
                </motion.div>
              ))
            )}

            <Button className="w-full" data-testid="button-notify-when-near">
              <MapPin className="mr-2 h-4 w-4" />
              Notify When Near
            </Button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
