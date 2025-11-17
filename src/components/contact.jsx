/* CONTACT — FINAL — solo fix dark mode */

import React, { useEffect, useState } from "react";
import { Mail, Instagram } from "lucide-react";

export default function Contact() {
  const [isMobile, setIsMobile] = useState(false);
  const [scrollReveal, setScrollReveal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  /* EXACTA lógica del Navbar */
  useEffect(() => {
    try {
      const saved = localStorage.getItem("theme");
      if (saved === "dark") {
        document.documentElement.classList.add("dark");
        setDarkMode(true);
      } else if (saved === "light") {
        document.documentElement.classList.remove("dark");
        setDarkMode(false);
      } else {
        const hasClass = document.documentElement.classList.contains("dark");
        setDarkMode(hasClass);
      }
    } catch {
      const hasClass = document.documentElement.classList.contains("dark");
      setDarkMode(hasClass);
    }
  }, []);

  /* Detect mobile */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* scroll reveal */
  useEffect(() => {
    if (!isMobile) return;
    const handleScroll = () => {
      const triggerPoint = window.innerHeight * 0.25;
      if (window.scrollY > triggerPoint) setScrollReveal(true);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isMobile]);

  return (
    <section
      className={`
        relative w-full min-h-screen flex justify-center px-6 py-16 transition-colors
        bg-[#FFFBF2] 
        dark:bg-darkBg 
        ${darkMode ? "dark" : ""}
      `}
    >
      <div className="relative w-full max-w-6xl flex flex-col items-center">
        
        {/* Title */}
        <h1
          className="font-black tracking-tight mb-10 md:mb-0 text-center md:text-left"
          style={{ fontSize: "clamp(48px, 10vw, 150px)", lineHeight: 0.9 }}
        >
          CONTACT
        </h1>

        {/* MOBILE */}
        {isMobile ? (
          <>
            <div
              className={`relative w-[320px] h-[320px] mt-6 transition-all duration-700 ease-out ${
                scrollReveal ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
              }`}
            >
              <img
                src="/src/assets/img/contact-disk.png"
                className="absolute z-10 
                w-[120%] h-[120%]
                -top-20
                right-[-34%]
                object-contain
                drop-shadow-[0_0_18px_rgba(0,0,0,0.35)]
                dark:drop-shadow-[0_0_22px_rgba(255,255,255,0.30)]"
              />

              <img
                src="/src/assets/img/contact-cover.png"
                className="absolute z-20 
                w-[95%] h-[95%]
                left-1/2 -translate-x-1/2
                top-4
                object-contain"
              />
            </div>

            <div className="flex flex-col gap-6 mt-10 text-lg w-full items-center">
              <a
                href="mailto:example@gmail.com"
                className="flex items-center gap-4 px-5 py-3 rounded-xl border border-black dark:border-white transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <Mail size={26} /> Gmail
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 px-5 py-3 rounded-xl border border-black dark:border-white transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <Instagram size={26} /> Instagram
              </a>
            </div>
          </>
        ) : (
          
          /* DESKTOP */
          <div className="mt-24 flex flex-row items-center justify-center gap-20 w-full">
            
            <div className="flex flex-col gap-8 text-xl z-20">
              <a
                href="mailto:example@gmail.com"
                className="flex items-center gap-4 px-5 py-3 rounded-xl border border-black dark:border-white transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <Mail size={30} /> Gmail
              </a>

              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-4 px-5 py-3 rounded-xl border border-black dark:border-white transition-all duration-300 hover:scale-105 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black"
              >
                <Instagram size={30} /> Instagram
              </a>
            </div>

            <div className="group relative flex items-center justify-center w-[540px] h-[540px] select-none">
              
              <img
                src="/src/assets/img/contact-disk.png"
                className="absolute z-10 w-[90%] h-[90%] 
                translate-x-10 
                translate-y-2
                object-contain transition-all duration-700 ease-out 
                group-hover:translate-x-40 group-hover:-translate-y-40 group-hover:rotate-[10deg] group-hover:scale-[1.12]
                drop-shadow-[0_0_18px_rgba(0,0,0,0.25)]
                dark:drop-shadow-[0_0_26px_rgba(255,255,255,0.35)]"
              />

              <img
                src="/src/assets/img/contact-cover.png"
                className="absolute z-20 w-[100%] h-[100%] object-contain transition-all duration-700 ease-out 
                group-hover:-translate-x-6 group-hover:-translate-y-3 group-hover:scale-[0.985]"
              />
            </div>
          </div>
        )}

        <div className="mt-16 text-4xl tracking-widest font-majorMono">LUNARA</div>
      </div>
    </section>
  );
}
