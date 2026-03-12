import React, { useState, useEffect } from 'react';
import { evaluate } from 'mathjs';
import { History, Thermometer, Delete, Equal, RotateCcw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Calculator = ({ onOpenTempConverter }) => {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [history, setHistory] = useState([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isRad, setIsRad] = useState(false);
  const [memory, setMemory] = useState(0);

  const handleNumber = (num) => {
    if (display === '0' || display === 'Error') {
      setDisplay(num);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    setExpression(display + ' ' + op + ' ');
    setDisplay('0');
  };

  const handleScientific = (fn) => {
    try {
      let result;
      const val = parseFloat(display);
      const angleMultiplier = isRad ? 1 : Math.PI / 180;

      switch(fn) {
        case 'sin': result = Math.sin(val * angleMultiplier); break;
        case 'cos': result = Math.cos(val * angleMultiplier); break;
        case 'tan': result = Math.tan(val * angleMultiplier); break;
        case 'log': result = Math.log10(val); break;
        case 'ln': result = Math.log(val); break;
        case 'sqrt': result = Math.sqrt(val); break;
        default: return;
      }
      
      const formattedResult = Number(result.toFixed(8)).toString();
      setHistory([{ expr: `${fn}(${display})`, res: formattedResult }, ...history]);
      setDisplay(formattedResult);
    } catch (e) {
      setDisplay('Error');
    }
  };

  const handleMemory = (action) => {
    const current = parseFloat(display);
    switch(action) {
      case 'M+': setMemory(memory + current); break;
      case 'M-': setMemory(memory - current); break;
      case 'MR': setDisplay(memory.toString()); break;
      case 'MC': setMemory(0); break;
    }
  };

  const calculate = () => {
    try {
      if (display === '0' && expression === '') return;
      
      // Sanitizing and evaluating
      let finalExpr = (expression + display)
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\^/g, '**');
      
      const result = evaluate(finalExpr);
      const formattedResult = Number(result.toFixed(8)).toString();
      
      setHistory([{ expr: expression + display, res: formattedResult }, ...history]);
      setDisplay(formattedResult);
      setExpression('');
    } catch (error) {
      setDisplay('Error');
    }
  };

  const clear = () => {
    setDisplay('0');
    setExpression('');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't intercept typing if an input field is focused
      if (document.activeElement.tagName === 'INPUT') return;

      const key = e.key;

      if (/[0-9.]/.test(key)) {
        handleNumber(key);
      } else if (['+', '-', '*', '/'].includes(key)) {
        if (key === '/') e.preventDefault(); // Prevent Firefox quick search
        const op = key === '*' ? '×' : key === '/' ? '÷' : key;
        handleOperator(op);
      } else if (key === 'Enter' || key === '=') {
        e.preventDefault();
        calculate();
      } else if (key === 'Backspace') {
        backspace();
      } else if (key === 'Escape' || key === 'Delete') {
        clear();
      } else if (key === '(' || key === ')') {
        handleNumber(key);
      } else if (key === '^') {
        handleOperator('^');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [display, expression, history, memory, isRad]);

  const ScientificButton = ({ children, onClick, active, className = "" }) => (
    <button
      onClick={onClick}
      className={`p-3 rounded-xl font-medium transition-all duration-200 button-fun flex items-center justify-center
        ${active ? 'bg-primary text-white' : 'glass hover:bg-white/50 text-gray-700'} ${className}`}
    >
      {children}
    </button>
  );

  const ActionButton = ({ icon: Icon, onClick, label }) => (
    <button
      onClick={onClick}
      className="p-3 glass rounded-xl hover:bg-white/60 text-primary-dark transition-all button-fun flex flex-col items-center gap-1 min-w-[70px]"
    >
      <Icon size={20} />
      <span className="text-[10px] font-bold uppercase tracking-wider">{label}</span>
    </button>
  );

  return (
    <div className="flex flex-col h-full gap-6">
      {/* Top Bar Actions */}
      <div className="flex justify-between items-center px-2">
        <div className="flex gap-3">
          <ActionButton 
            icon={History} 
            label="History" 
            onClick={() => setIsHistoryOpen(!isHistoryOpen)} 
          />
          <ActionButton 
            icon={Thermometer} 
            label="Convert" 
            onClick={onOpenTempConverter} 
          />
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setIsRad(!isRad)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all border ${isRad ? 'bg-primary text-white border-primary' : 'bg-transparent text-primary border-primary/30'}`}
          >
            {isRad ? 'RAD' : 'DEG'}
          </button>
          <div className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold">
            MS: {Number(memory.toFixed(2))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-6 lg:flex-row">
        {/* Main Interface */}
        <div className="flex-1 flex flex-col gap-6">
          {/* Display Area */}
          <div className="bg-white/40 backdrop-blur-md rounded-2xl p-6 shadow-inner border border-white/50 text-right min-h-[140px] flex flex-col justify-end">
            <div className="text-gray-500 text-sm font-medium h-6 truncate">{expression}</div>
            <div className="text-5xl font-black text-primary truncate tracking-tight">{display}</div>
          </div>

          {/* Memory & Power Row */}
          <div className="grid grid-cols-5 gap-2 sm:gap-3">
            {['M+', 'M-', 'MR', 'MC', '^'].map((m) => (
              <ScientificButton key={m} onClick={() => m === '^' ? handleOperator('^') : handleMemory(m)} className="bg-primary/10 text-primary-dark text-[10px] sm:text-xs font-bold p-2 sm:p-3">
                {m}
              </ScientificButton>
            ))}
          </div>

          {/* Main Keypad */}
          <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 sm:gap-3">
            {/* Control Row */}
            <ScientificButton onClick={() => handleNumber('(')}>(</ScientificButton>
            <ScientificButton onClick={() => handleNumber(')')}>)</ScientificButton>
            <ScientificButton onClick={() => setDisplay(Math.PI.toString())} className="group relative">
              π
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                3.14159265
              </span>
            </ScientificButton>
            <ScientificButton onClick={() => setDisplay(Math.E.toString())} className="group relative">
              e
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                2.71828182
              </span>
            </ScientificButton>
            <ScientificButton onClick={clear} className="bg-red-50 text-red-500 hover:bg-red-100 sm:col-span-1 border border-red-100 font-bold">C</ScientificButton>

            {/* Standard Grid */}
            {[7, 8, 9, '÷', 'sin'].map((item) => (
               <ScientificButton 
                key={item} 
                onClick={() => typeof item === 'number' ? handleNumber(item.toString()) : (['÷', '×', '-', '+'].includes(item) ? handleOperator(item) : handleScientific(item))}
                className={typeof item === 'number' ? 'bg-white/80 text-base sm:text-lg md:text-xl py-4 sm:py-3' : 'bg-primary/5 text-primary-dark font-bold text-sm sm:text-base hidden sm:flex'}
               >
                 {item}
               </ScientificButton>
            ))}
            {[4, 5, 6, '×', 'cos'].map((item) => (
               <ScientificButton 
                key={item}
                onClick={() => typeof item === 'number' ? handleNumber(item.toString()) : (['÷', '×', '-', '+'].includes(item) ? handleOperator(item) : handleScientific(item))}
                className={typeof item === 'number' ? 'bg-white/80 text-base sm:text-lg md:text-xl py-4 sm:py-3' : 'bg-primary/5 text-primary-dark font-bold text-sm sm:text-base hidden sm:flex'}
               >
                 {item}
               </ScientificButton>
            ))}
            {[1, 2, 3, '-', 'tan'].map((item) => (
               <ScientificButton 
                key={item}
                onClick={() => typeof item === 'number' ? handleNumber(item.toString()) : (['÷', '×', '-', '+'].includes(item) ? handleOperator(item) : handleScientific(item))}
                className={typeof item === 'number' ? 'bg-white/80 text-base sm:text-lg md:text-xl py-4 sm:py-3' : 'bg-primary/5 text-primary-dark font-bold text-sm sm:text-base hidden sm:flex'}
               >
                 {item}
               </ScientificButton>
            ))}
            {['0', '.', '=', '+', 'ln'].map((item) => (
               <ScientificButton 
                key={item}
                onClick={item === '=' ? calculate : (item === '0' || item === '.' ? () => handleNumber(item) : (item === '+' ? () => handleOperator('+') : () => handleScientific(item)))}
                className={item === '=' ? 'bg-primary text-white hover:bg-primary-dark text-lg sm:text-xl md:text-2xl shadow-lg py-4 sm:py-3' : (item === '0' || item === '.' ? 'bg-white/80 text-base sm:text-lg md:text-xl py-4 sm:py-3' : 'bg-primary/5 text-primary-dark font-bold text-sm sm:text-base hidden sm:flex')}
               >
                 {item}
               </ScientificButton>
            ))}
            
            {/* Mobile/Extra functions */}
            <ScientificButton onClick={() => handleScientific('log')} className="sm:hidden bg-primary/5 text-primary-dark font-bold text-sm">log</ScientificButton>
            <ScientificButton onClick={() => handleScientific('sin')} className="sm:hidden bg-primary/5 text-primary-dark font-bold text-sm">sin</ScientificButton>
            <ScientificButton onClick={() => handleScientific('cos')} className="sm:hidden bg-primary/5 text-primary-dark font-bold text-sm">cos</ScientificButton>
            <ScientificButton onClick={() => handleScientific('tan')} className="sm:hidden bg-primary/5 text-primary-dark font-bold text-sm">tan</ScientificButton>
            <ScientificButton onClick={() => handleScientific('sqrt')} className="bg-primary/5 text-primary-dark font-bold text-sm sm:text-base">√</ScientificButton>
            <ScientificButton onClick={backspace} className="bg-primary/5 text-primary-dark font-bold col-span-2 sm:col-span-1 py-4 sm:py-3"><Delete size={20} className="mx-auto" /></ScientificButton>
          </div>        </div>

        {/* Desktop History Sidebar */}
        <AnimatePresence>
          {isHistoryOpen && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="lg:w-64 glass rounded-2xl p-4 flex flex-col gap-4 border border-white/40"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm uppercase tracking-widest text-primary-dark">History</h3>
                <button onClick={() => setHistory([])} className="text-gray-400 hover:text-red-400 transition-colors">
                  <RotateCcw size={14} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
                {history.length === 0 ? (
                  <div className="text-center text-gray-400 text-xs mt-10 italic">No calculations yet</div>
                ) : (
                  history.map((h, i) => (
                    <div key={i} className="text-right border-b border-black/5 pb-2">
                      <div className="text-[10px] text-gray-400 font-mono">{h.expr} =</div>
                      <div className="text-sm font-bold text-primary">{h.res}</div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Calculator;
