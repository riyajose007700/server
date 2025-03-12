import { useState, useEffect } from "react";
import { LoginModal } from '../components/LoginModal';
import { ArrowRight, ChevronDown } from "lucide-react";
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from "framer-motion";

export const Landing: React.FC = () => {
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [isScrollingUp, setIsScrollingUp] = useState(true);
  const [activeSection, setActiveSection] = useState("home");
  const { scrollY: scrollValue } = useScroll();

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
      
      const sections = ["home", "features", "about", "contact"];
      sections.forEach(section => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          if (rect.top <= 100 && rect.bottom >= 100) {
            setActiveSection(section);
          }
        }
      });
    };
    
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useMotionValueEvent(scrollValue, "change", (latest) => {
    const previous = scrollValue.getPrevious() ?? 0;
    setIsScrollingUp(latest < previous);
  });

  const fadeInUp = {
    initial: { y: 20, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    transition: { duration: 0.5 }
  };

  const staggerContainer = {
    animate: {
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const navVariants = {
    visible: { y: 0, opacity: 1 },
    hidden: { y: -30, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-[#1A1A1A] relative overflow-hidden">
      {/* Hero Section with ATM Background */}
      <section id="home" className="bg-[url('src//images//bg_image.jpg')] bg-cover bg-center relative overflow-hidden brightness-115">
        {/* ATM Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-fixed"
        />
        
        {/* Overlay Pattern */}
        <div className="absolute inset-0 bg-black/50" />
        
        {/* Animated Gradient Overlay */}
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-1/4 w-1/2 h-1/2 bg-[#ffd500]/10 rounded-full blur-[120px] animate-pulse" />
          <div className="absolute bottom-0 -right-1/4 w-1/2 h-1/2 bg-[#ffd500]/5 rounded-full blur-[120px] animate-pulse delay-1000" />
        </div>

        {/* Header */}
        <motion.header 
          className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
            scrollY > 50 ? 'bg-black/60 backdrop-blur-md' : 'bg-transparent'
          }`}
          initial={{ y: -100 }}
          animate={{ 
            y: 0,
            opacity: isScrollingUp ? 1 : 0,
            transition: { duration: 0.3 }
          }}
        >
          <nav className="container mx-auto px-6 py-4 flex items-center">
            <motion.div 
              className="flex items-center gap-3"
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img src="src\images\Logo-Light-1.png" alt="Logo" className="h-14 w-auto" />
            </motion.div>
            
            <div className="flex-1 flex items-center justify-center gap-8">
              {["Home", "Features", "About", "Contact"].map((item, index) => (
                <motion.a
                  key={item}
                  href={item === "Home" ? "#" : `#${item.toLowerCase()}`}
                  className={`relative text-white/80 hover:text-white transition-colors group ${
                    activeSection === item.toLowerCase() ? 'text-[#FFD700] font-medium' : ''
                  }`}
                  variants={navVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  {item}
                  <span 
                    className={`absolute -bottom-1 left-0 h-0.5 bg-[#FFD700] transition-all duration-300 ${
                      activeSection === item.toLowerCase() ? 'w-full' : 'w-0 group-hover:w-full'
                    }`} 
                  />
                </motion.a>
              ))}
            </div>

            <div className="flex items-center gap-4">
              <motion.button
                onClick={() => setIsLoginOpen(true)}
                className="px-4 py-2 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign In
              </motion.button>
              <motion.button 
                className="px-4 py-2 border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Sign Up
              </motion.button>
            </div>
          </nav>
        </motion.header>

        {/* Hero Content */}
        <div className="relative container mx-auto px-6 min-h-screen flex items-center justify-center">
          <div className="text-center max-w-4xl mx-auto">
            <motion.h1 
              className="text-7xl font-bold mb-6 text-gradient"
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              ASTHRA ATM DRIVER
            </motion.h1>
            <motion.p 
              className="text-white/80 text-xl mb-12 leading-relaxed"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Revolutionize your ATM network with cutting-edge management and monitoring solutions.
            </motion.p>
            <motion.div 
              className="flex gap-6 justify-center"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              <motion.button 
                className="group px-6 py-3 bg-[#FFD700] text-black rounded-lg hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(255,215,0,0.3)] transition-all duration-300 flex items-center gap-2"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Get Started
                <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </motion.button>
              <motion.button 
                className="px-6 py-3 border border-[#FFD700] text-[#FFD700] rounded-lg hover:bg-[#FFD700]/10 hover:shadow-[0_0_20px_rgba(255,215,0,0.2)] transition-all duration-300"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Learn More
              </motion.button>
            </motion.div>
            <motion.div 
              className="mt-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
            >
              <ChevronDown className="w-6 h-6 text-[#FFD700] mx-auto animate-bounce" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section with Matte Black Background */}
      <section id="features" className="py-32 relative bg-[#121212]">
        <div className="absolute inset-0 bg-[#1A1A1A] opacity-50" />
        <motion.div
          className="container mx-auto px-6 relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={staggerContainer}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            variants={fadeInUp}
          >
            <span className="text-gradient">Powerful Features</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: 'Advanced Security',
                description: 'State-of-the-art encryption and security protocols to safeguard all ATM transactions.'
              },
              {
                title: 'Real-time Monitoring',
                description: 'Monitor ATM status, performance, and transactions in real-time with instant alerts.'
              },
              {
                title: 'Multi-Protocol Support',
                description: 'Seamless integration with NDC, Diebold, NDC ISO+, Astra Edge, and MORE.'
              },
              {
                title: 'Centralized Management',
                description: 'Control and manage your entire ATM network from a single, intuitive interface.'
              },
              {
                title: 'Automated Workflows',
                description: 'Streamline operations with customizable, automated processes and reporting.'
              },
              {
                title: 'Compliance Ready',
                description: 'Stay compliant with industry standards and regulations with built-in tools and reports.'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                className="feature-card"
                variants={{
                  initial: { y: 50, opacity: 0 },
                  animate: { y: 0, opacity: 1 }
                }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-[#FFD700] text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-white/70 leading-relaxed">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* About Section with Darker Matte Black */}
      <section id="about" className="py-32 relative bg-[#0A0A0A]">
        <div className="absolute inset-0 bg-[#0F0F0F] opacity-50" />
        <motion.div 
          className="container mx-auto px-6 relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-16"
            variants={fadeInUp}
          >
            <span className="text-gradient">About ASTHRA ATM Driver</span>
          </motion.h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <h3 className="text-[#FFD700] text-xl font-semibold mb-4">Comprehensive Compatibility</h3>
              <p className="text-white/70 leading-relaxed">
                ASTHRA ATM Driver provides seamless integration with all major ATM protocols, supporting NDC, NDC+, Astra Edge, Diebold 911, and XFS protocols. This wide-ranging compatibility ensures that your ATM network remains cutting-edge and future-proof.
              </p>
            </motion.div>
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <h3 className="text-[#FFD700] text-xl font-semibold mb-4">Intuitive Web Interface</h3>
              <p className="text-white/70 leading-relaxed">
                The ASTHRA ATM provides a user-friendly web interface for interacting with the underlying ATM database. Perform all necessary configurations, manage content, and access critical data with ease, all from a centralized platform designed for efficiency and clarity.
              </p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Contact Section with Deepest Matte Black */}
      <section id="contact" className="py-32 relative bg-[#050505]">
        <div className="absolute inset-0 bg-[#080808] opacity-50" />
        <motion.div 
          className="container mx-auto px-6 relative"
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
        >
          <motion.h2 
            className="text-4xl font-bold text-center mb-6"
            variants={fadeInUp}
          >
            <span className="text-gradient">Get in Touch</span>
          </motion.h2>
          <motion.p 
            className="text-white/80 text-center mb-16 text-lg"
            variants={fadeInUp}
          >
            Have questions or need support? Our team is here to help you optimize your ATM network with ASTHRA.
          </motion.p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <h3 className="text-[#FFD700] text-xl font-semibold mb-4">India Office</h3>
              <p className="text-white/70 mb-3">Central Infotech Phase 1, Infopark Kochi, Kerala, India</p>
              <p className="text-white/70 mb-3">+91 484 401 0362</p>
              <p className="text-white/70">info@appliedpaymentstech.com</p>
            </motion.div>
            <motion.div 
              className="feature-card"
              variants={fadeInUp}
            >
              <h3 className="text-[#FFD700] text-xl font-semibold mb-4">South Africa Office</h3>
              <p className="text-white/70 mb-3">15K 5th Avenue Highlands North, Johannesburg 2192, South Africa</p>
              <p className="text-white/70">info@appliedpaymentstech.com</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 border-t border-[#FFD700]/20 bg-black">
        <motion.div 
          className="container mx-auto px-6 text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <p className="text-white/60 mb-4">© 2025 Applied Payments Technology. All rights reserved.</p>
          <div className="flex justify-center gap-6">
            {["Privacy Policy", "Terms of Service"].map((item) => (
              <a 
                key={item}
                href="#" 
                className="text-white/60 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#FFD700] transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
          </div>
        </motion.div>
      </footer>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </div>
  );
};

export default Landing;