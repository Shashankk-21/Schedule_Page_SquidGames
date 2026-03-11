import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const GlitchText = ({
  children,
  speed = 1,
  enableShadows = true,
  enableOnHover = false,
  className = '',
  style = {},
}) => {
  const customStyle = {
    '--after-dur': `${speed * 3}s`,
    '--before-dur': `${speed * 2}s`,
    '--after-shadow': enableShadows ? '-5px 0 #ff0050' : 'none',
    '--before-shadow': enableShadows ? ' 5px 0 #00fff0' : 'none',
    ...style,
  };

  return (
    <div
      className={twMerge(
        "glitch",
        enableOnHover && "hover-only",
        className
      )}
      style={customStyle}
      data-text={children}
    >
      {children}
    </div>
  );
};

export default GlitchText;
