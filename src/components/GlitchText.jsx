import React from 'react';
import './GlitchText.css';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlitchText = ({ text, className }) => {
  return (
    <div className={twMerge("glitch-wrapper font-orbitron text-white text-4xl md:text-6xl tracking-widest", className)}>
      <div
        className="glitch relative inline-block"
        data-text={text}
      >
        {text}
      </div>
    </div>
  );
};

export default GlitchText;
