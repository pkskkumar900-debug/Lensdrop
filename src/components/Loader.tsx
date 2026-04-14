import { motion } from 'motion/react';

export function Loader() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 180, 360],
          borderRadius: ["20%", "50%", "20%"]
        }}
        transition={{
          duration: 2,
          ease: "easeInOut",
          times: [0, 0.5, 1],
          repeat: Infinity,
        }}
        className="w-12 h-12 bg-indigo-500/20 border-2 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.5)]"
      />
    </div>
  );
}
