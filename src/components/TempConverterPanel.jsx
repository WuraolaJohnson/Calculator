import React, { useState } from 'react';
import { Minus, X, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

const TempConverterPanel = ({ onClose }) => {
  const [celsius, setCelsius] = useState('');
  const [fahrenheit, setFahrenheit] = useState('');
  const [kelvin, setKelvin] = useState('');

  const updateFromCelsius = (val) => {
    if (val === '') {
      setCelsius(''); setFahrenheit(''); setKelvin('');
      return;
    }
    const c = parseFloat(val);
    setCelsius(val);
    setFahrenheit(((c * 9/5) + 32).toFixed(2));
    setKelvin((c + 273.15).toFixed(2));
  };

  const updateFromFahrenheit = (val) => {
    if (val === '') {
      setCelsius(''); setFahrenheit(''); setKelvin('');
      return;
    }
    const f = parseFloat(val);
    setFahrenheit(val);
    setCelsius(((f - 32) * 5/9).toFixed(2));
    setKelvin(((f - 32) * 5/9 + 273.15).toFixed(2));
  };

  const updateFromKelvin = (val) => {
    if (val === '') {
      setCelsius(''); setFahrenheit(''); setKelvin('');
      return;
    }
    const k = parseFloat(val);
    setKelvin(val);
    setCelsius((k - 273.15).toFixed(2));
    setFahrenheit(((k - 273.15) * 9/5 + 32).toFixed(2));
  };

  const InputField = ({ label, value, onChange, placeholder, unit }) => (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-bold text-primary-dark uppercase tracking-widest px-2">{label}</label>
      <div className="relative">
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full p-4 bg-white/60 border border-primary/20 rounded-2xl focus:ring-2 focus:ring-primary/40 focus:border-primary outline-none transition-all text-xl font-bold text-gray-800 placeholder:text-gray-300"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-primary font-black text-lg">{unit}</span>
      </div>
    </div>
  );

  return (
    <div className="h-full flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-4">
        <button 
          onClick={onClose}
          className="p-3 glass rounded-xl hover:bg-white/60 text-primary transition-all button-fun"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h2 className="text-2xl font-black text-primary leading-tight">Temp Converter</h2>
          <p className="text-xs font-medium text-gray-500 uppercase tracking-widest">Celsius • Fahrenheit • Kelvin</p>
        </div>
      </div>

      {/* Conversion Grid */}
      <div className="flex-1 flex flex-col gap-6 justify-center max-w-md mx-auto w-full">
        <InputField 
          label="Celsius" 
          value={celsius} 
          onChange={updateFromCelsius} 
          placeholder="0.0" 
          unit="°C" 
        />
        <div className="flex justify-center -my-2">
            <div className="w-1 h-8 bg-primary/10 rounded-full" />
        </div>
        <InputField 
          label="Fahrenheit" 
          value={fahrenheit} 
          onChange={updateFromFahrenheit} 
          placeholder="32.0" 
          unit="°F" 
        />
        <div className="flex justify-center -my-2">
            <div className="w-1 h-8 bg-primary/10 rounded-full" />
        </div>
        <InputField 
          label="Kelvin" 
          value={kelvin} 
          onChange={updateFromKelvin} 
          placeholder="273.15" 
          unit="K" 
        />
      </div>

      {/* Footer Info */}
      <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
        <p className="text-xs text-primary-dark/60 italic text-center leading-relaxed">
          Switch between units instantly. Precision is limited to 2 decimal places for clarity.
        </p>
      </div>
    </div>
  );
};

export default TempConverterPanel;
