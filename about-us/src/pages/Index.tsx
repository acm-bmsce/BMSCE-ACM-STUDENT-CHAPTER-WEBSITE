import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { ArrowRight, Code, Users, Sparkles } from "lucide-react";

const Index = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-black via-purple-950 to-black text-white">
      <div className="text-center max-w-4xl mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-8"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="inline-block mb-6"
          >
            <Code className="w-20 h-20 text-cyan-400" />
          </motion.div>
          
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mb-6">
            Welcome to BMSCE ACM
          </h1>
          
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto">
            Discover our futuristic student chapter and join the future of computing
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <Link to="/about">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="group bg-gradient-to-r from-purple-500 to-cyan-500 text-white font-bold py-4 px-8 rounded-xl hover:from-purple-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl flex items-center space-x-3 mx-auto"
            >
              <span className="text-lg">Explore About Us</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
            </motion.button>
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.8 }}
          className="flex justify-center space-x-12 mt-16 text-cyan-400"
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
    </div>
  );
};

export default Index;