import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';

const achievements = [
  {
    title: "ACM India Chapter Summit 2024",
    description: "BMSCE served as the anchor host for this prestigious event, focusing on 'Sustainable Computing' and bringing together chapters nationwide.",
    icon: "🏛️",
    highlight: "Anchor Host",
    stats: "National Event"
  },
  {
    title: "Emerging Chapter Award 2024",
    description: "National-level recognition presented by ACM President Yannis Ioannidis and Jury Chair Mini Ulanat, acknowledging our exceptional growth and impact.",
    icon: "🏆",
    highlight: "National Recognition",
    stats: "Presidential Award"
  },
  {
    title: "Highest Reported Activities",
    description: "Achieved national recognition for the highest number of reported activities, testament to our team's relentless effort, creativity, and dedication.",
    icon: "📊",
    highlight: "National Leader",
    stats: "500+ Activities",
    isCountable: true
  },
  {
    title: "ACM India Regional Collaboration",
    description: "BMSCE ACM Student Chapter manages key initiatives under the ACM India Council, fostering regional collaboration and knowledge sharing.",
    icon: "🤝",
    highlight: "Regional Management",
    stats: "India Council"
  }
];

const AchievementsSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.2 });

  return (
    <section
      ref={ref}
      className="py-24 px-6 bg-[#110f03] text-white"
    >
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
              Impact in Action:
            </span>
            <br />
            What We've Achieved
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Our journey of excellence, recognition, and meaningful contributions to the tech community
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-10">
          {achievements.map((achievement, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              animate={isInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <div className="relative overflow-hidden bg-black/40 backdrop-blur-md border border-yellow-500/10 rounded-2xl p-6 shadow-md transition-all duration-300 ease-in-out hover:shadow-[0_0_25px_rgba(255,215,0,0.7)] hover:border-yellow-400">
                <div className="text-5xl mb-4">{achievement.icon}</div>
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {achievement.title}
                </h3>
                <p className="text-gray-300 mb-3">
                  {achievement.description}
                </p>
                <div className="text-sm text-yellow-300 font-medium uppercase tracking-wide">
                  {achievement.highlight} — {achievement.stats}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default AchievementsSection;
