import { Variants } from "framer-motion";

// Common animation variants for consistent motion design
export const fadeInUp: Variants = {
  hidden: {
    opacity: 0,
    y: 30,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeInLeft: Variants = {
  hidden: {
    opacity: 0,
    x: -50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const fadeInRight: Variants = {
  hidden: {
    opacity: 0,
    x: 50,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export const scaleIn: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
  },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

export const slideInFromBottom: Variants = {
  hidden: {
    opacity: 0,
    y: 100,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

export const staggerContainer: Variants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

export const staggerItem: Variants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

// Food card specific animations
export const foodCardHover: Variants = {
  rest: {
    scale: 1,
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  hover: {
    scale: 1.02,
    y: -5,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
};

// Button click animation
export const buttonClick: Variants = {
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// Loading spinner animation
export const spinnerRotate: Variants = {
  animate: {
    rotate: 360,
    transition: {
      duration: 1,
      repeat: Infinity,
      ease: "linear",
    },
  },
};

// Progress bar animation
export const progressBar: Variants = {
  hidden: {
    width: "0%",
  },
  visible: (width: number) => ({
    width: `${width}%`,
    transition: {
      duration: 2,
      ease: "easeOut",
    },
  }),
};

// Pulse glow animation for special elements
export const pulseGlow: Variants = {
  animate: {
    boxShadow: [
      "0 0 10px rgba(255, 211, 0, 0.3)",
      "0 0 30px rgba(255, 211, 0, 0.6)",
      "0 0 10px rgba(255, 211, 0, 0.3)",
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
    },
  },
};

// Truck movement animation
export const truckSlideIn: Variants = {
  hidden: {
    x: -100,
    opacity: 0,
  },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: "easeOut",
    },
  },
};

// Loyalty points counter animation
export const countUp: Variants = {
  hidden: {
    scale: 0,
  },
  visible: {
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.5,
    },
  },
};

// Gift unlock animation
export const giftUnlock: Variants = {
  hidden: {
    scale: 0,
    rotate: -180,
    opacity: 0,
  },
  visible: {
    scale: 1,
    rotate: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 1,
    },
  },
};

// Ripple effect animation for buttons
export const rippleEffect: Variants = {
  hidden: {
    scale: 0,
    opacity: 0.5,
  },
  visible: {
    scale: 4,
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Navigation menu slide down
export const menuSlideDown: Variants = {
  hidden: {
    opacity: 0,
    height: 0,
    y: -20,
  },
  visible: {
    opacity: 1,
    height: "auto",
    y: 0,
    transition: {
      duration: 0.3,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    height: 0,
    y: -20,
    transition: {
      duration: 0.2,
      ease: "easeIn",
    },
  },
};

// Testimonial card animation
export const testimonialCard: Variants = {
  hidden: {
    opacity: 0,
    y: 50,
    rotateX: -15,
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

// Utility function to create custom spring animations
export const createSpringAnimation = (
  stiffness: number = 260,
  damping: number = 20,
  delay: number = 0
) => ({
  type: "spring",
  stiffness,
  damping,
  delay,
});

// Utility function to create custom ease animations
export const createEaseAnimation = (
  duration: number = 0.5,
  ease: string = "easeOut",
  delay: number = 0
) => ({
  duration,
  ease,
  delay,
});

// Page transition animations
export const pageTransition: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.3,
      ease: "easeIn",
    },
  },
};

// Confetti animation for celebrations
export const confettiPiece: Variants = {
  animate: {
    y: [0, -100, 100],
    x: [0, Math.random() * 200 - 100, Math.random() * 400 - 200],
    rotate: [0, 360, 720],
    opacity: [1, 1, 0],
    transition: {
      duration: 3,
      ease: "easeOut",
    },
  },
};

// Macro tracking progress bar with smooth fill
export const macroProgressBar: Variants = {
  hidden: {
    width: "0%",
    opacity: 0,
  },
  visible: (progress: number) => ({
    width: `${progress}%`,
    opacity: 1,
    transition: {
      width: {
        duration: 1.5,
        ease: "easeOut",
        delay: 0.5,
      },
      opacity: {
        duration: 0.3,
      },
    },
  }),
};
