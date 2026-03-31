import { useState, useCallback } from "react";
import CRTScreen from "./CRTScreen";

const KNOB_POSITIONS = [0, 1, 2];
const KNOB_ROTATIONS = [-45, 0, 45];

export default function TVBody() {
  const [channelIndex, setChannelIndex] = useState(0);
  const [staticFlash, setStaticFlash] = useState(false);

  const switchChannel = useCallback((newIndex: number) => {
    if (newIndex === channelIndex) return;
    setStaticFlash(true);
    setTimeout(() => {
      setChannelIndex(newIndex);
      setStaticFlash(false);
    }, 150);
  }, [channelIndex]);

  const handleChannelKnob = () => {
    const next = (channelIndex + 1) % 3;
    switchChannel(next);
  };

  return (
    <div className="flex flex-col items-center">
      {/* Antenna */}
      <div className="relative w-48 h-20 mb-[-8px] z-10">
        {/* Left antenna */}
        <div
          className="absolute bottom-0 left-1/2 w-1 bg-gradient-to-t from-tv-body-dark to-muted-foreground/60 rounded-full origin-bottom"
          style={{ height: "70px", transform: "translateX(-20px) rotate(-18deg)" }}
        />
        {/* Right antenna */}
        <div
          className="absolute bottom-0 left-1/2 w-1 bg-gradient-to-t from-tv-body-dark to-muted-foreground/60 rounded-full origin-bottom"
          style={{ height: "80px", transform: "translateX(15px) rotate(8deg)" }}
        />
        {/* Antenna tips */}
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-muted-foreground/50"
          style={{ top: "2px", left: "calc(50% - 48px)" }}
        />
        <div
          className="absolute w-2.5 h-2.5 rounded-full bg-muted-foreground/50"
          style={{ top: "-8px", left: "calc(50% + 20px)" }}
        />
      </div>

      {/* TV Body */}
      <div className="tv-plastic rounded-[28px] p-5 sm:p-7 shadow-[0_8px_30px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.3)] relative">
        {/* Inner bezel */}
        <div className="bg-tv-bezel rounded-[18px] p-3 sm:p-4 shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
          {/* Screen container */}
          <div className="relative w-[320px] h-[240px] sm:w-[520px] sm:h-[380px] md:w-[620px] md:h-[440px] overflow-hidden rounded-[14px]">
            {/* Channel switch static */}
            {staticFlash && (
              <div className="absolute inset-0 static-flash z-40 rounded-[14px]" />
            )}
            <CRTScreen channelIndex={channelIndex} />
          </div>
        </div>

        {/* Bottom panel */}
        <div className="flex items-center justify-between mt-4 px-2">
          {/* Brand name */}
          <div className="font-ui text-tv-body-dark text-xs sm:text-sm tracking-[0.2em] uppercase select-none"
            style={{ textShadow: "0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.1)" }}>
            STEVE-TRON 3000
          </div>

          {/* Controls */}
          <div className="flex items-center gap-4 sm:gap-6">
            {/* Power light */}
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500 power-light" />

            {/* Channel indicator */}
            <div className="flex items-center gap-1 font-ui text-tv-bezel text-[10px] sm:text-xs">
              {KNOB_POSITIONS.map((i) => (
                <span
                  key={i}
                  className={`w-4 h-4 sm:w-5 sm:h-5 flex items-center justify-center rounded-sm transition-colors ${
                    i === channelIndex
                      ? "bg-tv-bezel text-tv-body font-bold"
                      : "bg-tv-body-dark/30 text-tv-body-dark"
                  }`}
                >
                  {i + 1}
                </span>
              ))}
            </div>

            {/* Volume knob (decorative) */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-ui text-[8px] sm:text-[9px] text-tv-body-dark uppercase tracking-wider">VOL</span>
              <div
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tv-bezel shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center cursor-pointer"
              >
                <div className="w-0.5 h-3 sm:h-4 bg-tv-body-dark/50 rounded-full" style={{ transform: "rotate(30deg)" }} />
              </div>
            </div>

            {/* Channel knob */}
            <div className="flex flex-col items-center gap-1">
              <span className="font-ui text-[8px] sm:text-[9px] text-tv-body-dark uppercase tracking-wider">CH</span>
              <button
                onClick={handleChannelKnob}
                className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-tv-bezel shadow-[0_2px_4px_rgba(0,0,0,0.3),inset_0_1px_2px_rgba(255,255,255,0.1)] flex items-center justify-center cursor-pointer hover:shadow-[0_2px_6px_rgba(0,0,0,0.4)] active:shadow-[0_1px_2px_rgba(0,0,0,0.3)] transition-shadow"
              >
                <div
                  className="w-0.5 h-3 sm:h-4 bg-tv-body-dark/50 rounded-full knob-snap"
                  style={{ transform: `rotate(${KNOB_ROTATIONS[channelIndex]}deg)` }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* TV Legs */}
      <div className="flex gap-40 sm:gap-60 md:gap-72 mt-[-4px]">
        <div className="w-3 h-6 bg-tv-body-dark rounded-b-md shadow-md" style={{ transform: "perspective(100px) rotateX(-5deg)" }} />
        <div className="w-3 h-6 bg-tv-body-dark rounded-b-md shadow-md" style={{ transform: "perspective(100px) rotateX(-5deg)" }} />
      </div>
    </div>
  );
}
