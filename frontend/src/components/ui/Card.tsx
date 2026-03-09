"use client";
import { motion } from "framer-motion";
import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

export default function Card({ children, className = "", hover = false, onClick }: CardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={hover ? { y: -4, shadow: "lg" } : {}}
      onClick={onClick}
      className={`
        bg-white dark:bg-forest-800 rounded-2xl shadow-sm
        border border-gray-100 dark:border-forest-700 p-6
        ${hover ? "cursor-pointer transition-all duration-200" : ""}
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}
