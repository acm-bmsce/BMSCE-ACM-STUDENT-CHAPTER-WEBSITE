import React from "react";
import AnimatedTitle from "./AnimatedTitle";
import { motion } from "framer-motion";
import Button from "./Button";

const steps = [
  {
    step: "01",
    title: "Fill Application",
    description:
      "Complete our simple online application form with your details and interests.",
  },
  {
    step: "02",
    title: "Attend Orientation",
    description:
      "Join our welcome session to learn about chapter activities and opportunities.",
  },
  {
    step: "03",
    title: "Start Contributing",
    description:
      "Begin participating in events, projects, and community initiatives immediately.",
  },
];

const Contact = () => {
  return (
    <div id="contact" className="w-screen bg-black py-18">
      <div className="relative text-blue-50 max-w-7xl mx-auto px-4">
        <div className="flex flex-col items-center text-center">
          <AnimatedTitle
            title="Ready To Get Started?"
            className="special-font !md:text-[6.1rem] w-full font-zentry !text-5xl !font-black !leading-[.9] pt-2" // Add this class
          />

          <p className="text-sm text-gray-400 mt-0 max-w-sm">
            Join our thriving community in just three simple steps — connect,
            grow, and lead with us.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16 w-full">
            {steps.map((step, idx) => (
              <motion.div
                key={idx}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="bg-gradient-to-b from-slate-800 to-slate-900 text-white rounded-2xl shadow-lg p-8 h-full"
              >
                <div className="text-blue-400 text-3xl font-bold mb-2">
                  {step.step}
                </div>
                <h3 className="text-2xl font-semibold mb-4">{step.title}</h3>
                <p className="text-gray-300">{step.description}</p>
              </motion.div>
            ))}
          </div>

          <div className="mt-12 flex flex-col sm:flex-row gap-6 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                title="Chapter Membership"
                containerClass="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-8 py-4 text-lg font-semibold rounded-full w-full sm:w-auto transition-all"
                onClick={() => window.open("https://docs.google.com/forms/d/1pCJ6ZbYq8Rdrt5-k9RkNWKHhjJ5wJtfxnL4pSwpUk3U/edit?chromeless=1#responses", "_blank")}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                title="Global Membership"
                containerClass="bg-gradient-to-r from-blue-500 to-sky-500 hover:from-blue-600 hover:to-sky-600 text-white px-8 py-4 text-lg font-semibold rounded-full w-full sm:w-auto transition-all"
                onClick={() => window.open("https://docs.google.com/forms/d/e/1FAIpQLSfYRNzZMGE5dY1yYlEXV0wllD5LVv6FPy_bH8se04qDSy8_kw/closedform", "_blank")}
              />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
