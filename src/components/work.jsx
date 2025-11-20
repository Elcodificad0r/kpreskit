import React, { useEffect, useRef, useState } from "react";
import { Play, Pause, SkipBack, SkipForward, Volume2 } from "lucide-react";

const TRACKS = [
  {
    id: 1,
    img: `${import.meta.env.BASE_URL}img/cassette1.webp`,
    url: "https://soundcloud.com/grecia-valadez-583436482/grex-lunara-b2b-sordeado-2308"
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
        if (!e.duration) return;
        let p = (e.currentPosition / e.duration) * 100;
        setProgress(Math.min(Math.max(p, 0), 100));
      });

      widgetRef.current.bind(window.SC.Widget.Events.PLAY, () => {
        widgetRef.current.getDuration((d) => setDuration(d));
      });
    }
  }, []);

  const loadTrack = (track) => {
    setCurrent(track);
    setProgress(0);

    // 🔓 Desbloqueo de audio en mobile
    try {
      widgetRef.current.play();
      widgetRef.current.pause();
    } catch {}

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
    isPlaying ? widgetRef.current.pause() : widgetRef.current.play();
    setIsPlaying(!isPlaying);
  };

  const next = () => {
    const i = TRACKS.findIndex((t) => t.id === current.id);
    loadTrack(TRACKS[(i + 1) % TRACKS.length]);
  };

  const prev = () => {
    const i = TRACKS.findIndex((t) => t.id === current.id);
    loadTrack(TRACKS[(i - 1 + TRACKS.length) % TRACKS.length]);
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

  /** --- PLAYER UI --- */
  const PlayerUI = (
    <div
      className="
        mt-10 flex flex-col items-center gap-6 
        px-6 py-6 rounded-2xl 
        backdrop-blur-2xl 
        bg-white/20 dark:bg-white/10 
        border border-white/30 dark:border-white/20
        shadow-xl
        w-[360px] md:w-auto transform-gpu
      "
      style={{ marginTop: isMobile ? "3.5rem" : "0" }}
    >
      <div className="flex items-center gap-8 md:gap-12 text-black">

        <button onClick={prev} aria-label="prev">
          <SkipBack className="w-6 h-6 md:w-9 md:h-9 text-black" />
        </button>

        <button onClick={togglePlay} aria-label="play-pause">
          {isPlaying ? (
            <Pause className="w-8 h-8 md:w-12 md:h-12 text-black" />
          ) : (
            <Play className="w-8 h-8 md:w-12 md:h-12 text-black" />
          )}
        </button>

        <button onClick={next} aria-label="next">
          <SkipForward className="w-6 h-6 md:w-9 md:h-9 text-black" />
        </button>

        <div className="flex items-center gap-3">
          <Volume2 className="w-5 h-5 md:w-8 md:h-8 text-black" />
          <input
            type="range"
            min={0}
            max={1}
            step={0.01}
            defaultValue={1}
            onChange={(e) => setVolume(e.target.value)}
            className="w-24 md:w-32 accent-black cursor-pointer"
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
          w-full md:w-[380px] h-2 rounded-full 
          bg-black/30 
          accent-black
          cursor-pointer
        "
      />
    </div>
  );

  return (
    <div id="work" className="flex flex-col items-center pt-24 pb-24">

      <p className="mt-6 mb-4 text-center leading-tight text-[15px] md:text-base font-geistLight opacity-80">
        Da clic en una cinta para{" "}
        <span className="font-estonia text-[19px] md:text-xl tracking-wide">
          escuchar
        </span>{" "}
        los live sets de{" "}
        <span className="font-majorMono tracking-tight text-base md:text-lg">
          Lu
          <span className="font-estonia lowercase text-lg md:text-xl align-baseline">n</span>
          <span className="font-majorMono">ARA</span>
        </span>
      </p>

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

            {isMobile && current?.id === t.id && PlayerUI}
          </div>
        ))}
      </div>

      {!isMobile && current && PlayerUI}

      <iframe
  ref={iframeRef}
  width="1"
  height="1"
  style={{
    opacity: 0,
    pointerEvents: "none",
    position: "absolute",
    left: 0,
    top: 0,
  }}
  src="https://w.soundcloud.com/player/?url="
  allow="autoplay; encrypted-media"
></iframe>

    </div>
  );
}
