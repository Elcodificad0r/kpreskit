import React from "react";
import { Instagram, Mail, AudioLines } from "lucide-react";

export default function Footer() {
  return (
    <footer
      className="font-geistLight w-full py-6 px-4 mt-20
                 bg-transparent text-gray-400"
    >
      <div
        className="max-w-6xl mx-auto flex flex-col md:flex-row
                   items-center justify-between gap-4 text-sm"
      >

        {/* LEFT: Social icons */}
        <div className="flex items-center gap-5">
          
          {/* Instagram */}
          <a
            href="https://www.instagram.com/karendelunaaa?igsh=MXJ1cGozZjI3eTJwMw=="
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            <Instagram size={20} strokeWidth={1.3} />
          </a>

          {/* Mail */}
          <a
            href="mailto:lunara.dj.contact@gmail.com"
            className="hover:text-black transition"
          >
            <Mail size={20} strokeWidth={1.3} />
          </a>

          {/* SoundCloud (icon substitute) */}
          <a
            href="https://soundcloud.com/user-26003997"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-black transition"
          >
            <AudioLines size={20} strokeWidth={1.3} />
          </a>
        </div>

        {/* CENTER: Location */}
        <div className="text-center text-gray-400 text-sm tracking-wide">
          Nuevo Laredo, Tamaulipas, México
        </div>

        {/* RIGHT: Credits */}
        <div className="text-sm text-gray-400">
          Made with <span className="text-red-500">❤️</span> by Code & Co.
        </div>
      </div>
    </footer>
  );
}
