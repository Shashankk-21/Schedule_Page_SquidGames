import React, { useState } from 'react';

export default function SplineHero() {
  const [loaded, setLoaded] = useState(false);
  const viewerUrl = "https://my.spline.design/squidgamelogo-PtuSbCgPXtb5oMnMgd9EKwvG/";

  return (
    <div className="w-full h-[400px] md:h-[500px] relative flex items-center justify-center -mb-20 z-10">
       {/* Loader Overlay */}
       {!loaded && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <div className="flex flex-col items-center gap-2">
            <div className="w-10 h-10 border-2 border-squid-pink border-t-transparent rounded-full animate-spin"></div>
            <span className="text-squid-pink font-orbitron text-xs tracking-widest">LOADING ASSETS...</span>
          </div>
        </div>
      )}

      <iframe
        src={viewerUrl}
        frameBorder="0"
        width="100%"
        height="100%"
        className="w-full h-full"
        onLoad={() => setLoaded(true)}
        title="Squid Game Spline Logo"
        style={{ pointerEvents: 'auto' }}
      />

      {/*
        Pointer events wrapper:
        The iframe captures mouse events. We might want to allow some pass-through or handle scrolling.
        For now, we let it be interactive as requested ("Interact with the mouse").
      */}
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_-40px_40px_rgba(6,6,8,0.8)]" />
    </div>
  );
}
