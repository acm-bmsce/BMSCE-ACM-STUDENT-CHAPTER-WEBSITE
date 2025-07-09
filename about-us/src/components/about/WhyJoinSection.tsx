import { motion } from 'framer-motion';
import { Rocket, Users, Trophy, Lightbulb, Network, Star } from 'lucide-react';

export const WhyJoinSection = () => {
  const reasons = [
    {
      icon: Rocket,
      title: "Accelerate Your Career",
      description: "Get ahead with industry connections and practical experience"
    },
    {
      icon: Users,
      title: "Collaborative Learning",
      description: "Learn from peers and industry experts in a supportive environment"
    },
    {
      icon: Trophy,
      title: "Competitions & Awards",
      description: "Participate in coding contests and technical competitions"
    },
    {
      icon: Lightbulb,
      title: "Innovation Hub",
      description: "Turn your creative ideas into reality with our support"
    },
    {
      icon: Network,
      title: "Professional Network",
      description: "Build connections that last throughout your career"
    },
    {
      icon: Star,
      title: "Leadership Opportunities",
      description: "Develop leadership skills through various chapter roles"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
            Why Join Us?
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join a community of passionate technologists and unlock your potential
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                scale: 1.05,
                rotateX: 5,
                rotateY: 5
              }}
              viewport={{ once: true }}
              className="group relative"
            >
              <div className="bg-card p-8 rounded-2xl border border-border backdrop-blur-sm hover:border-primary/60 transition-all duration-300 h-full">
                <motion.div
                  whileHover={{ rotate: 360, scale: 1.2 }}
                  transition={{ duration: 0.5 }}
                  className="inline-block mb-6"
                >
                  <reason.icon className="w-12 h-12 text-primary group-hover:text-accent transition-colors duration-300" />
                </motion.div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-foreground transition-colors duration-300">
                  {reason.title}
                </h3>
                
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {reason.description}
                </p>
                
                <div className="absolute inset-0 bg-primary/0 group-hover:bg-primary/5 rounded-2xl transition-all duration-300" />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};