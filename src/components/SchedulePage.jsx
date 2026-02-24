import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import GlitchText from './GlitchText';
import DaySelector from './DaySelector';
import EventCard from './EventCard';
import Background3D from './Background3D';

// Mock Data
const allEvents = [
  // Day 0
  { id: "e01", eventName: "Rang De Radiant (Valorant)", day: "Day 0", category: "E-Sports", venue: "IT Block (DT-2)", startTime: "10:00 AM", endTime: "01:00 PM" },
  { id: "e02", eventName: "Meme Mandali", day: "Day 0", category: "Dramatics", venue: "A1-32", startTime: "11:00 AM", endTime: "01:00 PM" },
  { id: "e03", eventName: "Swaroop (Solo Ramp Walk)", day: "Day 0", category: "Fashion", venue: "Auditorium", startTime: "01:00 PM", endTime: "03:00 PM" },
  { id: "e04", eventName: "Nukkad Natak", day: "Day 0", category: "Specials", venue: "Quadrangle", startTime: "05:00 PM", endTime: "05:30 PM" },

  // Day 1
  { id: "e11", eventName: "Code Red (Hackathon)", day: "Day 1", category: "Tech", venue: "Main Lab", startTime: "09:00 AM", endTime: "09:00 PM" },
  { id: "e12", eventName: "Robo Wars", day: "Day 1", category: "Robotics", venue: "Arena", startTime: "11:00 AM", endTime: "02:00 PM" },
  { id: "e13", eventName: "Battle of Bands", day: "Day 1", category: "Music", venue: "Open Air Stage", startTime: "04:00 PM", endTime: "07:00 PM" },
  { id: "e14", eventName: "Neon Night", day: "Day 1", category: "Social", venue: "Grounds", startTime: "08:00 PM", endTime: "11:00 PM" },

  // Day 2
  { id: "e21", eventName: "Circuit Breaker", day: "Day 2", category: "Tech", venue: "Lab 2", startTime: "10:00 AM", endTime: "01:00 PM" },
  { id: "e22", eventName: "Cosplay Contest", day: "Day 2", category: "Fashion", venue: "Auditorium", startTime: "02:00 PM", endTime: "05:00 PM" },
  { id: "e23", eventName: "Grand Finale", day: "Day 2", category: "Specials", venue: "Main Auditorium", startTime: "06:00 PM", endTime: "10:00 PM" },
];

const SchedulePage = () => {
  const [selectedDay, setSelectedDay] = useState("Day 0");

  const currentDay = "Day 0";
  const currentTimeMinutes = 12 * 60 + 30; // 12:30 PM

  // Helper to parse "10:00 AM" to minutes
  const parseTime = (timeStr) => {
    const [time, period] = timeStr.split(' ');
    let [hours, minutes] = time.split(':').map(Number);
    if (period === 'PM' && hours !== 12) hours += 12;
    if (period === 'AM' && hours === 12) hours = 0;
    return hours * 60 + minutes;
  };

  const getStatus = (event) => {
    // If different day
    if (event.day !== currentDay) {
       // Assuming Day 0 < Day 1 < Day 2
       return event.day > currentDay ? 'upcoming' : 'ended';
    }

    const start = parseTime(event.startTime);
    const end = parseTime(event.endTime);

    if (currentTimeMinutes >= start && currentTimeMinutes < end) return 'live';
    if (currentTimeMinutes >= end) return 'ended';
    return 'upcoming';
  };

  const displayEvents = [...allEvents];
  const filteredEvents = displayEvents.filter(e => e.day === selectedDay);

  return (
    <div className="min-h-screen relative overflow-hidden text-white">

        {/* 3D Background Layer */}
        <Background3D />

        {/* Content Layer */}
        <div className="relative z-10 p-4 md:p-8 min-h-screen overflow-y-auto">
            <div className="fixed top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-squid-pink to-transparent opacity-50" />

            <div className="max-w-7xl mx-auto">
               {/* Header */}
               <div className="text-center mb-16 mt-12">
                 <GlitchText text="SCHEDULE" className="mb-2" />
                 <div className="flex items-center justify-center gap-4 mt-4 opacity-80 mix-blend-screen">
                    <span className="h-[1px] w-12 bg-squid-teal box-glow-teal"></span>
                    <p className="text-squid-teal font-rajdhani tracking-[0.4em] uppercase text-sm md:text-base text-glow-teal">
                      The Games Begin • AURA 2026
                    </p>
                    <span className="h-[1px] w-12 bg-squid-teal box-glow-teal"></span>
                 </div>
               </div>

               {/* Day Selector */}
               <DaySelector selectedDay={selectedDay} onSelectDay={setSelectedDay} />

               {/* Grid */}
               <motion.div
                 className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-fr pb-20"
               >
                 <AnimatePresence mode="popLayout">
                   {filteredEvents.map((event, index) => (
                     <motion.div
                       key={event.id}
                       layout
                       initial={{ opacity: 0, scale: 0.9, y: 30 }}
                       animate={{ opacity: 1, scale: 1, y: 0 }}
                       exit={{ opacity: 0, scale: 0.9, y: -20 }}
                       transition={{
                         duration: 0.4,
                         delay: index * 0.1,
                         ease: "easeOut"
                       }}
                     >
                       <EventCard event={event} status={getStatus(event)} />
                     </motion.div>
                   ))}
                 </AnimatePresence>
               </motion.div>

               {/* Footer / Empty State */}
               {filteredEvents.length === 0 && (
                 <div className="text-center text-gray-500 py-20 font-rajdhani backdrop-blur-sm bg-black/20 rounded-xl border border-white/5">
                   NO GAMES SCHEDULED
                 </div>
               )}
            </div>
        </div>
    </div>
  );
};

export default SchedulePage;
