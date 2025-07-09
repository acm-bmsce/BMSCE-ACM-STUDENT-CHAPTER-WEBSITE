import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, Instagram, Linkedin, Github } from 'lucide-react';

export const ContactSection = () => {
  const contactInfo = [
    {
      icon: Mail,
      title: "Email",
      value: "acm@bmsce.ac.in",
      link: "mailto:acm@bmsce.ac.in"
    },
    {
      icon: Phone,
      title: "Phone",
      value: "+91 9876543210",
      link: "tel:+919876543210"
    },
    {
      icon: MapPin,
      title: "Location",
      value: "BMS College of Engineering, Bangalore",
      link: "#"
    }
  ];

  const socialLinks = [
    { icon: Instagram, href: "#", color: "hover:text-primary" },
    { icon: Linkedin, href: "#", color: "hover:text-secondary" },
    { icon: Github, href: "#", color: "hover:text-accent" }
  ];

  return (
    <section className="py-20 px-4 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-5xl font-bold bg-gradient-to-r from-secondary to-primary bg-clip-text text-transparent mb-6">
            Get In Touch
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Ready to join our community? Reach out to us and become part of the future of computing
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            {contactInfo.map((contact, index) => (
              <motion.a
                key={index}
                href={contact.link}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ scale: 1.05, x: 10 }}
                viewport={{ once: true }}
                className="flex items-center space-x-6 p-6 bg-card rounded-2xl border border-border hover:border-primary/50 transition-all duration-300 group"
              >
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                  <contact.icon className="w-8 h-8 text-primary-foreground" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">{contact.title}</h3>
                  <p className="text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    {contact.value}
                  </p>
                </div>
              </motion.a>
            ))}
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex justify-center space-x-8 pt-8"
            >
              {socialLinks.map((social, index) => (
                <motion.a
                  key={index}
                  href={social.href}
                  whileHover={{ scale: 1.2, rotate: 10 }}
                  whileTap={{ scale: 0.9 }}
                  className={`w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground ${social.color} transition-all duration-300 hover:shadow-lg`}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </motion.div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="relative"
          >
            <div className="bg-card p-8 rounded-2xl border border-border backdrop-blur-sm">
              <h3 className="text-2xl font-bold text-foreground mb-6">Join Our Community</h3>
              <p className="text-muted-foreground mb-8">
                Whether you're a beginner or an expert, there's a place for you in our community. 
                Let's build the future of technology together!
              </p>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-primary text-primary-foreground font-bold py-4 px-8 rounded-xl hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                Join Now
              </motion.button>
            </div>
            
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.1, 1]
              }}
              transition={{
                rotate: { duration: 20, repeat: Infinity, ease: "linear" },
                scale: { duration: 3, repeat: Infinity, ease: "easeInOut" }
              }}
              className="absolute -top-4 -right-4 w-24 h-24 bg-accent rounded-full opacity-20 blur-xl"
            />
          </motion.div>
        </div>
      </div>
    </section>
  );
};