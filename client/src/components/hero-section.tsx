import { motion } from "framer-motion";
import { MapPin, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSection() {
  return (
    <section className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 opacity-10">
        <img
          src="https://pixabay.com/get/g19907fc06f4708366142cb7dc4df3928840263ccccd9abf0933034030c090c790dc7e6c657bc9ec4c0f725191147a753730b85bab14f8afa1fcb552f3f6f19c0_1280.jpg"
          alt="Street food scene"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="slide-in"
          data-testid="hero-content"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 260, damping: 20 }}
            className="mb-8"
          >
            <div className="text-8xl pulse-glow mb-4" data-testid="hero-truck-icon">
              🚚
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-5xl md:text-7xl font-bold mb-6 gradient-text"
            data-testid="hero-title"
          >
            Clean Food, Served Fast
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-3xl mx-auto"
            data-testid="hero-description"
          >
            Hamshark combines multi-cuisine offerings with convenience and personalization.
            From authentic Indian flavors to healthy options - delivered fresh from our food trucks.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Button
              size="lg"
              className="ripple text-lg px-8 py-4 bounce-click"
              data-testid="button-find-truck"
            >
              <MapPin className="mr-2 h-5 w-5" />
              Find a Truck Near You
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="glass border-primary text-primary hover:bg-primary hover:text-primary-foreground text-lg px-8 py-4"
              data-testid="button-watch-story"
            >
              <Play className="mr-2 h-5 w-5" />
              Watch Our Story
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
