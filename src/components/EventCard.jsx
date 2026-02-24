import React from 'react';
import SpotlightCard from './SpotlightCard';
import { Clock, MapPin, Play, Circle, Triangle, Square } from 'lucide-react';
import { twMerge } from 'tailwind-merge';

const ShapeWatermark = ({ type }) => {
  const style = "absolute -right-10 -bottom-10 w-48 h-48 text-white/5 opacity-[0.1] pointer-events-none transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 mix-blend-overlay";
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
        "group h-full transition-all duration-500 hover:-translate-y-2",
        // Default Glass State
        "bg-black/40 backdrop-blur-md border-white/5 hover:bg-black/50 hover:border-white/20 hover:shadow-2xl",
        isLive
          ? "border-squid-teal/50 box-glow-teal bg-squid-teal/10 hover:bg-squid-teal/20"
          : "",
        isEnded ? "border-red-900/20 bg-black/60 opacity-60 hover:border-red-900/30 hover:shadow-none hover:translate-y-0" : ""
      )}
      spotlightColor={isLive ? "rgba(36, 159, 156, 0.4)" : "rgba(237, 27, 118, 0.3)"}
    >
      <div className={twMerge("relative p-6 md:p-8 flex flex-col h-full z-20 overflow-hidden", isEnded && "grayscale contrast-125")}>

        {/* Header: Category & Time */}
        <div className="flex justify-between items-center mb-6 relative z-10">
          <span className={twMerge(
            "text-xs md:text-sm font-rajdhani font-bold tracking-widest px-3 py-1.5 rounded-sm uppercase border backdrop-blur-sm",
            isLive
              ? "bg-squid-teal/20 border-squid-teal text-squid-teal shadow-[0_0_10px_rgba(36,159,156,0.3)]"
              : "bg-white/5 border-white/10 text-squid-pink border-squid-pink/20"
          )}>
            {event.category}
          </span>
          {isLive && (
            <span className="animate-pulse text-squid-teal font-bold text-xs tracking-[0.2em] flex items-center gap-2 drop-shadow-[0_0_5px_rgba(36,159,156,0.8)]">
              <span className="w-2.5 h-2.5 rounded-full bg-squid-teal animate-ping"></span>
              LIVE
            </span>
          )}
        </div>

        {/* Event Name */}
        <h3 className={twMerge(
          "text-2xl md:text-3xl font-orbitron font-bold text-white mb-4 leading-none transition-colors duration-300 drop-shadow-md",
          !isEnded && "group-hover:text-squid-pink group-hover:text-glow-pink"
        )}>
          {event.eventName}
        </h3>

        {/* Details */}
        <div className="mt-auto space-y-3 text-sm md:text-base text-gray-300 font-rajdhani tracking-wide relative z-10">
          <div className="flex items-center gap-3 transition-colors duration-300 group-hover:text-white">
            <Clock className="w-5 h-5 text-squid-pink" />
            <span className="font-mono">{event.startTime} - {event.endTime}</span>
          </div>
          <div className="flex items-center gap-3 transition-colors duration-300 group-hover:text-white">
            <MapPin className="w-5 h-5 text-squid-pink" />
            <span>{event.venue}</span>
          </div>
        </div>

        {/* "Play" CTA on Hover (only if not ended) */}
        {!isEnded && (
          <div className="absolute bottom-6 right-6 opacity-0 translate-x-4 transition-all duration-500 group-hover:opacity-100 group-hover:translate-x-0">
             <div className="p-3 rounded-full bg-squid-pink text-white shadow-[0_0_15px_rgba(237,27,118,0.6)] animate-pulse hover:scale-110 transition-transform">
               <Play className="w-6 h-6 fill-current" />
             </div>
          </div>
        )}

        {/* Watermark Shape */}
        <ShapeWatermark type={shape} />
      </div>

      {/* Eliminated Overlay */}
      {isEnded && (
        <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none select-none">
          <div className="relative transform rotate-[-15deg]">
             <div className="absolute inset-0 bg-black/60 blur-xl scale-150"></div>
             <div className="relative border-[6px] border-squid-pink-alt px-6 py-2 rounded-lg mix-blend-hard-light animate-pulse backdrop-blur-sm">
               <span className="text-squid-pink-alt font-black text-4xl md:text-6xl tracking-tighter font-saira uppercase drop-shadow-[0_0_10px_rgba(255,0,80,0.8)]">
                 ELIMINATED
               </span>
             </div>
          </div>
          {/* Rough strikethrough */}
          <div className="absolute top-1/2 left-0 w-full h-1 bg-squid-pink-alt/60 rotate-[-15deg] blur-sm shadow-[0_0_10px_rgba(255,0,80,1)]"></div>
        </div>
      )}
    </SpotlightCard>
  );
};

export default EventCard;
