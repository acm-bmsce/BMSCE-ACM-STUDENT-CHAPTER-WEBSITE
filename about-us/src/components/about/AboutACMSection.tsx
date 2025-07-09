import { motion } from 'framer-motion';
import { Globe, Award, BookOpen } from 'lucide-react';

export const AboutACMSection = () => {
  const features = [
    {
      icon: Globe,
      title: "Global Network",
      description: "World's largest computing society with over 100,000 members"
    },
    {
      icon: Award,
      title: "Excellence",
      description: "Advancing computing as a science and profession since 1947"
    },
    {
      icon: BookOpen,
      title: "Knowledge",
      description: "Leading source of computing research and educational resources"
    }
  ];

  return (
    <section className="py-20 px-4">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{  y: 50 }}
          whileInView={{ y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-6">
            About ACM
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            The Association for Computing Machinery (ACM) is the world's largest educational and 
            scientific computing society, bringing together computing educators, researchers, and 
            professionals to inspire dialogue, share resources, and address the field's challenges.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ y: 50 }}
              whileInView={{  y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ scale: 1.05, rotateY: 5 }}
              viewport={{ once: true }}
              className="bg-card p-8 rounded-2xl border border-border backdrop-blur-sm hover:border-primary/50 transition-all duration-300"
            >
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="inline-block mb-4"
              >
                <feature.icon className="w-12 h-12 text-primary" />
              </motion.div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};