import { motion } from "framer-motion";
import { Heart, Leaf, Users } from "lucide-react";

const csrInitiatives = [
  {
    icon: Heart,
    title: "Food Donation",
    description: "Leftover meals are donated to local NGOs and shelters, ensuring no food goes to waste.",
    stat: "2,500+ meals donated",
    color: "text-red-400",
  },
  {
    icon: Leaf,
    title: "Eco-Friendly",
    description: "All packaging is biodegradable. Customers bringing own containers earn eco-points.",
    stat: "100% biodegradable",
    color: "text-green-500",
  },
  {
    icon: Users,
    title: "Local Community",
    description: "Supporting local farmers and suppliers, creating employment opportunities in the community.",
    stat: "50+ local partners",
    color: "text-blue-400",
  },
];

export default function CSRSection() {
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
    <section className="py-20 bg-secondary" data-testid="csr-section">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="csr-title">
            Hamshark Care
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="csr-subtitle">
            Our commitment to the community and environment
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
          data-testid="csr-initiatives"
        >
          {csrInitiatives.map((initiative, index) => {
            const IconComponent = initiative.icon;
            
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className="glass rounded-lg p-6 text-center transition-all duration-300"
                data-testid={`csr-initiative-${index}`}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + index * 0.1, type: "spring" }}
                  className="mb-4"
                >
                  <IconComponent className={`${initiative.color} text-4xl mx-auto`} />
                </motion.div>
                
                <h3 className="text-xl font-bold mb-4" data-testid={`csr-title-${index}`}>
                  {initiative.title}
                </h3>
                
                <p className="text-muted-foreground mb-4" data-testid={`csr-description-${index}`}>
                  {initiative.description}
                </p>
                
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  className={`text-2xl font-bold ${initiative.color}`}
                  data-testid={`csr-stat-${index}`}
                >
                  {initiative.stat}
                </motion.div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional CSR Information */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-dark rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">Join Our Mission</h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Every meal you order contributes to a positive impact. From supporting local farmers 
              to feeding those in need, your choice makes a difference in building a sustainable 
              and caring community.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
              <div className="text-center">
                <div className="text-2xl mb-2">🌱</div>
                <div className="font-semibold mb-1">Carbon Neutral Delivery</div>
                <div className="text-muted-foreground">Electric vehicles for all deliveries</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">♻️</div>
                <div className="font-semibold mb-1">Zero Waste Kitchen</div>
                <div className="text-muted-foreground">Composting and recycling programs</div>
              </div>
              <div className="text-center">
                <div className="text-2xl mb-2">🎓</div>
                <div className="font-semibold mb-1">Student Support</div>
                <div className="text-muted-foreground">Scholarships for underprivileged students</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
