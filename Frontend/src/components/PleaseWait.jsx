import { motion } from "framer-motion";
import { Loader, Hourglass, Clock } from "lucide-react";

const PleaseWait = () => {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
  
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
      >
        <Hourglass className="w-16 h-16 text-yellow-400" />
      </motion.div>

    
      <motion.h2
        className="text-3xl font-bold mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
      >
        Please Wait..
      </motion.h2>
 
      <motion.p
        className="text-gray-300 text-lg text-center mt-3 max-w-md"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 1 }}
      >
        "We’re getting things ready for you. Just a moment."
      </motion.p>
 
      <motion.div
        className="flex gap-4 mt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
      >
        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Loader className="w-8 h-8 text-blue-400" />
        </motion.div>

        <motion.div
          animate={{ y: [10, -10, 10] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Clock className="w-8 h-8 text-red-400" />
        </motion.div>

        <motion.div
          animate={{ y: [-10, 10, -10] }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          <Loader className="w-8 h-8 text-green-400" />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PleaseWait;
