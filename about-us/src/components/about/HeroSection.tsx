import { motion } from 'framer-motion';
import { Sparkles, Code, Users } from 'lucide-react';

export const HeroSection = () => {
  return (
    <section className="min-h-screen flex items-center justify-center px-4 relative">
      <div className="text-center max-w-4xl mx-auto">
        {/* This div was a motion.div; changed to regular div to remove its initial animation */}
        <div className="mb-8">
          {/* Code icon animation remains untouched */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Code className="w-16 h-16 text-primary" />
          </motion.div>

          {/* BMSCE ACM - Now a motion.h1 for the continuous pop effect */}
          <motion.h1
            animate={{ scale: [1, 1.01, 1] }} // Subtle continuous pop
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent mb-6"
          >
            BMSCE ACM
          </motion.h1>

          {/* STUDENT CHAPTER - Now bold and with continuous pop effect */}
          <motion.h2
            // Removed initial and empty animate. Added continuous pop effect.
            animate={{ scale: [1, 1.01, 1] }} // Subtle continuous pop
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut", delay: 0.2 }} // Added slight delay for offset
            className="text-2xl md:text-4xl font-bold text-muted-foreground mb-8" // Changed font-light to font-bold
          >
            STUDENT CHAPTER
          </motion.h2>
        </div>

        {/* This motion.div and its children (Innovation, Technology, Community) remain untouched */}
        <motion.div
          initial={{ y: 30 }}
          animate={{ y: 0 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="flex justify-center space-x-8 text-primary"
        >
          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="flex flex-col items-center"
          >
            <Sparkles className="w-8 h-8 mb-2" />
            <span className="text-sm">Innovation</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.2, rotate: -10 }}
            className="flex flex-col items-center"
          >
            <Code className="w-8 h-8 mb-2" />
            <span className="text-sm">Technology</span>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.2, rotate: 10 }}
            className="flex flex-col items-center"
          >
            <Users className="w-8 h-8 mb-2" />
            <span className="text-sm">Community</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};