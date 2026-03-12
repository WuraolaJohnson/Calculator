import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, X, Divide, Sigma, Variable, FunctionSquare as Function } from 'lucide-react';

const MathSymbol = ({ icon: Icon, delay, initialPos }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0, x: initialPos.x, y: initialPos.y }}
    animate={{ 
      opacity: [0, 1, 0],
      scale: [0.5, 1.2, 0.8],
      x: initialPos.x + (Math.random() - 0.5) * 200,
      y: initialPos.y + (Math.random() - 0.5) * 200,
      rotate: [0, 360]
    }}
    transition={{ duration: 2, delay, ease: "easeInOut" }}
    className="absolute text-primary/30"
  >
    <Icon size={48} />
  </motion.div>
);

const IntroScreen = ({ onComplete }) => {
  const [showBrand, setShowBrand] = useState(false);

  useEffect(() => {
    const brandTimer = setTimeout(() => setShowBrand(true), 400);
    const finishTimer = setTimeout(onComplete, 2500);
    return () => {
      clearTimeout(brandTimer);
      clearTimeout(finishTimer);
    };
  }, [onComplete]);

  const symbols = [
    { icon: Plus, delay: 0.1, pos: { x: -150, y: -100 } },
    { icon: Minus, delay: 0.3, pos: { x: 180, y: 80 } },
    { icon: X, delay: 0.2, pos: { x: -120, y: 150 } },
    { icon: Divide, delay: 0.5, pos: { x: 200, y: -120 } },
    { icon: Sigma, delay: 0.4, pos: { x: 50, y: -180 } },
    { icon: Variable, delay: 0.6, pos: { x: -200, y: 0 } },
    { icon: Function, delay: 0.2, pos: { x: 120, y: -50 } },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#fdfaf8] overflow-hidden">
      {symbols.map((s, i) => {
        return <MathSymbol key={i} icon={s.icon} delay={s.delay} initialPos={s.pos} />;
      })}
      
      <AnimatePresence>
        {showBrand && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center"
          >
            <motion.h1 
              className="text-6xl font-black text-primary tracking-tighter"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              MathNova
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="mt-2 text-primary-dark font-medium uppercase tracking-[0.3em] text-sm"
            >
              Infinite Precision
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IntroScreen;
