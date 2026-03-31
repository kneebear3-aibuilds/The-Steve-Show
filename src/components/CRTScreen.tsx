import { useState, useEffect, useCallback, useRef } from "react";
import { useTypewriter } from "@/hooks/useTypewriter";
import {
  channels,
  Segment,
  loadLiveData,
  generateHistorySegment,
  generateBreakingSegment,
  generateOracleSegment,
} from "@/data/channelContent";

interface CRTScreenProps {
  channelIndex: number;
}

const channelStyles = [
  { bg: "bg-ch1-bg", text: "text-ch1-text", accent: "text-ch1-accent", accentBg: "bg-ch1-accent", barBg: "bg-ch1-accent" },
  { bg: "bg-ch2-bg", text: "text-ch2-text", accent: "text-ch2-accent", accentBg: "bg-ch2-accent", barBg: "bg-ch2-accent" },
  { bg: "bg-ch3-bg", text: "text-ch3-text", accent: "text-ch3-accent", accentBg: "bg-ch3-accent", barBg: "bg-ch3-accent" },
];

export default function CRTScreen({ channelIndex }: CRTScreenProps) {
  const [segment, setSegment] = useState<Segment>(channels[channelIndex].segments[0]);
  const [staticFlash, setStaticFlash] = useState(false);
  const [gossipText, setGossipText] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [progressKey, setProgressKey] = useState(0);
  const dataLoadedRef = useRef(false);
  const SEGMENT_DURATION = 18000;
  const style = channelStyles[channelIndex];

  useEffect(() => {
    if (!dataLoadedRef.current) {
      dataLoadedRef.current = true;
      loadLiveData().then(() => generateNewSegment(channelIndex));
    }
  }, []);

  useEffect(() => {
    generateNewSegment(channelIndex);
  }, [channelIndex]);

  const { displayed, isDone } = useTypewriter(segment.text, 18);

  useEffect(() => {
    if (!isDone || isGenerating) return;
    const remaining = Math.max(2000, SEGMENT_DURATION - segment.text.length * 18);
    const timer = setTimeout(() => handleNext(), remaining);
    return () => clearTimeout(timer);
  }, [isDone, segment, isGenerating]);

  async function generateNewSegment(chIndex: number) {
    setIsGenerating(true);
    setProgressKey((k) => k + 1);
    try {
      let newSegment: Segment;
      if (chIndex === 0) {
        newSegment = await generateHistorySegment();
      } else if (chIndex === 2) {
        newSegment = await generateOracleSegment();
      } else {
        newSegment = channels[1].segments[0];
      }
      setSegment(newSegment);
    } catch (e) {
      setSegment(channels[chIndex].segments[0]);
    }
    setIsGenerating(false);
  }

  const handleNext = useCallback(() => {
    setStaticFlash(true);
    setTimeout(() => {
      setStaticFlash(false);
      generateNewSegment(channelIndex);
    }, 150);
  }, [channelIndex]);

  const handleSubmitGossip = async () => {
    if (!gossipText.trim() || isGenerating) return;
    setIsGenerating(true);
    setStaticFlash(true);
    const gossip = gossipText.trim();
    setGossipText("");
    setTimeout(async () => {
      setStaticFlash(false);
      const newSegment = await generateBreakingSegment(gossip);
      setSegment(newSegment);
      setProgressKey((k) => k + 1);
      setIsGenerating(false);
    }, 150);
  };

  const now = new Date();
  const timestamp = now.toLocaleTimeString("en-US", { hour12: false });

  return (
    <div className={`relative w-full h-full ${style.bg} overflow-hidden crt-curve screen-flicker`}>
      <div className="absolute inset-0 crt-scanlines z-20" />
      <div className="absolute inset-0 crt-vignette z-20" />
      {staticFlash && <div className="absolute inset-0 static-flash z-30" />}

      <div className={`relative z-10 flex flex-col h-full p-4 sm:p-6 font-screen ${style.text}`}>
        {/* Top bar */}
        <div className="flex items-center justify-between text-sm sm:text-base tracking-wider mb-3">
          <span className="uppercase font-bold">CH {channelIndex + 1} — {channels[channelIndex].name}</span>
          <span className="live-blink flex items-center gap-1.5">
            <span className="inline-block w-2 h-2 rounded-full bg-red-500" />
            {isGenerating ? "LOADING" : "LIVE"}
          </span>
          <span className="opacity-70">{timestamp}</span>
        </div>

        {/* Segment label */}
        <div className={`text-xs sm:text-sm uppercase tracking-[0.3em] mb-4 ${style.accent}`}>
          ▸ {isGenerating ? "RECEIVING TRANSMISSION..." : segment.label}
        </div>

        {/* Main text */}
        <div className="flex-1 flex items-start overflow-y-auto">
          {isGenerating ? (
            <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed opacity-40">
              <span className="animate-pulse">▊ ▊ ▊</span>
            </p>
          ) : (
            <p className="text-xl sm:text-2xl md:text-3xl leading-relaxed whitespace-pre-line"
              style={{ textShadow: "0 0 6px currentColor" }}>
              {displayed}
              {!isDone && <span className="animate-pulse">▊</span>}
            </p>
          )}
        </div>

        {/* CH2 gossip input */}
        {channelIndex === 1 && (
          <div className="flex gap-2 mb-3 mt-2">
            <input
              type="text"
              value={gossipText}
              onChange={(e) => setGossipText(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter") handleSubmitGossip(); }}
              placeholder="What's the gossip?"
              disabled={isGenerating}
              className="flex-1 px-3 py-2 bg-ch2-bg border-2 border-ch2-accent text-ch2-text font-screen text-lg placeholder:text-ch2-text/40 outline-none focus:border-ch2-text disabled:opacity-40"
            />
            <button
              onClick={handleSubmitGossip}
              disabled={isGenerating || !gossipText.trim()}
              className="px-4 py-2 bg-ch2-accent text-ch2-bg font-screen text-lg font-bold uppercase tracking-wider hover:brightness-110 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isGenerating ? "..." : "TRANSMIT"}
            </button>
          </div>
        )}

        {/* Bottom bar */}
        <div className="flex items-center justify-between text-xs sm:text-sm mt-2">
          <span className="opacity-60 uppercase tracking-wider truncate max-w-[50%]">
            SRC: {segment.source}
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={handleNext}
              disabled={isGenerating}
              className={`px-3 py-1 text-xs uppercase tracking-widest font-bold border ${style.accent} border-current hover:brightness-125 active:scale-95 transition-all disabled:opacity-40`}
            >
              NEXT ▸
            </button>
            <div className="w-24 sm:w-32 h-1.5 bg-current/20 rounded overflow-hidden">
              <div
                key={progressKey}
                className={`h-full ${style.barBg} rounded`}
                style={{ animation: `progress-fill ${SEGMENT_DURATION}ms linear forwards` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
