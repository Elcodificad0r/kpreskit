import React, { useEffect, useState } from "react";
import { Moon, Sun, Menu, X } from "lucide-react";

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

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
    } catch (e) {
      const hasClass = document.documentElement.classList.contains("dark");
      setDarkMode(hasClass);
    }
  }, []);

  const toggleDark = () => {
    const next = !darkMode;
    setDarkMode(next);

    if (next) {
      document.documentElement.classList.add("dark");
      try { localStorage.setItem("theme", "dark"); } catch (e) {}
    } else {
      document.documentElement.classList.remove("dark");
      try { localStorage.setItem("theme", "light"); } catch (e) {}
    }

    document.documentElement.classList.add("theme-transition");
    window.setTimeout(() => {
      document.documentElement.classList.remove("theme-transition");
    }, 400);
  };

  return (
    <>
      {/* GLOBAL BLUR cuando mobile está abierto */}
      {mobileOpen && (
        <div
          className="
            fixed inset-0 z-40
            backdrop-blur-[45px]
            bg-white/10 dark:bg-white/5 
          "
        />
      )}

      <nav
        className={`
          fixed top-0 left-0 w-full z-50
          backdrop-blur-lg
          bg-white/[0.015]
          px-6 py-4 flex items-center justify-between
          transition-all
          ${mobileOpen ? "pointer-events-none" : ""}
        `}
      >
        {/* Logo */}
        <div
          className="
            font-majorMono text-2xl tracking-wider
            text-black dark:text-darkAccent
          "
        >
          LuNARA
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex gap-10 text-3xl font-estonia">
          <a href="#home" className="text-black dark:text-darkAccent hover:opacity-70">
            home
          </a>
          <a href="#about" className="text-black dark:text-darkAccent hover:opacity-70">
            about
          </a>
          <a href="#work" className="text-black dark:text-darkAccent hover:opacity-70">
            work
          </a>
          <a href="#contact" className="text-black dark:text-darkAccent hover:opacity-70">
            contact
          </a>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-4 md:gap-6 w-[70px] justify-end">
          {/* Dark Mode */}
          <button
            onClick={toggleDark}
            aria-pressed={darkMode}
            className="p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-darkAccent" />
            ) : (
              <Moon className="w-6 h-6 text-black dark:text-darkAccent" />
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <Menu className="w-7 h-7 text-black dark:text-darkAccent" />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="
            fixed inset-0 z-50
            bg-transparent
            backdrop-blur-[65px]
            flex flex-col items-center
            pt-32 pb-10
          "
        >
          {/* X button */}
          <button
            className="
              absolute top-6 right-6 p-2 rounded-md
              hover:bg-white/10 transition-colors
            "
            onClick={() => setMobileOpen(false)}
          >
            <X className="w-8 h-8 text-darkAccent" />
          </button>

          {/* Menu Buttons */}
          <div className="flex flex-col items-center gap-12 text-5xl font-estonia text-darkAccent mt-10">
            <a href="#home" onClick={() => setMobileOpen(false)}>home</a>
            <a href="#about" onClick={() => setMobileOpen(false)}>about</a>
            <a href="#work" onClick={() => setMobileOpen(false)}>work</a>
            <a href="#contact" onClick={() => setMobileOpen(false)}>contact</a>
          </div>
        </div>
      )}
    </>
  );
}
