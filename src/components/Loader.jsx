import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div className="flex items-center justify-center space-x-2">
      {[0, 1, 2].map((index) => (
        <motion.span
          key={index}
          className="w-3 h-3 bg-blue-500 rounded-full"
          animate={{
            opacity: [0.3, 1, 0.3],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: index * 0.2,
          }}
        />
        
      ))}
    </div>
  );
};

export default Loader;
