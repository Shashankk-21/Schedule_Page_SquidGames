import React from 'react';
import SpotlightCard from './SpotlightCard';
import { Clock, MapPin, Tag, Circle, Triangle, Square } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

const ShapeWatermark = ({ type }) => {
  const style = "absolute -right-8 -bottom-8 w-40 h-40 text-white/5 opacity-[0.03] pointer-events-none";
  switch (type) {
    case 'circle': return <Circle className={style} />;
    case 'triangle': return <Triangle className={style} />;
    case 'square': return <Square className={style} />;
    default: return <Circle className={style} />;
  }
};

const EventCard = ({ event, status }) => {
  const isLive = status === 'live';
  const isEnded = status === 'ended';

  // Randomly assign a shape based on event ID for consistency
  const shapes = ['circle', 'triangle', 'square'];
  const shapeIndex = event.id.charCodeAt(event.id.length - 1) % 3;
  const shape = shapes[shapeIndex];

  return (
    <SpotlightCard
      className={twMerge(
        "h-full transition-all duration-500",
        isLive ? "border-squid-teal/50 shadow-[0_0_20px_rgba(36,159,156,0.15)] bg-squid-black/80" : "border-white/10 hover:border-squid-pink/50 bg-neutral-900/40",
        isEnded ? "border-red-900/30" : ""
      )}
      spotlightColor={isLive ? "rgba(36, 159, 156, 0.2)" : "rgba(237, 27, 118, 0.15)"}
    >
      <div className={twMerge("relative p-6 flex flex-col h-full z-20", isEnded && "opacity-40 grayscale")}>

        {/* Header: Category & Time */}
        <div className="flex justify-between items-start mb-4">
          <span className={twMerge(
            "text-xs font-rajdhani font-semibold tracking-wider px-2 py-1 rounded",
            isLive ? "bg-squid-teal text-black" : "bg-white/10 text-squid-pink"
          )}>
            {event.category}
          </span>
          {isLive && (
            <span className="animate-pulse text-squid-teal font-bold text-xs tracking-widest flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-squid-teal inline-block"></span>
              LIVE
            </span>
          )}
        </div>

        {/* Event Name */}
        <h3 className="text-xl md:text-2xl font-orbitron font-bold text-white mb-2 leading-tight">
          {event.eventName}
        </h3>

        {/* Details */}
        <div className="mt-auto space-y-2 text-sm text-gray-400 font-rajdhani">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-squid-pink" />
            <span>{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-squid-pink" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* Watermark Shape */}
        <ShapeWatermark type={shape} />
      </div>

      {/* Eliminated Overlay */}
      {isEnded && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none overflow-hidden">
          <div className="relative">
             <div className="absolute inset-0 bg-squid-black/50 backdrop-blur-[1px]"></div>
             <div className="text-squid-pink-alt font-bold text-3xl md:text-4xl -rotate-12 border-4 border-squid-pink-alt px-4 py-2 rounded opacity-80 uppercase font-orbitron tracking-widest">
               ELIMINATED
             </div>
          </div>
          {/* Strikethrough effect */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-squid-pink-alt/50 -rotate-12 transform translate-y-1"></div>
        </div>
      )}
    </SpotlightCard>
  );
};

export default EventCard;
