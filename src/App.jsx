import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import IntroScreen from './components/IntroScreen';
import Calculator from './components/Calculator';
import TempConverterPanel from './components/TempConverterPanel';
import './index.css';

function App() {
  const [isIntroVisible, setIsIntroVisible] = useState(true);
  const [activePanel, setActivePanel] = useState('calculator'); // 'calculator' or 'temp'

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {isIntroVisible ? (
          <IntroScreen key="intro" onComplete={() => setIsIntroVisible(false)} />
        ) : (
          <motion.main
            key="main"
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            transition={{ 
              type: "spring", 
              damping: 25, 
              stiffness: 120,
              duration: 1.2 
            }}
            className="min-h-screen w-full bg-gradient-to-br from-[#fdfaf8] to-[#f7ebe4] flex items-center justify-center p-4 md:p-8"
          >
            <div className="w-full max-w-4xl glass rounded-[2.5rem] shadow-premium p-6 md:p-10 min-h-[600px] flex flex-col relative overflow-hidden">
              <AnimatePresence mode="wait">
                {activePanel === 'calculator' ? (
                  <motion.div
                    key="calc"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    <Calculator onOpenTempConverter={() => setActivePanel('temp')} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="temp"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="flex-1"
                  >
                    <TempConverterPanel onClose={() => setActivePanel('calculator')} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Decorative Corner Element */}
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10" />
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/5 rounded-full blur-3xl -z-10" />
            </div>
          </motion.main>
        )}
      </AnimatePresence>
    </div>
  );
}

export default App;
