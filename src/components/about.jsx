import React, { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

/**
 * IMPORTA TUS IMÁGENES: about.png, about1.png ... about19.png
 * Asegúrate que están en src/assets/img/
 */
// Prefijo dinámico para LOCAL y para GH Pages (kpreskit)
const prefix = import.meta.env.BASE_URL || "/";


// Genera rutas a /public/img/aboutX.png
const IMAGES = Array.from({ length: 20 }, (_, i) => {
  return `${prefix}img/about${i === 0 ? "" : i}.png`;
});




export default function About() {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const imgRefs = useRef([]);
  const loopTween = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragState = useRef({ startX: 0, currentX: 0, offset: 0 });

  // Parallax text refs
  const parRefs = useRef([]);
  const textRefs = useRef([]);

  // micro-content (user supplied + extras)
  const paragraphs = {
    intro:
      "Original music mixes by Karen de Luna, conocida como Lunara. Originaria de Guadalajara, México, Lunara forma parte del colectivo sonido sordeado, donde ha construido un sonido propio que vive entre la nostalgia y el pulso nocturno. Su identidad sonora emerge de años explorando ritmos, texturas y atmósferas que se sienten tanto íntimas como expansivas.",
    intro2:
    "Creativa y llena de luz, se ha ganado un lugar dentro de la escena under fusionando culturas, participando en eventos privados, raves y presentaciones especiales- Su propuesta a pisado espacios como el rave sordeado y colaborando de manera especial con la marca Tim Hortons",
    genres:
      "DARK HOUSE. DEEP HOUSE. DISCO HOUSE. MELODIC TECHNO. INDIE DANCE. MINIMAL DEEP- HYPNOTIC GROOVES- LATE-NIGHT BEATS.",
    blurb:
      "experiencia sonora envolvente, un tránsito entre lo íntimo y lo expansivo. An enchanting musical experience with a timeless glow — mezclas que exploran capas profundas, pulsos elegantes y una narrativa musical que se siente atemporal.",
    sets:
      "Sets que iluminan la oscuridad con sutileza, creando un espacio donde el cuerpo se mueve sin pensar y la música marca su propio ritmo.",
  };

  useEffect(() => {
    imgRefs.current = imgRefs.current.slice(0, IMAGES.length * 2);

    const track = trackRef.current;
    const container = containerRef.current;
    if (!track || !container) return;

    // layout measurements
    let totalWidth = 0;
    const items = Array.from(track.querySelectorAll(".about-item"));
    items.forEach((it) => {
      totalWidth += it.offsetWidth + parseInt(getComputedStyle(it).marginRight || 20);
    });

    // If totalWidth is 0 (images not loaded), wait for images to load
    const imgs = track.querySelectorAll("img");
    let loaded = 0;
    imgs.forEach((img) => {
      if (img.complete) loaded++;
      else img.onload = () => {
        loaded++;
        if (loaded === imgs.length) initLoop();
      };
    });
    if (loaded === imgs.length) initLoop();

    function initLoop() {
      // recompute width
      const items2 = Array.from(track.querySelectorAll(".about-item"));
      const onePassWidth = items2.slice(0, items2.length / 2).reduce((sum, el) => sum + el.offsetWidth + parseInt(getComputedStyle(el).marginRight || 20), 0);

      // create loop tween: move -onePassWidth then reset
      if (loopTween.current) loopTween.current.kill();

      loopTween.current = gsap.to(track, {
        x: -onePassWidth,
        duration: 60, // slow infinite
        ease: "none",
        repeat: -1,
        modifiers: {
          x: (x) => {
            // keep numeric value, GSAP will handle negative overflow
            return x;
          },
        },
      });
    }

    // MOUSE INTERACTION: accelerate + repel
    const onMouseMove = (e) => {
      if (!track) return;
      const rect = container.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const center = rect.width / 2;
      const distanceToCenter = Math.abs(mouseX - center);
      // speed factor: closer to center -> faster
      const maxSpeed = 6; // times faster
      const factor = 1 + (1 - Math.min(distanceToCenter / center, 1)) * (maxSpeed - 1);
      if (loopTween.current) loopTween.current.timeScale(factor);

      // repel effect for each image: vertical offset and subtle scale
      const imgs = imgRefs.current;
      imgs.forEach((el) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const elCenter = r.left + r.width / 2 - rect.left;
        const dist = Math.abs(mouseX - elCenter);
        const repelStrength = Math.max(0, 120 - dist); // within 120px feel repel
        const y = - (repelStrength / 6); // up to ~ -20 px
        const s = 1 - Math.min(0.08, repelStrength / 1200); // tiny scale down
        gsap.to(el, { y, scale: s, duration: 0.35, ease: "power2.out" });
      });
    };

    const onMouseLeave = () => {
      if (loopTween.current) loopTween.current.timeScale(1);
      imgRefs.current.forEach((el) => {
        if (!el) return;
        gsap.to(el, { y: 0, scale: 1, duration: 0.6, ease: "power3.out" });
      });
    };

    container.addEventListener("mousemove", onMouseMove);
    container.addEventListener("mouseleave", onMouseLeave);

    // DRAG / TOUCH for mobile: pause loop and handle manual movement
    let pointerDown = false;
    const startDrag = (clientX) => {
      pointerDown = true;
      setIsDragging(true);
      if (loopTween.current) loopTween.current.pause();
      dragState.current.startX = clientX;
      dragState.current.offset = parseFloat(gsap.getProperty(track, "x")) || 0;
    };
    const moveDrag = (clientX) => {
      if (!pointerDown) return;
      const dx = clientX - dragState.current.startX;
      const nextX = dragState.current.offset + dx;
      gsap.set(track, { x: nextX });
    };
    const endDrag = () => {
      pointerDown = false;
      setIsDragging(false);
      if (loopTween.current) loopTween.current.play();
    };

    // mouse
    container.addEventListener("pointerdown", (e) => startDrag(e.clientX));
    window.addEventListener("pointermove", (e) => moveDrag(e.clientX));
    window.addEventListener("pointerup", endDrag);

    // touch
    container.addEventListener("touchstart", (e) => startDrag(e.touches[0].clientX), { passive: true });
    container.addEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX), { passive: true });
    container.addEventListener("touchend", endDrag);

    // cleanup
    return () => {
      container.removeEventListener("mousemove", onMouseMove);
      container.removeEventListener("mouseleave", onMouseLeave);
      container.removeEventListener("pointerdown", (e) => startDrag(e.clientX));
      window.removeEventListener("pointermove", (e) => moveDrag(e.clientX));
      window.removeEventListener("pointerup", endDrag);
      container.removeEventListener("touchstart", (e) => startDrag(e.touches[0].clientX));
      container.removeEventListener("touchmove", (e) => moveDrag(e.touches[0].clientX));
      container.removeEventListener("touchend", endDrag);
      if (loopTween.current) loopTween.current.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // FADE IN text elements on mount
  useEffect(() => {
    const texts = textRefs.current.filter(Boolean);
    gsap.fromTo(
      texts,
      { opacity: 0, y: 20 },
      {
        opacity: 1,
        y: 0,
        duration: 1.2,
        stagger: 0.08,
        ease: "power2.out",
        delay: 0.3,
      }
    );
  }, []);

  // PARALLAX for micro texts: simple RAF loop for performance
  useEffect(() => {
    const sections = parRefs.current;
    let rafId = null;

    const onScroll = () => {
      if (rafId) cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        const scrollY = window.scrollY || window.pageYOffset;
        sections.forEach((el, i) => {
          if (!el) return;
          const speed = (i % 3) * 0.15 + 0.05; // varying speeds
          const offset = (scrollY * speed) % 1000;
          // move and fade based on bounding rect
          const rect = el.getBoundingClientRect();
          const vanish = Math.max(0, Math.min(1, 1 - Math.abs(rect.top - window.innerHeight / 2) / (window.innerHeight)));
          el.style.transform = `translateY(${offset * (i % 2 === 0 ? -0.02 : 0.02)}px)`;
          el.style.opacity = `${0.35 + vanish * 0.65}`;
        });
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    // call once
    onScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  // helper to set refs
  const setImgRef = (el, idx) => (imgRefs.current[idx] = el);
  const setParRef = (el, idx) => (parRefs.current[idx] = el);
  const setTextRef = (el, idx) => (textRefs.current[idx] = el);

  return (
    <section id="about" className="w-full overflow-hidden relative bg-transparent">
      {/* CAROUSEL TOP */}
      <div
        ref={containerRef}
        className="w-full relative overflow-hidden"
        style={{ touchAction: "pan-y" }}
      >
        {/* track: we duplicate images to create seamless loop */}
        <div
          ref={trackRef}
          className="flex gap-6 items-center select-none"
          style={{ willChange: "transform", padding: "40px 80px" }}
        >
          {IMAGES.concat(IMAGES).map((src, idx) => (
            <div
              key={idx}
              className="about-item flex-shrink-0 rounded-xl overflow-hidden"
              style={{
                width: 280,
                height: 280,
                background: "transparent",
                boxShadow: "0 20px 40px rgba(0,0,0,0.12)",
                marginRight: 24,
              }}
              ref={(el) => setImgRef(el, idx)}
            >
              <img
                src={src}
                alt={`about-${idx}`}
                draggable={false}
                style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
              />
            </div>
          ))}
        </div>
      </div>

      {/* EDITORIAL LAYOUT (micro texts, centered image + labels) */}
      <div className="px-6 md:px-24 lg:px-40 py-16">
        <div className="max-w-[1400px] mx-auto">
          {/* top micro row */}
          <div className="flex justify-between items-center text-[12px] tracking-widest mb-6">
            <div ref={(el) => setTextRef(el, 0)} className="font-[var(--font-geist-light)] text-[11px] uppercase dark:text-darkAccent">
              Timeless <span className="font-[var(--font-geist-bold)]">Glow</span>
            </div>
            <div ref={(el) => setTextRef(el, 1)} className="font-majorMono text-[13px] dark:text-darkAccent">24</div>
            <div ref={(el) => setTextRef(el, 2)} className="font-[var(--font-geist-bold)] text-[12px] uppercase tracking-wider dark:text-darkAccent">Lunara</div>
            <div ref={(el) => setTextRef(el, 3)} className="font-majorMono text-[13px] dark:text-darkAccent">24</div>
            <div ref={(el) => setTextRef(el, 4)} className="font-[var(--font-geist-light)] text-[11px] uppercase dark:text-darkAccent">
              Timeless <span className="font-[var(--font-geist-bold)]">Glow</span>
            </div>
          </div>

          {/* central big title and image (editorial reference) - FIXED */}
          <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between md:gap-12">
            {/* LEFT COLUMN */}
            <div className="md:flex-1 flex flex-col gap-6 md:self-start">
              <div ref={(el) => setTextRef(el, 5)} className="text-[13px] font-majorMono tracking-wide dark:text-darkAccent">
                025 <span className="font-[var(--font-geist-light)] text-[11px]">TRACKS</span>
              </div>
              <div ref={(el) => setTextRef(el, 6)} className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-400 font-[var(--font-geist-light)]">
                {paragraphs.intro.split("Lunara").map((part, i) => (
                  <React.Fragment key={i}>
                    {part}
                    {i === 0 && <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">Lunara</span>}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* CENTER COLUMN - fixed width, centered, no shrink, z-index above siblings */}
            <div className="flex-shrink-0 w-full md:w-auto md:max-w-[620px] flex flex-col items-center justify-center text-center mx-auto z-10">
              <div ref={(el) => setTextRef(el, 7)} className="w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[520px] md:h-[520px] overflow-hidden rounded-sm">
                <img src={IMAGES[2]} alt="center" className="w-full h-full object-cover" />
              </div>

              <h2 ref={(el) => setTextRef(el, 8)} className="mt-8 text-5xl md:text-6xl lg:text-7xl font-majorMono tracking-tight text-black dark:text-darkAccent uppercase">
                Lu<span className="font-estonia lowercase text-6xl md:text-7xl lg:text-8xl">N</span>ARA
              </h2>

              <div ref={(el) => setTextRef(el, 9)} className="mt-6 text-[15px] font-[var(--font-geist-light)] leading-relaxed text-neutral-800 dark:text-neutral-400 text-center max-w-[800px] mx-auto">
                <span className="font-[var(--font-geist-bold)] uppercase tracking-wide text-black dark:text-darkAccent">experiencia sonora envolvente,</span> un tránsito entre lo íntimo y lo expansivo. <span className="italic font-estonia text-base">An enchanting musical experience with a timeless glow</span> — mezclas que exploran capas profundas, pulsos elegantes y una narrativa musical que se siente <span className="font-[var(--font-geist-bold)]">atemporal</span>.
              </div>
            </div>

            {/* RIGHT COLUMN */}
            <div className="md:flex-1 flex flex-col gap-6 md:self-start md:items-end">
              <div ref={(el) => setTextRef(el, 10)} className="text-[13px] font-majorMono tracking-wide dark:text-darkAccent">
                025 <span className="font-[var(--font-geist-light)] text-[11px]">TRACKS</span>
              </div>
              <div ref={(el) => setTextRef(el, 11)} className="text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-400 text-right font-[var(--font-geist-light)]">
                <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">Sets</span> que iluminan la oscuridad con sutileza, creando un espacio donde el cuerpo se mueve sin pensar y la música marca su propio <span className="italic font-estonia text-base">ritmo</span>.
              </div>
            </div>
          </div>

          {/* middle micro row */}
          <div ref={(el) => setTextRef(el, 12)} className="mt-12 text-center">
            <div className="uppercase tracking-[0.3em] font-[var(--font-geist-bold)] text-[13px] dark:text-darkAccent">
              SIDE <span className="font-majorMono text-base">A</span> — <span className="font-majorMono">31:09′</span>
            </div>

            <div className="mt-8 text-[13px] md:text-[14px] text-neutral-600 dark:text-neutral-400 max-w-3xl mx-auto font-[var(--font-geist-light)] leading-loose tracking-wide">
              <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">DARK HOUSE.</span> DEEP HOUSE. <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">DISCO HOUSE.</span> MELODIC TECHNO. <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">INDIE DANCE.</span> MINIMAL DEEP<span className="font-majorMono">—</span> HYPNOTIC GROOVES<span className="font-majorMono">—</span> <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">LATE-NIGHT BEATS.</span>
            </div>
          </div>

          {/* parallax micro texts scattered */}
          <div className="mt-20 relative">
            {/* create many floating micro snippets */}
            <div className="relative h-[260px]">
              {Array.from({ length: 12 }).map((_, i) => {
                const left = 5 + (i * 8) % 90;
                const top = 10 + (i * 14) % 180;
                return (
                  <div
                    key={i}
                    ref={(el) => setParRef(el, i)}
                    className="absolute text-[11px] md:text-xs font-[var(--font-geist-light)] text-neutral-700 dark:text-neutral-400 uppercase tracking-wider"
                    style={{
                      left: `${left}%`,
                      top: `${top}px`,
                      transform: "translateY(0)",
                      opacity: 0.6,
                      pointerEvents: "none",
                    }}
                  >
                    {["VINYL 1", "025 TRACKS", "TIMELESS SOUND", "UNKOWN SIDE — 4x:xx'", "SIDE B — 21:26'", "TIMELINE"][i % 6]}
                  </div>
                );
              })}
            </div>
          </div>

          {/* bottom editorial blocks */}
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div ref={(el) => setTextRef(el, 13)}>
              <h4 className="font-[var(--font-geist-bold)] text-[15px] uppercase tracking-[0.2em] dark:text-darkAccent">
                SIDE <span className="font-majorMono text-lg">B</span> — 21:26′
              </h4>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-400 font-[var(--font-geist-light)]">
                <span className="font-[var(--font-geist-bold)] uppercase tracking-wide text-black dark:text-darkAccent">experiencia sonora envolvente,</span> un tránsito entre lo íntimo y lo expansivo. <span className="italic font-estonia text-base">An enchanting musical experience</span> — mezclas que exploran capas profundas y una narrativa musical <span className="font-[var(--font-geist-bold)]">atemporal</span>.
              </p>
            </div>

            <div ref={(el) => setTextRef(el, 14)} className="text-center">
              <h4 className="font-majorMono text-[16px] dark:text-darkAccent">
                VINYL <span className="font-[var(--font-geist-bold)] text-2xl">25</span>
              </h4>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-400 font-[var(--font-geist-light)]">
                <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">Creativa y llena de luz,</span> se ha ganado un lugar dentro de la escena under fusionando culturas, participando en <span className="italic font-estonia text-base">eventos privados, raves</span> y presentaciones especiales.
              </p>
            </div>

            <div ref={(el) => setTextRef(el, 15)} className="text-right">
              <h4 className="font-[var(--font-geist-bold)] text-[15px] uppercase tracking-[0.2em] dark:text-darkAccent">
                UNKOWN SIDE — <span className="font-majorMono text-lg">4x:xx'</span>
              </h4>
              <p className="mt-4 text-[15px] leading-relaxed text-neutral-700 dark:text-neutral-400 font-[var(--font-geist-light)]">
                <span className="font-[var(--font-geist-bold)] text-black dark:text-darkAccent">Sets</span> que iluminan la oscuridad con sutileza, creando un espacio donde el cuerpo se mueve sin pensar y la música marca su propio <span className="italic font-estonia text-base">ritmo</span>.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}