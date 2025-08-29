import { motion } from "framer-motion";
import { Star } from "lucide-react";

const testimonials = [
  {
    name: "Rahul Singh",
    role: "Computer Science Student",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    rating: 5,
    text: "The Student Saver Plan is a lifesaver! Fresh, homely food at affordable prices. The truck arrives right on time at our campus.",
  },
  {
    name: "Priya Patel",
    role: "Software Engineer",
    avatar: "https://pixabay.com/get/g40b17921d961e6e44fcb48eb83e95ff2ef539060ecc8d4537908aeb0177e19ab48603974f183da2a439dd679e660431c303ff35124566d5d456887b2e79f11b6_1280.jpg",
    rating: 5,
    text: "Love the macro tracking feature! As someone conscious about nutrition, Hamshark makes it easy to maintain a healthy diet.",
  },
  {
    name: "Amit Kumar",
    role: "Family Plan User",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=60&h=60",
    rating: 5,
    text: "Perfect for our office team lunches. The variety of cuisines and the cleanliness standards are impressive. Highly recommended!",
  },
];

export default function Testimonials() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section className="py-20" data-testid="testimonials">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="testimonials-title">
            What Our Customers Say
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="testimonials-subtitle">
            Real reviews from students, professionals, and food lovers
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="testimonials-grid"
        >
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="glass-dark rounded-lg p-6 transition-all duration-300"
              data-testid={`testimonial-${index}`}
            >
              {/* Customer Info */}
              <div className="flex items-center mb-4">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full mr-3 object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = `https://via.placeholder.com/48/1a1a1a/FFD300?text=${testimonial.name.split(' ').map(n => n[0]).join('')}`;
                  }}
                />
                <div>
                  <h4 className="font-semibold" data-testid={`testimonial-name-${index}`}>
                    {testimonial.name}
                  </h4>
                  <p className="text-sm text-muted-foreground" data-testid={`testimonial-role-${index}`}>
                    {testimonial.role}
                  </p>
                </div>
              </div>

              {/* Rating */}
              <div className="flex text-primary mb-3" data-testid={`testimonial-rating-${index}`}>
                {[...Array(testimonial.rating)].map((_, starIndex) => (
                  <Star key={starIndex} className="h-4 w-4 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-muted-foreground" data-testid={`testimonial-text-${index}`}>
                "{testimonial.text}"
              </p>
            </motion.div>
          ))}
        </motion.div>

        {/* Customer Statistics */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16"
        >
          <div className="glass-dark rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="text-3xl font-bold text-primary mb-2"
                  data-testid="stat-customers"
                >
                  50,000+
                </motion.div>
                <div className="text-muted-foreground">Happy Customers</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.4, type: "spring" }}
                  className="text-3xl font-bold text-primary mb-2"
                  data-testid="stat-orders"
                >
                  200,000+
                </motion.div>
                <div className="text-muted-foreground">Orders Delivered</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.6, type: "spring" }}
                  className="text-3xl font-bold text-primary mb-2"
                  data-testid="stat-rating"
                >
                  4.8/5
                </motion.div>
                <div className="text-muted-foreground">Average Rating</div>
              </div>
              <div>
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.8, type: "spring" }}
                  className="text-3xl font-bold text-primary mb-2"
                  data-testid="stat-cities"
                >
                  15+
                </motion.div>
                <div className="text-muted-foreground">Cities Served</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
