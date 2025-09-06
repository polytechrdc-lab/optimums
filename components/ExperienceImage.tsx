"use client";
import Image from "next/image";
import towerSkyline from "../image/body/tower_skyline.png.webp";

export default function ExperienceImage() {
  return (
    <section className="experience-image" aria-label="Illustration d'expérience">
      <div className="experience-media" aria-hidden>
        <Image
          src={towerSkyline}
          alt=""
          fill
          sizes="100vw"
          priority={false}
          style={{ objectFit: "cover", objectPosition: "75% 55%" }}
        />
      </div>
    </section>
  );
}

