import { motion } from 'framer-motion';
import { Cpu, Zap, Target } from 'lucide-react';

export const AboutChapterSection = () => {
  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{  x: -50 }}
          whileInView={{  x: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-8">
              BMSCE ACM Student Chapter
            </h2>
            <p className="text-xl text-muted-foreground mb-6 leading-relaxed">
              Our student chapter at BMS College of Engineering is a vibrant community of 
              technology enthusiasts, innovators, and future leaders in computing. We bridge 
              the gap between academic learning and industry practices.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Established with the vision to foster computational thinking and technical excellence, 
              we provide a platform for students to explore, learn, and grow in the ever-evolving 
              world of technology.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Cpu, text: "Cutting-edge technology workshops" },
                { icon: Zap, text: "Innovation-driven projects" },
                { icon: Target, text: "Industry-focused skill development" }
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{  x: -20 }}
                  whileInView={{  x: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  whileHover={{ x: 10 }}
                  viewport={{ once: true }}
                  className="flex items-center space-x-4 text-primary"
                >
                  <item.icon className="w-6 h-6" />
                  <span className="text-lg">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </div>
          
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{  scale: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="w-80 h-80 mx-auto relative">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 rounded-full border-2 border-cyan-400/30"
              />
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-4 rounded-full border-2 border-purple-400/30"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-8 rounded-full border-2 border-pink-400/30"
              />
              <div className="absolute inset-16 flex items-center justify-center">
                <motion.div
                  animate={{ 
                    scale: [1, 1.1, 1],
                    rotate: [0, 180, 360]
                  }}
                  transition={{ 
                    duration: 4, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                  className="text-6xl font-bold bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent"
                >
                  ACM
                </motion.div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};