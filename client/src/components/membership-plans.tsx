import { useQuery } from "@tanstack/react-query";
import { motion } from "framer-motion";
import { GraduationCap, Laptop, Crown, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MembershipPlan } from "@shared/schema";

const planIcons = {
  students: GraduationCap,
  professionals: Laptop,
  premium: Crown,
};

const planColors = {
  students: "text-blue-400",
  professionals: "text-primary border-primary",
  premium: "text-yellow-400",
};

export default function MembershipPlans() {
  const { data: plans = [], isLoading } = useQuery<MembershipPlan[]>({
    queryKey: ["/api/membership-plans"],
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 },
  };

  if (isLoading) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <div className="h-8 bg-muted rounded w-64 mx-auto mb-4"></div>
            <div className="h-4 bg-muted rounded w-96 mx-auto"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="glass-dark rounded-lg p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4"></div>
                <div className="h-4 bg-muted rounded mb-4"></div>
                <div className="h-8 bg-muted rounded mb-4"></div>
                <div className="space-y-2 mb-6">
                  {[1, 2, 3, 4].map((j) => (
                    <div key={j} className="h-3 bg-muted rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-muted rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20" data-testid="membership-plans">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold gradient-text mb-4" data-testid="plans-title">
            Choose Your Plan
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto" data-testid="plans-subtitle">
            Flexible membership options designed for your lifestyle and dining needs
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          data-testid="plans-grid"
        >
          {plans.map((plan, index) => {
            const IconComponent = planIcons[plan.targetAudience as keyof typeof planIcons] || Laptop;
            const colorClass = planColors[plan.targetAudience as keyof typeof planColors] || "text-primary";
            const isPopular = plan.targetAudience === "professionals";

            return (
              <motion.div
                key={plan.id}
                variants={itemVariants}
                whileHover={{ y: -5, scale: 1.02 }}
                className={`glass-dark rounded-lg p-6 transition-all duration-300 ${
                  isPopular ? "border-2 border-primary" : ""
                }`}
                data-testid={`plan-${index}`}
              >
                {isPopular && (
                  <div className="bg-primary text-primary-foreground text-sm font-semibold px-3 py-1 rounded-full text-center mb-4">
                    Most Popular
                  </div>
                )}

                <div className="flex items-center mb-4">
                  <IconComponent className={`${colorClass.split(' ')[0]} text-2xl mr-3`} />
                  <h3 className="text-xl font-bold" data-testid={`plan-name-${index}`}>
                    {plan.name}
                  </h3>
                </div>

                <p className="text-muted-foreground mb-4" data-testid={`plan-description-${index}`}>
                  {plan.description}
                </p>

                <div className="text-2xl font-bold text-primary mb-4" data-testid={`plan-price-${index}`}>
                  ₹{plan.price}/{plan.duration === 30 ? "month" : `${plan.duration} days`}
                </div>

                <ul className="space-y-2 text-sm mb-6">
                  {plan.features?.map((feature, featureIndex) => (
                    <li 
                      key={featureIndex} 
                      className="flex items-center"
                      data-testid={`plan-feature-${index}-${featureIndex}`}
                    >
                      <Check className="text-green-500 mr-2 h-4 w-4 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>

                <Button
                  className={`w-full ${
                    isPopular
                      ? "bg-primary text-primary-foreground"
                      : plan.targetAudience === "students"
                      ? "bg-blue-500 hover:bg-blue-600"
                      : "bg-yellow-500 hover:bg-yellow-600 text-black"
                  }`}
                  data-testid={`button-choose-plan-${index}`}
                >
                  {isPopular ? "Most Popular" : "Choose Plan"}
                </Button>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Additional Benefits */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <div className="glass-dark rounded-lg p-8 max-w-4xl mx-auto">
            <h3 className="text-2xl font-bold mb-6">All Plans Include</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl mb-2">📱</div>
                <h4 className="font-semibold mb-2">Mobile App Access</h4>
                <p className="text-sm text-muted-foreground">
                  Track orders, earn rewards, and manage your account
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="font-semibold mb-2">Loyalty Rewards</h4>
                <p className="text-sm text-muted-foreground">
                  Earn HamCoins with every order and unlock exclusive benefits
                </p>
              </div>
              <div className="text-center">
                <div className="text-3xl mb-2">🤝</div>
                <h4 className="font-semibold mb-2">24/7 Support</h4>
                <p className="text-sm text-muted-foreground">
                  Get help whenever you need it with our dedicated support team
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
