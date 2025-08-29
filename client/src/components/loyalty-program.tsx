import { motion } from "framer-motion";
import { Star, Crown, Trophy, Diamond } from "lucide-react";

const membershipTiers = [
  {
    name: "Bronze",
    icon: "🥉",
    description: "Entry Level",
    features: ["1 HamCoin per ₹10", "Basic rewards", "Order tracking"],
    borderColor: "border-orange-600",
    color: "text-orange-600",
  },
  {
    name: "Silver",
    icon: "🥈",
    description: "500+ HamCoins",
    features: ["1.5 HamCoins per ₹10", "Priority support", "Early access"],
    borderColor: "border-gray-400",
    color: "text-gray-400",
  },
  {
    name: "Gold",
    icon: "🥇",
    description: "1000+ HamCoins",
    features: ["2 HamCoins per ₹10", "Free birthday meal", "Priority service"],
    borderColor: "border-yellow-500",
    color: "text-yellow-500",
    glow: true,
  },
  {
    name: "Shark Elite",
    icon: "💎",
    description: "Invite Only",
    features: ["3 HamCoins per ₹10", "Exclusive menu", "VIP treatment"],
    borderColor: "border-primary",
    color: "text-primary",
  },
];

export default function LoyaltyProgram() {
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
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <section id="loyalty" className="py-20 bg-secondary" data-testid="loyalty-program">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="loyalty-title">
            HamCoins Loyalty Program
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="loyalty-subtitle">
            Earn points with every order and unlock exclusive rewards
          </p>
        </motion.div>

        {/* Membership Tiers */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
          data-testid="membership-tiers"
        >
          {membershipTiers.map((tier, index) => (
            <motion.div
              key={tier.name}
              variants={itemVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              className={`glass rounded-lg p-6 text-center border-2 ${tier.borderColor} ${
                tier.glow ? "neon-glow" : ""
              } transition-all duration-300`}
              data-testid={`tier-${tier.name.toLowerCase()}`}
            >
              <div className="text-4xl mb-4">{tier.icon}</div>
              <h3 className={`text-xl font-bold mb-2 ${tier.color}`}>{tier.name}</h3>
              <p className="text-muted-foreground text-sm mb-4">{tier.description}</p>
              <ul className="text-sm space-y-2">
                {tier.features.map((feature, featureIndex) => (
                  <li key={featureIndex} data-testid={`tier-${tier.name.toLowerCase()}-feature-${featureIndex}`}>
                    • {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </motion.div>

        {/* Rewards Examples */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          data-testid="reward-examples"
        >
          <div className="glass-dark rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🥤</div>
            <h3 className="text-lg font-bold mb-2">Free Drinks</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Earn a free healthy drink after every 10 meals
            </p>
            <div className="text-primary font-bold">10 meals milestone</div>
          </div>

          <div className="glass-dark rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🍰</div>
            <h3 className="text-lg font-bold mb-2">Free Desserts</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Unlock delicious desserts after 20 meals
            </p>
            <div className="text-primary font-bold">20 meals milestone</div>
          </div>

          <div className="glass-dark rounded-lg p-6 text-center">
            <div className="text-4xl mb-4">🎁</div>
            <h3 className="text-lg font-bold mb-2">Surprise Gifts</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Special rewards based on your order value
            </p>
            <div className="text-primary font-bold">₹200+ orders</div>
          </div>
        </motion.div>

        {/* Gamification Elements */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 text-center"
        >
          <div className="glass-dark rounded-lg p-8 max-w-2xl mx-auto">
            <h3 className="text-2xl font-bold mb-4 flex items-center justify-center">
              <Star className="mr-2 h-6 w-6 text-primary" />
              Spin the Wheel Daily!
            </h3>
            <p className="text-muted-foreground mb-6">
              Login daily to spin our reward wheel and win instant discounts, free meals, 
              and surprise gifts. Build your streak for even better rewards!
            </p>
            <div className="flex items-center justify-center space-x-8 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🎯</div>
                <div>Daily Spins</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🔥</div>
                <div>Streak Rewards</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-primary">🏆</div>
                <div>Leaderboard</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
