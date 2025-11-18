import React,{ useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import.meta.env.BASE_URL

export default function Home() {
  const [selectedImage, setSelectedImage] = useState(null);
  const discRef = useRef(null);
  const arrowRef = useRef(null);
  const groupRef = useRef(null);

  const images = [
    `${import.meta.env.BASE_URL}img/cd-portada.webp`,
    `${import.meta.env.BASE_URL}img/cd-portada1.webp`,
  ];

  useEffect(() => {
    // Seleccionar imagen random
    const random = Math.floor(Math.random() * images.length);
    setSelectedImage(images[random]);

    // GSAP necesita esperar a que la imagen esté en el DOM
    setTimeout(() => {
      if (!discRef.current) return;

      // Rotación infinita
      gsap.to(discRef.current, {
        rotation: 360,
        duration: 22,
        repeat: -1,
        ease: "none",
        transformOrigin: "50% 50%",
      });

      // Animación flecha
      gsap.to(arrowRef.current, {
        y: 14,
        duration: 1.6,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Animación sutil del texto
      gsap.to(groupRef.current, {
        scale: 1.02,
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "power1.inOut",
      });

      // Hover SOLO en desktop
      gsap.matchMedia().add("(min-width: 768px)", () => {
        discRef.current.addEventListener("mouseenter", () => {
          gsap.to(discRef.current, {
            scale: 1.06,
            duration: 0.5,
            ease: "power2.out",
          });
        });

        discRef.current.addEventListener("mouseleave", () => {
          gsap.to(discRef.current, {
            scale: 1,
            duration: 0.5,
            ease: "power2.out",
          });
        });
      });
    }, 50);
  }, []);

  // Click que lleva a la sección Work
  const goToWork = () => {
    const target = document.querySelector("#work");
    if (target) target.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section id="home" className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      
      {/* Disco en el centro */}
      {selectedImage && (
        <img
          ref={discRef}
          src={selectedImage}
          alt="cd portada"
          onClick={goToWork}
          className="w-[340px] sm:w-[420px] md:w-[510px] lg:w-[600px] drop-shadow-2xl select-none cursor-pointer"
        />
      )}

      {/* DISCOVER MORE */}
      <div
        ref={groupRef}
        onClick={goToWork}   // ← ÚNICO CAMBIO AÑADIDO
        className="absolute bottom-16 right-14 flex flex-col items-end cursor-pointer select-none hover:underline hover:text-orange-500"
      >
        <span className="text-5xl md:text-6xl lg:text-7xl font-[var(--font-geist-light)] tracking-tight leading-none">
          descubrir
        </span>

        <span className="text-5xl md:text-6xl lg:text-7xl font-[var(--font-geist-light)] tracking-tight leading-none">
          más
        </span>

        <span
          ref={arrowRef}
          className="text-6xl md:text-7xl lg:text-8xl mt-3 font-[var(--font-geist-light)]"
        >
          ↓
        </span>
      </div>
    </section>
  );
}
