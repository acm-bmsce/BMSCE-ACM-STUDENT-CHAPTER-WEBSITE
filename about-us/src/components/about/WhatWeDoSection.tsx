import { motion } from 'framer-motion';
import { Code2, Presentation, Wrench, Users2, Calendar, Award } from 'lucide-react';

export const WhatWeDoSection = () => {
  const activities = [
    {
      icon: Code2,
      title: "Coding Workshops",
      description: "Hands-on sessions covering latest programming languages and frameworks",
      color: "primary"
    },
    {
      icon: Presentation,
      title: "Tech Talks",
      description: "Expert speakers sharing insights on emerging technologies and trends",
      color: "secondary"
    },
    {
      icon: Wrench,
      title: "Project Development",
      description: "Collaborative projects that solve real-world problems using cutting-edge tech",
      color: "accent"
    },
    {
      icon: Users2,
      title: "Networking Events",
      description: "Connect with industry professionals and fellow tech enthusiasts",
      color: "primary"
    },
    {
      icon: Calendar,
      title: "Hackathons",
      description: "Intensive coding competitions to build innovative solutions",
      color: "secondary"
    },
    {
      icon: Award,
      title: "Competitions",
      description: "Programming contests and technical challenges to test your skills",
      color: "accent"
    }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{  y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-6">
            What We Do
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover the exciting activities and opportunities we offer to fuel your passion for technology
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <motion.div
              key={index}
              initial={{scale: 0.9 }}
              whileInView={{scale: 1 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ 
                y: -10,
                transition: { duration: 0.3 }
              }}
              viewport={{ once: true }}
              className="group relative overflow-hidden"
            >
              <div className="bg-card p-8 rounded-2xl border border-border backdrop-blur-sm hover:border-primary/80 transition-all duration-300 h-full relative z-10">
                <motion.div
                  initial={{ rotate: 0 }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                  className="inline-block mb-6"
                >
                  <div className="w-16 h-16 rounded-full bg-primary p-4 flex items-center justify-center">
                    <activity.icon className="w-8 h-8 text-primary-foreground" />
                  </div>
                </motion.div>
                
                <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-foreground transition-all duration-300">
                  {activity.title}
                </h3>
                
                <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                  {activity.description}
                </p>
              </div>
              
              <motion.div
                initial={{  }}
                whileHover={{  }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0 bg-primary/5 rounded-2xl"
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
