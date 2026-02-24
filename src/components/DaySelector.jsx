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
    <div className="flex justify-center gap-4 md:gap-12 mb-16 px-4">
      {days.map((day) => {
        const isActive = selectedDay === day.id;
        const ShapeIcon = day.icon;

        return (
          <button
            key={day.id}
            onClick={() => onSelectDay(day.id)}
            className={twMerge(
              "relative group flex flex-col items-center gap-3 transition-all duration-500 focus:outline-none",
              isActive ? "text-squid-pink scale-110" : "text-gray-600 hover:text-squid-teal hover:scale-105"
            )}
          >
            <div className="relative p-2">
              <ShapeIcon
                className={twMerge(
                  "w-10 h-10 md:w-14 md:h-14 stroke-[1.5] transition-all duration-500",
                  isActive
                    ? "fill-squid-pink/20 stroke-squid-pink drop-shadow-[0_0_15px_rgba(237,27,118,0.6)]"
                    : "stroke-current opacity-70 group-hover:stroke-squid-teal group-hover:drop-shadow-[0_0_8px_rgba(36,159,156,0.6)]"
                )}
              />

              {isActive && (
                <motion.div
                  layoutId="active-glow"
                  className="absolute inset-0 bg-squid-pink rounded-full blur-xl opacity-30"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.3 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              )}
            </div>

            <span className={twMerge(
              "font-orbitron tracking-[0.2em] text-xs md:text-sm uppercase transition-colors duration-300",
              isActive ? "text-squid-pink font-bold" : "text-gray-500 group-hover:text-squid-teal"
            )}>
              {day.label}
            </span>

            {/* Underline Indicator */}
            {isActive && (
              <motion.div
                layoutId="active-underline"
                className="absolute -bottom-2 left-0 right-0 h-0.5 bg-squid-pink shadow-[0_0_10px_rgba(237,27,118,1)]"
              />
            )}
          </button>
        );
      })}
    </div>
  );
};

export default DaySelector;
