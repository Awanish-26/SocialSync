import { motion, AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";

const AuthLayout = ({ children, imageSrc, imageText, imageDescription }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";

  return (
    <div className="flex items-center justify-center min-h-full">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="w-full max-w-4xl mx-4 bg-[#1E293B] rounded-xl shadow-2xl overflow-hidden border border-indigo-500/10"
      >
        <div className="flex flex-row items-stretch h-[540px] relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              className="absolute inset-0 flex flex-row items-stretch"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Image Section */}
              <motion.div
                className={`hidden md:block md:w-5/12 bg-gradient-to-br from-indigo-500 to-blue-500 relative ${
                  isLoginPage ? "order-last" : "order-first"
                }`}
                initial={{ 
                  x: isLoginPage ? "-100%" : "100%",
                }}
                animate={{ x: 0 }}
                exit={{ 
                  x: isLoginPage ? "100%" : "-100%",
                }}
                transition={{ 
                  type: "spring", 
                  stiffness: 100,
                  damping: 20,
                  mass: 1.2,
                  duration: 0.8
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-600/90 to-blue-600/90"></div>
                <img
                  src={imageSrc}
                  alt="Auth illustration"
                  className="absolute inset-0 w-full h-full object-contain p-6"
                />
                <div className="absolute bottom-6 left-6 right-6 text-white z-10">
                  <h3 className="text-xl font-bold mb-2">{imageText}</h3>
                  <p className="text-white/80 text-sm">{imageDescription}</p>
                </div>
              </motion.div>

              {/* Form Section */}
              <motion.div
                className={`w-full md:w-7/12 p-6 ${
                  isLoginPage ? "order-first" : "order-last"
                }`}
                initial={{ opacity: 0, x: isLoginPage ? 50 : -50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: isLoginPage ? -50 : 50 }}
                transition={{ 
                  duration: 0.5,
                  delay: 0.3,
                  ease: "easeOut"
                }}
              >
                {children}
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthLayout; 