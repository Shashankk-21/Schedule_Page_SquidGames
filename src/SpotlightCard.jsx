import { useRef } from 'react';
import './schedule.css';

const SpotlightCard = ({
  children,
  className      = '',
  spotlightColor = 'rgba(255, 0, 80, 0.12)',
}) => {
  const ref = useRef(null);

  const handleMouseMove = (e) => {
    const el = ref.current;
    const rect = el.getBoundingClientRect();
    el.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
    el.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
    el.style.setProperty('--spotlight-color', spotlightColor);
  };

  return (
    <div ref={ref} onMouseMove={handleMouseMove} className={`card-spotlight ${className}`}>
      {children}
    </div>
  );
};
export default SpotlightCard;
