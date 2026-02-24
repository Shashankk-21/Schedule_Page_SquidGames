import React from 'react';
import { motion } from 'framer-motion';
import { Circle, Triangle, Square } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const DaySelector = ({ selectedDay, onSelectDay }) => {
  const days = [
    { id: 'Day 0', label: 'Day 0', icon: Circle },
    { id: 'Day 1', label: 'Day 1', icon: Triangle },
    { id: 'Day 2', label: 'Day 2', icon: Square },
  ];

  return (
    <div className="flex justify-center gap-6 md:gap-16 mb-20 px-4 relative z-10">
      {days.map((day) => {
        const isActive = selectedDay === day.id;
        const ShapeIcon = day.icon;

        return (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            className={twMerge(
              "relative group flex flex-col items-center gap-4 transition-all duration-500 focus:outline-none",
              isActive ? "scale-110" : "hover:scale-105"
            )}
          >
            <div className="relative p-3">
              <ShapeIcon
                className={twMerge(
                  "w-12 h-12 md:w-16 md:h-16 stroke-[2] transition-all duration-500",
                  isActive
                    ? "text-squid-pink drop-shadow-[0_0_15px_rgba(237,27,118,0.8)] fill-squid-pink/10"
                    : "text-gray-500 group-hover:text-squid-teal group-hover:drop-shadow-[0_0_10px_rgba(36,159,156,0.8)]"
                )}
              />

              {isActive && (
                <motion.div
                  layoutId="active-glow-bg"
                  className="absolute inset-0 bg-squid-pink/20 rounded-full blur-2xl"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.5 }}
                />
              )}
            </div>

            <span className={twMerge(
              "font-orbitron tracking-[0.2em] text-sm md:text-base uppercase transition-colors duration-300",
              isActive ? "text-squid-pink font-bold text-glow-pink" : "text-gray-500 group-hover:text-squid-teal group-hover:text-glow-teal"
            )}>
              {day.label}
            </span>

            {/* Underline Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-underline"
                className="absolute -bottom-4 w-full h-1 bg-squid-pink shadow-[0_0_10px_rgba(237,27,118,1)] rounded-full"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
