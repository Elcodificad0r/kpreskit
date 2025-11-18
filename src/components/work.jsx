import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const TRACKS = [
  {
    id: 1,
    img: `${import.meta.env.BASE_URL}img/cassette1.webp`,
    url: "https://api.soundcloud.com/tracks/2208278441"
  },
  {
    id: 2,
    img: `${import.meta.env.BASE_URL}img/cassette2.webp`,
    url: "https://api.soundcloud.com/tracks/1234567890"
  },
  {
    id: 3,
    img: `${import.meta.env.BASE_URL}img/cassette3.webp`,
    url: "https://api.soundcloud.com/tracks/9876543210"
  }
];

export default function Work() {
  const [current, setCurrent] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const iframeRef = useRef(null);
  const widgetRef = useRef(null);

  const isMobile = window.innerWidth <= 768;

  useEffect(() => {
    if (iframeRef.current) {
      widgetRef.current = window.SC.Widget(iframeRef.current);

      widgetRef.current.bind(window.SC.Widget.Events.PLAY_PROGRESS, (e) => {
        if (!e.duration || e.duration === 0) return;

        let p = (e.currentPosition / e.duration) * 100;
        if (p < 0) p = 0;
        if (p > 100) p = 100;

        setProgress(p);
      });

      widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
        widgetRef.current.getDuration((d) => setDuration(d));
      });
    }
  }, []);

  const loadTrack = (track) => {
    setCurrent(track);
    setProgress(0);

    widgetRef.current.load(track.url, {
      auto_play: true,
      buying: false,
      liking: false,
      download: false,
      sharing: false,
      show_comments: false,
      show_playcount: false,
      show_user: false
    });

    widgetRef.current.play();
    setIsPlaying(true);
  };

  const togglePlay = () => {
    if (!widgetRef.current) return;

    if (isPlaying) {
      widgetRef.current.pause();
      setIsPlaying(false);
    } else {
      widgetRef.current.play();
      setIsPlaying(true);
    }
  };

  const next = () => {
    const i = TRACKS.findIndex((t) => t.id === current.id);
    const nextTrack = TRACKS[(i + 1) % TRACKS.length];
    loadTrack(nextTrack);
  };

  const prev = () => {
    const i = TRACKS.findIndex((t) => t.id === current.id);
    const prevTrack = TRACKS[(i - 1 + TRACKS.length) % TRACKS.length];
    loadTrack(prevTrack);
  };

  const setVolume = (v) => {
    widgetRef.current.setVolume(v * 100);
  };

  const seek = (value) => {
    if (!duration) return;
    const ms = (value / 100) * duration;
    widgetRef.current.seekTo(ms);
    setProgress(value);
  };

  /** --- PLAYER UI (glassmorphism) --- */
  const PlayerUI = (
    <div
      className="
      mt-10 flex flex-col items-center gap-6 
      px-6 py-6 rounded-2xl 
      backdrop-blur-2xl 
      bg-white/20 dark:bg-white/10 
      border border-white/30 dark:border-white/20
      shadow-xl
    "
    >
      <div className="flex items-center gap-12 text-black dark:text-white">
        <button onClick={prev}>
          <SkipBack size={36} className="text-black dark:text-white" />
        </button>

        <button onClick={togglePlay}>
          {isPlaying ? (
            <Pause size={50} className="text-black dark:text-white" />
          ) : (
            <Play size={50} className="text-black dark:text-white" />
          )}
        </button>

        <button onClick={next}>
          <SkipForward size={36} className="text-black dark:text-white" />
        </button>

        <div className="flex items-center gap-3">
          <Volume2 size={32} className="text-black dark:text-white" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            onChange={(e) => setVolume(e.target.value)}
            className="
              w-32 
              accent-black dark:accent-white 
              cursor-pointer
            "
          />
        </div>
      </div>

      {/* Progress bar */}
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={progress}
        onChange={(e) => seek(e.target.value)}
        className="
          w-[380px] h-2 rounded-full 
          bg-black/30 dark:bg-white/20 
          accent-black dark:accent-white
          cursor-pointer
        "
      />
    </div>
  );

  return (
    <div id="work" className="flex flex-col items-center pt-24 pb-24 transition-all duration-700">

        {/* --- CTA pequeño elegante --- */}
<p className="mt-6 mb-4 text-center leading-tight text-[15px] md:text-base font-geistLight opacity-80">
  Da clic en una cinta para{" "}
  <span className="font-estonia text-[19px] md:text-xl tracking-wide">
    escuchar
  </span>{" "}
  los live sets de{" "}
  <span className="font-majorMono tracking-tight text-base md:text-lg">
    Lu
    <span className="font-estonia lowercase text-lg md:text-xl align-baseline">
      n
    </span>
    <span className="font-majorMono">ARA</span>
  </span>
</p>


      {/* --- Cassettes --- */}
      <div
        className={`
        flex flex-col md:flex-row 
        gap-8 md:gap-16 
        mt-10

        ${!isMobile && current ? "md:mb-20" : ""} 
      `}
      >
        {TRACKS.map((t) => (
          <div key={t.id} className="flex flex-col items-center">
            <div
              onClick={() => loadTrack(t)}
              className={`
                cursor-pointer select-none
                w-[230px] h-[330px] 
                md:w-[260px] md:h-[360px]
                rounded-2xl overflow-hidden
                transition-all duration-500 ease-out

                ${
                  current?.id === t.id
                    ? "scale-125 shadow-2xl backdrop-blur-2xl bg-white/20 dark:bg-white/10 animate-[pulse_6s_ease_infinite]"
                    : "hover:scale-[1.30] hover:shadow-2xl"
                }

                ${current && current.id !== t.id ? "md:translate-x-2" : ""}
              `}
              style={{
                background:
                  current?.id === t.id
                    ? "linear-gradient(135deg, rgba(255,165,140,0.35), rgba(235,140,150,0.35))"
                    : "transparent"
              }}
            >
              <img
                src={t.img}
                className="w-full h-full object-contain transition-all duration-500 opacity-95"
              />
            </div>

            {/* Mobile: player under selected cassette */}
            {isMobile && current?.id === t.id && PlayerUI}
          </div>
        ))}
      </div>

      

      {/* Desktop: player below all */}
      {!isMobile && current && PlayerUI}

      <iframe
        ref={iframeRef}
        width="0"
        height="0"
        style={{ display: "none" }}
        src="https://w.soundcloud.com/player/?url="
        allow="autoplay"
      ></iframe>
    </div>
  );
}
