import { motion } from "framer-motion";

const FloatingShapes = ({ color, size, top, left, delay }) => {
  return (
    <motion.div
      aria-hidden="true"
      className={`absolute rounded-full opacity-20 blur-xl ${color} ${size}`}
      style={{ top, left }}
      animate={{
        y: ["0%", "100%", "0%"],
        x: ["0%", "100%", "0%"],
        rotate: [0, 360],
      }}
      transition={{
        duration: 20,
        ease: "linear",
        repeat: Infinity,
        delay,
      }}
    />
  );
};

export default FloatingShapes;
