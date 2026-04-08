import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "framer-motion";

export function Card({ className, children, animate = true, hover = false }) {
  const CardComponent = animate ? motion.div : "div";
  
  const classes = twMerge(
    "glass rounded-2xl p-6 shadow-xl",
    hover && "hover:border-white/20 hover:bg-white/[0.08] transition-all duration-300 transform hover:-translate-y-1",
    className
  );

  return (
    <CardComponent 
      initial={animate ? { opacity: 0, y: 20 } : undefined}
      whileInView={animate ? { opacity: 1, y: 0 } : undefined}
      viewport={animate ? { once: true } : undefined}
      className={classes}
    >
      {children}
    </CardComponent>
  );
}
