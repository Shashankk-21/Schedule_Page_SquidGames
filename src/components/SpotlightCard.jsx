import React, { useRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const SpotlightCard = ({
  children,
  className = '',
  spotlightColor = 'rgba(255, 0, 80, 0.12)',
  style = {},
  ...props
}) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    if (!ref.current) return;
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    el.style.setProperty('--mouse-x', `${x}px`);
    el.style.setProperty('--mouse-y', `${y}px`);
    el.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      className={twMerge(
        "relative rounded-xl border border-squid-border bg-squid-surface/90 backdrop-blur-xl overflow-hidden transition-all duration-300 ease-out group",
        "hover:-translate-y-1 hover:scale-[1.015] hover:border-squid-border-hi",
        className
      )}
      style={{
        '--mouse-x': '50%',
        '--mouse-y': '50%',
        '--spotlight-color': spotlightColor,
        ...style
      }}
      {...props}
    >
      {/* Spotlight Effect Layer */}
      <div
        className="absolute inset-0 z-[1] pointer-events-none opacity-0 transition-opacity duration-500 group-hover:opacity-100"
        style={{
          background: `radial-gradient(circle at var(--mouse-x) var(--mouse-y), var(--spotlight-color), transparent 65%)`
        }}
      />

      {/* Content */}
      <div className="relative z-[2]">
        {children}
      </div>
    </div>
  );
};

export default SpotlightCard;
