"use client";

import { useEffect, useRef } from "react";

export function GlobeBackground() {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden pointer-events-none">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] md:w-[450px] aspect-square rounded-full opacity-60 mix-blend-screen">
                {/* Sphere Shadow/Glow */}
                <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-3xl"></div>

                {/* The Rotating Globe */}
                <div
                    className="w-full h-full rounded-full shadow-[inset_-10px_-10px_30px_rgba(255,255,255,0.1)]"
                    style={{
                        background: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/8/83/Equirectangular_projection_SW.jpg/1024px-Equirectangular_projection_SW.jpg')",
                        backgroundSize: "210% 100%",
                        animation: "spin 60s linear infinite",
                        filter: "grayscale(100%) sepia(100%) hue-rotate(170deg) brightness(1.2) saturate(150%)" /* Light Blue */
                    }}
                ></div>

                {/* Atmospheric Glow */}
                <div className="absolute inset-0 rounded-full shadow-[0_0_40px_rgba(34,211,238,0.4)]"></div>
            </div>

            {/* Grid Overlay (replicating the screenshot's grid) */}
            <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20"></div>
        </div>
    );
}
