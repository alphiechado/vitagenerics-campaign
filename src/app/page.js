"use client"; 

import { useState, useEffect, useRef, useCallback } from 'react';
import { Menu, X, Locate, Gift, CheckCircle, Heart, Dumbbell, Shield, Baby, BookOpen, Instagram, Facebook, Link as LinkIcon, Phone, ArrowRight, Zap, Loader } from 'lucide-react';
import { motion, useScroll, useSpring, useInView } from 'framer-motion';

// --- File Access Variables (Provided by environment) ---
// FIXED PATHS: All paths now correctly reference files placed in the /public/assets folder.
const LOGO_URL = "/assets/New-Logo-v8.3-02.jpg"; 
const FONT_ERAS_DEMI = "/assets/ERASDEMI.TTF";   
const FONT_ERAS_BOLD = "/assets/ERASBD.TTF";     
const FONT_ERAS_LIGHT = "/assets/ERASLGHT.TTF";   
const FONT_INTER = 'https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800;900&display=swap';

// --- Hero Background Image URL ---
// FIXED URL: Using the correct relative path to the uploaded background image.
const HERO_BG_IMAGE_URL = "/assets/Screenshot 2025-09-29 at 7.15.49 PM.jpg"; 

// === Configuration and Data ===
const PRIMARY_BLUE = 'bg-indigo-700'; // Fit Blue (Dark Blue/Violet)
const PRIMARY_TEXT = 'text-indigo-700';
const ACCENT_YELLOW_BASE = 'bg-yellow-500'; // Energy Yellow
const ACCENT_YELLOW_GRADIENT = 'from-yellow-500 to-yellow-400';
const ACCENT_GREEN = 'text-emerald-500'; // Fresh Green

const productVariants = [
  { name: 'Fit Man', tagline: 'For stamina, strength, and mental focus.', benefits: ['Endurance Support', 'Muscle Maintenance', 'Cognitive Boost'], icon: <Dumbbell className="w-6 h-6" />, color: 'bg-indigo-100', },
  { name: 'Fit Woman', tagline: 'For balance, beauty, and immunity.', benefits: ['Hormonal Balance', 'Skin & Hair Health', 'Immune Defense'], icon: <Heart className="w-6 h-6" />, color: 'bg-pink-100', },
  { name: 'Fit Pregnancy', tagline: 'For maternal wellness and baby’s development.', benefits: ['Folic Acid Rich', 'Iron Support', 'Essential Nutrients'], icon: <Baby className="w-6 h-6" />, color: 'bg-green-100', },
  { name: 'Fit Pregnancy + Omega-3', tagline: 'Complete maternal wellness with added brain-boosting DHA.', benefits: ['All Fit Pregnancy Benefits', 'Brain Health (DHA)', 'Vision Support'], icon: <BookOpen className="w-6 h-6" />, color: 'bg-blue-100', },
];
const storeLocations = [
    { id: 1, name: 'HealthFirst Pharmacy', address: '14b Adeola Odeku St, Victoria Island, Lagos', city: 'Lagos', state: 'Lagos', contact: '080-VITAGEN' },
    { id: 2, name: 'MegaChem Drugstore', address: 'Plot 7, Garki II, Abuja', city: 'Abuja', state: 'Abuja FCT', contact: '080-VITAGEN' },
    { id: 3, name: 'The Wellness Hub', address: '22 Azikiwe Road, Port Harcourt', city: 'Port Harcourt', state: 'Rivers', contact: '080-VITAGEN' },
];
const productChoices = productVariants.map(p => p.name);

// Gemini API Configuration
const API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=";
const API_KEY = ""; 

// --- Hooks and Animations Simulation ---

const useScrollPosition = () => {
  const [scrollY, setScrollY] = useState(0);

  const handleScroll = useCallback(() => {
    setScrollY(window.scrollY);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [handleScroll]);

  return scrollY;
};

// --- Utility Components ---

// Scroll Progress Bar using Framer Motion
const ScrollProgressBar = () => {
    const { scrollYProgress } = useScroll();
    const scaleX = useSpring(scrollYProgress, {
        stiffness: 100,
        damping: 30,
        restDelta: 0.001
    });

    return (
        <motion.div 
            className={`fixed top-0 left-0 w-full h-1 z-50 origin-[0%] ${PRIMARY_BLUE}`}
            style={{ scaleX }} 
        />
    );
};

// Confetti Component using Framer Motion
const Confetti = ({ isVisible }) => {
    if (!isVisible) return null;

    const colors = ['#ef4444', '#34d399', '#6366f1', '#facc15'];

    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {Array(100).fill(null).map((_, i) => {
                const color = colors[i % colors.length];
                return (
                    <motion.div
                        key={i}
                        className="absolute w-2 h-2 rounded-full"
                        style={{
                            backgroundColor: color,
                            top: '-10px',
                            left: `${Math.random() * 100}%`,
                        }}
                        initial={{ y: 0, opacity: 1, rotate: 0 }}
                        animate={{
                            y: [0, 50, 1000],
                            x: [0, (Math.random() - 0.5) * 500, (Math.random() - 0.5) * 1000],
                            opacity: [1, 0.9, 0],
                            rotate: [0, 360, 720],
                        }}
                        transition={{
                            duration: 4 + Math.random() * 2,
                            delay: Math.random() * 0.5,
                            ease: "linear",
                        }}
                    />
                );
            })}
        </div>
    );
};

const LogoLockup = ({ size = 'md' }) => {
    const heightClass = size === 'lg' ? 'h-16 sm:h-20' : 'h-10 sm:h-12';
    return (
        <motion.div 
            className="flex flex-col items-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.8 }}
        >
            <img 
                src={LOGO_URL} 
                alt="Vitagenerics Good Life Nutrition Logo" 
                className={`${heightClass} w-auto`}
            />
            <span className={`font-eras-bold text-sm text-yellow-300 mt-1 uppercase tracking-widest ${size === 'lg' ? 'text-base' : 'text-sm'}`}>
                Yes, I Fit
            </span>
        </motion.div>
    );
};

const SectionHeader = ({ id, eyebrow, title, subtitle }) => {
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.5 });
    
    const variants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.8, staggerChildren: 0.1 } }
    };

    return (
        <motion.div 
            ref={ref} 
            id={id} 
            className="pt-20 -mt-16 mb-12 sm:mb-16"
            variants={variants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
        >
            <motion.p className={`text-sm font-eras-medium uppercase tracking-wider ${PRIMARY_TEXT} text-center mb-2`} variants={variants}>
                {eyebrow}
            </motion.p>
            <motion.h2 className="text-4xl sm:text-5xl font-eras-bold text-gray-900 text-center leading-tight" variants={variants}>
                {title}
            </motion.h2>
            {subtitle && <motion.p className="text-xl font-eras-light text-gray-600 text-center max-w-3xl mx-auto mt-4" variants={variants}>{subtitle}</motion.p>}
        </motion.div>
    );
};


// === Gemini LLM Component 1: Product Advisor Quiz ===

const ProductAdvisor = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [quizData, setQuizData] = useState({ gender: '', goal: '' });
    const [result, setResult] = useState(null);

    const handleQuizChange = (e) => {
        setQuizData({ ...quizData, [e.target.name]: e.target.value });
        setError(null); 
    };
    
    const productsList = productVariants.map(p => p.name).join(', ');

    const generateRecommendation = async () => {
        // FIX: Check if API key is empty (which it is in this environment)
        if (API_KEY === "") {
            setError("AI Advisor is disabled in this environment. Showing simulated result.");
            setIsLoading(false);
            setResult({
                recommendedProduct: "Fit Woman (Simulated)",
                rationale: "For your high-performance hustle, Fit Woman provides the perfect balance of immunity and beauty to help you shine, non-stop!"
            });
            return;
        }

        setIsLoading(true);
        setError(null);
        setResult(null);

        const userQuery = `I am a ${quizData.gender || 'person'} and my main health goal is ${quizData.goal || 'general wellness'}. Based on the available Vitagenerics products: [${productsList}], recommend the single best product for me and provide a short, engaging, and culturally relevant reason (in less than 50 words) why it fits my Nigerian 'hustle' life.`;
        
        const systemPrompt = "You are a friendly, witty, and knowledgeable Nigerian wellness advisor. Your advice should be concise and focused on high performance and fitness for daily life. Respond only with a JSON object that strictly adheres to the provided schema.";
        
        const payload = {
            contents: [{ parts: [{ text: userQuery }] }],
            systemInstruction: { parts: [{ text: systemPrompt }] },
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: "OBJECT",
                    properties: {
                        recommendedProduct: { type: "STRING", description: "The name of the recommended product from the list." },
                        rationale: { type: "STRING", description: "A short, engaging, culturally relevant reason for the recommendation (max 50 words)." }
                    },
                    required: ["recommendedProduct", "rationale"]
                }
            }
        };
        
        for (let i = 0; i < 3; i++) { 
            try {
                const response = await fetch(API_URL + API_KEY, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const resultJson = await response.json();
                const jsonText = resultJson.candidates?.[0]?.content?.parts?.[0]?.text;
                
                if (jsonText) {
                    const parsedJson = JSON.parse(jsonText);
                    setResult(parsedJson);
                    break; 
                } else {
                    throw new Error("Invalid response format from API.");
                }
            } catch (e) {
                console.error("Gemini API call failed:", e);
                if (i < 2) {
                    await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
                } else {
                    setError("Gemini service is currently unavailable. Please check back soon.");
                }
            }
        }
        
        setIsLoading(false);
    };

    const handleStart = (e) => {
        e.preventDefault();
        setResult(null);
        setIsOpen(true); // Open the modal immediately
        
        // If data is ready, proceed
        if (quizData.gender && quizData.goal) {
            generateRecommendation();
        } else if (API_KEY === "") {
             // If disabled, show simulated result immediately if user selects options
            generateRecommendation();
        } else {
            setError("Please select both your gender and your main goal.");
        }
    };
    
    return (
        <>
            <motion.button 
                onClick={handleStart} // Now uses handleStart to manage initial state/check
                whileHover={{ scale: 1.05, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)" }}
                whileTap={{ scale: 0.98 }}
                // Uses the blue style matching 'Find a Store Near You'
                className={`flex items-center justify-center px-6 py-3 mt-8 mx-auto text-lg font-eras-bold text-white bg-indigo-600 rounded-full shadow-2xl hover:bg-indigo-700 transition duration-300`}
            >
                {/* FIX 1: Changed text */}
                <Zap className="w-5 h-5 mr-2" />
                <span>Find My Fit ✨</span>
            </motion.button>

            {isOpen && (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-30 bg-black bg-opacity-70 flex items-center justify-center p-4" 
                    onClick={() => setIsOpen(false)}
                >
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.8, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                        className="bg-white rounded-xl shadow-2xl p-6 sm:p-10 max-w-lg w-full" 
                        onClick={e => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-6 border-b pb-3">
                            <h3 className="text-2xl font-eras-bold text-indigo-700 flex items-center">
                                <Zap className="w-6 h-6 mr-2 text-yellow-500" />
                                Product Advisor Quiz
                            </h3>
                            <button onClick={() => setIsOpen(false)} className="text-gray-500 hover:text-gray-900 transition">
                                <X className="w-7 h-7" />
                            </button>
                        </div>
                        
                        {/* If result is null AND loading is false, show the form. */}
                        {!result && !isLoading ? (
                            <form onSubmit={handleStart} className="space-y-4">
                                <p className="font-eras-light text-gray-600">Tell us about your hustle, and we'll tell you your fit.</p>
                                
                                <div>
                                    <label className="block text-sm font-eras-medium text-gray-700 mb-1">1. Are you a Fit Man or Fit Woman?</label>
                                    <select name="gender" required onChange={handleQuizChange} value={quizData.gender} 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none font-eras-light bg-white">
                                        <option value="" disabled>Select gender/life stage</option>
                                        <option value="Man">Man</option>
                                        <option value="Woman">Woman (Non-Pregnant)</option>
                                        <option value="Pregnant Woman">Pregnant Woman</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label className="block text-sm font-eras-medium text-gray-700 mb-1">2. What is your primary wellness goal?</label>
                                    <select name="goal" required onChange={handleQuizChange} value={quizData.goal} 
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 appearance-none font-eras-light bg-white">
                                        <option value="" disabled>Select goal</option>
                                        <option value="Boost energy and focus">Boost energy and focus</option>
                                        <option value="Improve skin, hair, and immunity">Improve skin, hair, and immunity</option>
                                        <option value="Support maternal and fetal health">Support maternal and fetal health</option>
                                        <option value="All-round health including brain function">All-round health including brain function</option>
                                    </select>
                                </div>
                                
                                <motion.button type="submit" 
                                    whileHover={{ scale: 1.01, boxShadow: "0 5px 10px rgba(245, 158, 11, 0.5)" }}
                                    whileTap={{ scale: 0.99 }}
                                    className={`w-full py-3 text-lg font-eras-bold text-gray-900 ${ACCENT_YELLOW_BASE} rounded-lg hover:bg-yellow-400 transition duration-150 flex items-center justify-center disabled:opacity-50`}>
                                    Get My Recommendation
                                </motion.button>
                                {error && <p className="text-red-500 text-center text-sm mt-2">{error}</p>}
                            </form>
                        ) : (
                            // Loading or Result State
                             <motion.div 
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-center p-6 bg-indigo-50 rounded-lg border-2 border-indigo-200"
                            >
                                {isLoading ? (
                                    <div className='flex flex-col items-center justify-center p-6'>
                                        <Loader className="w-8 h-8 text-indigo-600 animate-spin mb-4" />
                                        <p className='font-eras-medium text-indigo-600'>Analyzing Your Fit...</p>
                                    </div>
                                ) : (
                                    <>
                                        <h4 className="text-xl font-eras-medium text-indigo-700 mb-2">Your Perfect Fit is:</h4>
                                        <p className="text-4xl font-eras-bold text-emerald-600 mb-4">
                                            {result.recommendedProduct}
                                        </p>
                                        <p className="text-md font-eras-light text-gray-700 italic border-t pt-4">
                                            "{result.rationale}"
                                        </p>
                                        <a href="#lead-form" onClick={() => setIsOpen(false)}
                                           className={`mt-6 inline-flex items-center px-6 py-3 text-white bg-indigo-600 rounded-xl font-eras-medium hover:bg-indigo-700 transition`}>
                                           Claim Your Free Pack Now
                                        </a>
                                    </>
                                )}
                            </motion.div>
                        )}
                    </motion.div>
                </motion.div>
            )}
        </>
    );
};

// === Main Components ===

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className={`sticky top-0 left-0 w-full z-20 ${PRIMARY_BLUE} shadow-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-20">
                <a href="#" className="flex-shrink-0 flex items-center space-x-2">
                    <img src={LOGO_URL} alt="Vitagenerics Logo" className="h-10 w-auto" />
                </a>
                <nav className="hidden md:flex space-x-8">
                    {[{ name: 'Free Pack', href: '#lead-form' }, { name: 'Products', href: '#products' }, { name: 'Store Finder', href: '#store-locator' }].map((item) => (
                    <a key={item.name} href={item.href} className="text-gray-100 font-eras-medium hover:text-yellow-400 transition duration-150 ease-in-out uppercase text-sm">
                        {item.name}
                    </a>
                    ))}
                </nav>
                <div className="hidden md:block">
                    <motion.a 
                        href="#lead-form" 
                        // FIX 1: Enhanced animation and text
                        whileHover={{ scale: 1.1, boxShadow: "0 0 20px rgba(255, 255, 255, 0.9)" }}
                        whileTap={{ scale: 0.9 }}
                        className={`group px-5 py-2 text-sm font-eras-bold text-white bg-indigo-600 rounded-full shadow-lg transition duration-300 transform hover:bg-indigo-500`}
                    >
                        <motion.span 
                            initial={{ scale: 1 }}
                            animate={{ scale: [1, 1.05, 1], rotate: [0, 1, -1, 0] }}
                            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            Get Started
                        </motion.span>
                    </motion.a>
                </div>

                <button
                    className="md:hidden text-white p-2 rounded-md hover:bg-indigo-600"
                    onClick={() => setIsOpen(!isOpen)}
                    aria-expanded={isOpen}
                    aria-label="Toggle navigation"
                >
                    {isOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
                </button>
            </div>
        </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-indigo-800/95 backdrop-blur-sm"
        >
          <div className="px-4 pt-2 pb-4 space-y-2 sm:px-3">
            {[{ name: 'Free Pack', href: '#lead-form' }, { name: 'Products', href: '#products' }, { name: 'Store Finder', href: '#store-locator' }].map((item) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className="block px-3 py-2 rounded-lg text-lg font-eras-medium text-white hover:bg-indigo-700"
              >
                {item.name}
              </a>
            ))}
             <motion.a 
                href="#lead-form" 
                onClick={() => setIsOpen(false)}
                whileTap={{ scale: 0.98 }}
                className={`block w-full mt-4 text-center px-4 py-3 text-lg font-eras-bold text-gray-900 ${ACCENT_YELLOW_BASE} rounded-lg shadow-md hover:bg-yellow-400 transition duration-150 ease-in-out`}
            >
              Get a Free Pack
            </motion.a>
          </div>
        </motion.div>
      )}
    </header>
  );
};

const HeroSection = () => {
    const scrollY = useScrollPosition();
    const parallaxOffset = scrollY * 0.5; 

    // FIX 2: Increased size and enhanced animation variants
    const titleFloatVariants = {
        initial: { opacity: 0, y: 10, textShadow: "0 0 0 rgba(255, 255, 255, 0)" },
        animate: {
            opacity: 1,
            y: [10, -5, 5, -5, 0],
            textShadow: ["0 0 10px #fff", "0 0 40px #ff0", "0 0 10px #fff"], // Pulsing glow effect
            transition: {
                y: { duration: 5, ease: "easeInOut", repeat: Infinity },
                textShadow: { duration: 2, ease: "easeInOut", repeat: Infinity, delay: 0.5 },
                delay: 0.5,
            }
        }
    };
    
    // FIX 4: Background scale animation for a dynamic feel
    const bgScaleVariants = {
        animate: {
            scale: [1.05, 1], // Zoom in then settle
            transition: {
                scale: { duration: 8, ease: "easeInOut", repeat: Infinity, repeatType: "reverse" }
            }
        }
    };

    return (
        <section className={`relative pt-32 pb-16 sm:pt-40 sm:pb-24 overflow-hidden`}>
            {/* Framer Motion Parallax Background with Image */}
            <motion.div
                // FIXED: Now uses the correct HERO_BG_IMAGE_URL path.
                className={`absolute inset-0 z-0 bg-cover bg-center`}
                style={{
                    backgroundImage: `url(${HERO_BG_IMAGE_URL})`,
                    y: -parallaxOffset, 
                    height: '150%', 
                    top: '-50%',
                    // Initial scale slightly larger for zoom-out effect
                    scale: 1.1, 
                }}
                variants={bgScaleVariants}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, ...bgScaleVariants.animate }}
            >
               {/* Dark overlay for contrast */}
               <div className="absolute inset-0 bg-indigo-800/80"></div>
            </motion.div>

            {/* Floating Foreground Content */}
            <motion.div 
                className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white"
                style={{ y: scrollY * 0.15 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 1 }}
            >
              <motion.h1 
                // FIX 2: Bigger text and fascinating animation
                className="text-7xl md:text-8xl lg:text-9xl font-eras-bold tracking-tight mb-4"
                variants={titleFloatVariants}
                initial="initial"
                animate="animate"
              >
                YES, I FIT
              </motion.h1>
              
              <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mt-12 mb-12">
                <motion.a 
                    href="#lead-form" 
                    whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(245, 158, 11, 0.5)" }}
                    whileTap={{ scale: 0.95 }}
                    // FIXED COLOR & ICON: Bright yellow gradient, dark text, dark icon
                    className={`group px-8 py-3 text-lg font-eras-bold text-gray-900 bg-gradient-to-r ${ACCENT_YELLOW_GRADIENT} rounded-xl shadow-2xl transition duration-300 flex items-center justify-center space-x-2`}
                >
                    <Gift className="w-6 h-6 text-gray-900" />
                  <span>Get a Free Wellness Starter Pack</span>
                </motion.a>
                <motion.a 
                    href="#store-locator" 
                    whileHover={{ scale: 1.05, backgroundColor: "#4f46e5" }}
                    whileTap={{ scale: 0.95 }}
                    className="group px-8 py-3 text-lg font-eras-medium text-white bg-indigo-600 border-2 border-white rounded-xl shadow-lg transition duration-300 flex items-center justify-center space-x-2 hover:bg-indigo-700"
                >
                    <Locate className="w-6 h-6" />
                  <span>Find a Store Near You</span>
                </motion.a>
              </div>
               {/* FIX 5: Removed logo lockup under buttons */}
            </motion.div>
        </section>
    );
};

const LeadCaptureForm = () => {
  const [formData, setFormData] = useState({ name: '', phone: '', email: '', city: '', product: productChoices[0] });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.1 });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Form Submitted (Simulated):', formData);
    setIsSubmitted(true);
    // Hide success message and confetti after 5 seconds
    setTimeout(() => setIsSubmitted(false), 5000);
  };

  return (
    <motion.section 
        ref={ref} 
        id="lead-form" 
        className="relative py-16 sm:py-24 bg-gray-100"
        initial={{ opacity: 0, y: 50 }}
        animate={inView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.8 }}
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader eyebrow="Limited Offer" title="Claim Your Wellness Starter Package" />
        
        <div className="max-w-2xl mx-auto p-8 rounded-2xl shadow-2xl border-t-8 border-yellow-500 bg-white">
            <div className="flex items-center space-x-3 mb-6">
                <CheckCircle className={`w-6 h-6 ${ACCENT_GREEN}`} />
                <p className="text-md font-eras-light text-gray-700">
                    Just 1 tablet a day. Made in the UK. GMO-free. Halal-friendly. Packed with essential vitamins.
                </p>
            </div>

            <div className="relative">
                <Confetti isVisible={isSubmitted} />

                {isSubmitted ? (
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center p-12 bg-emerald-50 rounded-lg shadow-lg overflow-hidden"
                    >
                        <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto mb-4" />
                        <h3 className="text-2xl font-eras-bold text-emerald-700">Success! Pack Claimed.</h3>
                        <p className="text-lg font-eras-medium text-emerald-600 mt-2">
                            You're one step closer to your fit life! Check your email for confirmation.
                        </p>
                    </motion.div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <input type="text" name="name" placeholder="Full Name" required onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg font-eras-light focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                        <input type="tel" name="phone" placeholder="Phone Number" required onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg font-eras-light focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                        <input type="email" name="email" placeholder="Email Address" required onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg font-eras-light focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                        <input type="text" name="city" placeholder="City / State" required onChange={handleChange} value={formData.city}
                            className="w-full p-3 border border-gray-300 rounded-lg font-eras-light focus:ring-indigo-500 focus:border-indigo-500 transition duration-150" />
                        
                        <select name="product" required onChange={handleChange} value={formData.product}
                            className="w-full p-3 border border-gray-300 rounded-lg font-eras-light focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white transition duration-150">
                            {productChoices.map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                        
                        <motion.button type="submit" 
                            whileHover={{ scale: 1.01, boxShadow: "0 5px 10px rgba(245, 158, 11, 0.5)" }}
                            whileTap={{ scale: 0.99 }}
                            // Yellow button, dark text
                            className={`group w-full py-4 text-xl font-eras-bold text-gray-900 bg-gradient-to-r ${ACCENT_YELLOW_GRADIENT} rounded-xl shadow-xl transition duration-300 hover:shadow-2xl`}
                        >
                            Claim My Free Fit Pack
                        </motion.button>
                        
                        <p className="text-center text-sm font-eras-medium text-red-500 mt-4">
                            Limited Packs available — first come, first FIT.
                        </p>
                    </form>
                )}
            </div>
        </div>
      </div>
    </motion.section>
  );
};

const ProductCard = ({ name, tagline, benefits, icon, color }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <motion.div 
         initial={{ opacity: 0, y: 50, rotateX: 0 }}
         whileInView={{ opacity: 1, y: 0 }}
         viewport={{ once: true, amount: 0.3 }}
         transition={{ duration: 0.6 }}
         whileHover={{ 
            scale: 1.05, 
            rotateX: 3, 
            rotateY: 3,
            boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.35)",
            transition: { duration: 0.3 }
        }}
         className={`rounded-xl shadow-lg border-t-4 border-indigo-500 ${color} overflow-hidden transition-all duration-300 cursor-pointer`}
         onClick={() => setIsExpanded(!isExpanded)}
    >
      <div className="p-6">
        <div className="flex items-center justify-between">
            {/* Icon remains dark blue/violet (Fit Blue) */}
            <div className={`p-3 rounded-full ${PRIMARY_BLUE} text-white`}>
                {icon}
            </div>
            <span className="text-xs font-eras-medium text-indigo-600 transition duration-150">
                {isExpanded ? 'Show Less' : 'Tap to Expand'}
            </span>
        </div>
        <h3 className="text-2xl font-eras-bold text-gray-900 mt-4 mb-2">{name}</h3>
        <p className="font-eras-light text-gray-600 text-lg">{tagline}</p>
      </div>
      
      {isExpanded && (
        <motion.div
             initial={{ height: 0, opacity: 0 }}
             animate={{ height: "auto", opacity: 1 }}
             exit={{ height: 0, opacity: 0 }}
             transition={{ duration: 0.4 }}
             className="p-6 pt-0 border-t border-gray-200 overflow-hidden"
        >
            <ul className="space-y-2 mt-4">
                {benefits.map((benefit, i) => (
                    <li key={i} className="flex items-center font-eras-light text-gray-700">
                        <CheckCircle className={`w-5 h-5 mr-2 ${ACCENT_GREEN} flex-shrink-0`} />
                        {benefit}
                    </li>
                ))}
            </ul>
        </motion.div>
      )}
    </motion.div>
  );
};

const ProductExplorer = () => {
    return (
        <section id="products" className="py-16 sm:py-24 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader eyebrow="The Full Range" title="Find Your Fit" />
                
                <ProductAdvisor />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-12">
                    {productVariants.map((product, index) => (
                        <ProductCard key={index} {...product} />
                    ))}
                </div>

                <motion.div 
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ delay: 0.5, duration: 1 }}
                    className="text-center mt-16"
                >
                    <p className="text-xl font-eras-medium text-gray-700 mb-6">Ready to improve your daily hustle?</p>
                    <motion.a 
                        href="#store-locator" 
                        whileHover={{ scale: 1.02, backgroundColor: "#4f46e5" }}
                        whileTap={{ scale: 0.98 }}
                        className="group inline-flex items-center px-8 py-4 text-xl font-eras-bold text-white bg-indigo-600 rounded-xl shadow-lg transition duration-300 hover:bg-indigo-700 hover:shadow-2xl"
                    >
                        Buy Now in Store
                        <ArrowRight className="w-5 h-5 ml-3" />
                    </motion.a>
                </motion.div>
            </div>
        </section>
    );
};

const StoreLocatorSection = () => {
    const [selectedCity, setSelectedCity] = useState('All');
    const ref = useRef(null);
    const inView = useInView(ref, { once: true, amount: 0.1 });

    const filteredStores = selectedCity === 'All'
        ? storeLocations
        : storeLocations.filter(store => store.state === selectedCity);
        
    const cities = ['All', ...new Set(storeLocations.map(store => store.state))];

    return (
        <motion.section 
            ref={ref} 
            id="store-locator" 
            className="py-16 sm:py-24 bg-indigo-50"
            initial={{ opacity: 0, y: 50 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
        >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <SectionHeader eyebrow="Local Retailers" title="Where to Buy Vitagenerics" />
                
                <div className="max-w-4xl mx-auto">
                    {/* Filter Controls */}
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={inView ? { opacity: 1 } : {}}
                        transition={{ delay: 0.5, duration: 0.5 }}
                        className="mb-8 flex flex-wrap items-center justify-center space-x-4"
                    >
                        <label htmlFor="city-filter" className="font-eras-medium text-gray-700 mb-2 sm:mb-0">Filter by State:</label>
                        <select
                            id="city-filter"
                            value={selectedCity}
                            onChange={(e) => setSelectedCity(e.target.value)}
                            className="p-3 border border-gray-300 rounded-lg font-eras-light focus:ring-indigo-500 focus:border-indigo-500 appearance-none bg-white min-w-[200px]"
                        >
                            {cities.map(city => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>
                    </motion.div>

                    {/* Map Placeholder */}
                    <motion.div 
                        initial={{ scale: 0.8 }}
                        animate={inView ? { scale: 1 } : {}}
                        transition={{ delay: 0.8, type: "spring", stiffness: 100 }}
                        className="h-64 bg-gray-200 rounded-xl shadow-lg flex items-center justify-center mb-10 border-4 border-indigo-400/50"
                    >
                        <Locate className='w-10 h-10 text-indigo-600 animate-bounce mr-3' />
                        <p className="text-xl font-eras-bold text-gray-600">
                            Interactive Map Placeholder (Lagos, Abuja, PH)
                        </p>
                    </motion.div>

                    {/* Store List */}
                    <div className="space-y-6">
                        {filteredStores.length > 0 ? filteredStores.map((store, index) => (
                            <motion.div 
                                key={store.id} 
                                initial={{ x: -50, opacity: 0 }}
                                animate={inView ? { x: 0, opacity: 1 } : {}}
                                transition={{ delay: 1 + index * 0.15, duration: 0.5 }}
                                className="p-6 bg-white rounded-xl shadow-md flex justify-between items-start flex-col sm:flex-row border-l-4 border-emerald-500 transition duration-300 hover:shadow-xl"
                            >
                                <div className="mb-4 sm:mb-0">
                                    <h4 className="text-xl font-eras-bold text-gray-900">{store.name}</h4>
                                    <p className="font-eras-light text-gray-600 mt-1">{store.address}</p>
                                    <p className={`text-sm font-eras-medium mt-2 ${PRIMARY_TEXT}`}>Contact: {store.contact}</p>
                                </div>
                                <a
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(store.address)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="px-4 py-2 text-sm font-eras-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700 transition duration-150 flex items-center space-x-2 shadow-md"
                                >
                                    <Locate className="w-4 h-4" />
                                    <span>Get Directions</span>
                                </a>
                            </motion.div>
                        )) : (
                            <p className="text-center text-lg font-eras-medium text-gray-600 p-8 bg-white rounded-xl shadow-md">
                                No stores found in the selected location yet.
                            </p>
                        )}
                    </div>
                </div>

                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={inView ? { scale: 1, opacity: 1 } : {}}
                    transition={{ delay: 1.5, duration: 0.5 }}
                    className="text-center mt-12 p-6 bg-indigo-100 rounded-xl shadow-inner border border-indigo-200"
                >
                    <p className="text-lg font-eras-medium text-gray-800">
                        Can't find your location? Call our hotline for direct assistance:
                    </p>
                    <a href="tel:[Insert Number]" className="text-2xl font-eras-bold text-indigo-600 mt-2 flex items-center justify-center space-x-2 hover:text-indigo-800 transition">
                        <Phone className="w-6 h-6" />
                        <span>[Insert Number]</span>
                    </a>
                </motion.div>
            </div>
        </motion.section>
    );
};


const Footer = () => (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 border-b border-gray-700 pb-8 mb-8">
            <div className="col-span-2 md:col-span-1">
                <div className="flex items-center space-x-2">
                    <img src={LOGO_URL} alt="Vitagenerics Logo" className="h-10 w-auto" />
                </div>
            </div>
            
            <div className="md:col-span-3 flex flex-wrap justify-end space-x-6 text-sm font-eras-medium">
                <a href="#" className="text-gray-400 hover:text-white transition">About Vitagenerics</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Privacy</a>
                <a href="#" className="text-gray-400 hover:text-white transition">Terms</a>
            </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-center">
            <div className="text-sm font-eras-light text-gray-400 order-2 sm:order-1 mt-6 sm:mt-0">
                © {new Date().getFullYear()} Vitagenerics. All rights reserved.
            </div>
            <div className="flex space-x-4 order-1 sm:order-2">
                <a href="#" aria-label="Instagram" className="text-gray-400 hover:text-pink-400 transition"><Instagram className="w-6 h-6" /></a>
                <a href="#" aria-label="TikTok" className="text-gray-400 hover:text-gray-100 transition"><LinkIcon className="w-6 h-6" /></a>
                <a href="#" aria-label="Facebook" className="text-gray-400 hover:text-blue-500 transition"><Facebook className="w-6 h-6" /></a>
            </div>
        </div>
      </div>
    </footer>
  );


// === Main App Component ===
const LandingPage = () => {
  return (
    <div className="min-h-screen flex flex-col font-eras-medium antialiased">
        <style>
            {`
                /* Font Faces - Loading uploaded TTF files */
                /* NOTE: In a production Next.js app, this belongs in global CSS */
                @font-face {
                    font-family: 'Eras';
                    src: url('${FONT_ERAS_LIGHT}') format('truetype');
                    font-weight: 300;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'Eras';
                    src: url('${FONT_ERAS_DEMI}') format('truetype');
                    font-weight: 600;
                    font-style: normal;
                }
                @font-face {
                    font-family: 'Eras';
                    src: url('${FONT_ERAS_BOLD}') format('truetype');
                    font-weight: 800;
                    font-style: normal;
                }

                @import url('${FONT_INTER}');
                body {
                    font-family: 'Eras', 'Inter', sans-serif;
                    background-color: #f7f7f7;
                }
                .font-eras-light { font-weight: 300; }
                .font-eras-medium { font-weight: 600; }
                .font-eras-bold { font-weight: 800; }
                
                html {
                    scroll-behavior: smooth;
                }
                section:not(#hero) {
                    padding-top: 8rem; 
                }
            `}
        </style>
        {/* Tailwind is typically loaded via postcss in Next.js, but included here for completeness/preview */}
        <script src="https://cdn.tailwindcss.com"></script> 

        <ScrollProgressBar />
        <Navbar />

        <main className="flex-grow">
            <HeroSection />
            <LeadCaptureForm />
            <ProductExplorer />
            <StoreLocatorSection />
        </main>

        <Footer />
    </div>
  );
};

export default LandingPage;
