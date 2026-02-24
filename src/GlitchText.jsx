import './schedule.css';

const GlitchText = ({
  children,
  speed        = 1,
  enableShadows= true,
  enableOnHover= false,
  className    = '',
  style        = {},
}) => {
  const inlineStyles = {
    '--after-dur':    `${speed * 3}s`,
    '--before-dur':   `${speed * 2}s`,
    '--after-shadow':  enableShadows ? '-5px 0 #ff0050' : 'none',
    '--before-shadow': enableShadows ? ' 5px 0 #00fff0' : 'none',
    ...style,
  };
  return (
    <div
      className={`glitch${enableOnHover ? ' hover-only' : ''} ${className}`}
      style={inlineStyles}
      data-text={children}
    >
      {children}
    </div>
  );
};
export default GlitchText;
