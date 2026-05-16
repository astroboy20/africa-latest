import { useState, useEffect } from "react";

// Country highlight dots
const countries = [
  { id: "morocco", cx: 185, cy: 100 },
  { id: "algeria", cx: 240, cy: 120 },
  { id: "egypt", cx: 355, cy: 130 },
  { id: "senegal", cx: 95, cy: 235 },
  { id: "nigeria", cx: 185, cy: 280 },
  { id: "ethiopia", cx: 380, cy: 255 },
  { id: "kenya", cx: 375, cy: 310 },
  { id: "drc", cx: 290, cy: 345 },
  { id: "tanzania", cx: 355, cy: 360 },
  { id: "south-africa", cx: 290, cy: 520 },
  { id: "ghana", cx: 150, cy: 275 },
];

// Traced from reference: proper Africa silhouette
// Key features: wide Sahara, big west bulge, Horn of Africa, Gulf of Guinea, narrow south
const africaOutline =
  // Northwest coast (Morocco) up to Tunisia
  "M148,105 C155,95 168,88 185,82 C200,78 220,76 240,74 C260,72 280,74 300,76 " +
  // North coast to Egypt
  "C320,78 340,82 355,90 C365,96 370,105 372,115 " +
  // Sinai/Red Sea
  "C375,118 380,112 385,115 C388,120 382,128 375,135 " +
  // Red Sea coast south
  "C370,145 365,158 362,170 C360,180 362,188 368,195 " +
  // Horn of Africa - dramatic east protrusion
  "C375,202 385,210 398,218 C410,225 422,232 430,242 " +
  "C432,248 428,255 418,258 C408,260 395,262 385,265 " +
  // East coast (Kenya, Tanzania)
  "C378,272 372,282 370,295 C368,308 370,320 372,332 " +
  // Southeast coast (Mozambique)
  "C374,342 372,355 368,368 C364,380 360,392 358,405 " +
  "C356,415 358,425 362,435 " +
  // Mozambique to South Africa east coast
  "C360,445 355,458 348,468 C340,480 332,490 325,502 " +
  // Southern tip - Cape of Good Hope
  "C318,512 310,522 300,528 C292,532 282,532 275,528 " +
  "C268,524 262,516 258,508 " +
  // Southwest coast back north (South Africa west, Namibia)
  "C255,498 258,488 260,478 C262,465 258,452 255,440 " +
  // Angola, Congo coast
  "C252,428 248,415 245,402 C242,390 238,378 235,365 " +
  "C232,352 228,340 222,330 C218,322 212,315 205,308 " +
  // Gulf of Guinea - indentation
  "C198,300 190,295 182,292 C172,288 162,286 155,282 " +
  // West African bulge - dramatic westward protrusion
  "C148,278 138,272 128,265 C118,258 108,250 100,240 " +
  "C92,230 88,220 86,210 C84,200 86,190 92,180 " +
  // Northwest coast (Mauritania, Western Sahara)
  "C98,170 105,160 112,150 C118,140 125,130 132,120 " +
  "C138,112 142,108 148,105 Z";

const HeroAfricaMap = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const interval = setInterval(() => {
      setActiveIndex((i) => (i + 1) % countries.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`transition-opacity duration-1000 ${mounted ? 'opacity-100' : 'opacity-0'}`}>
      <svg viewBox="55 50 410 510" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="heroGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(38, 72%, 50%)" stopOpacity="0.25" />
            <stop offset="100%" stopColor="hsl(38, 72%, 50%)" stopOpacity="0" />
          </radialGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Glow background */}
        <circle cx="260" cy="300" r="260" fill="url(#heroGlow)" />

        {/* Continent outline */}
        <path
          d={africaOutline}
          fill="hsl(235, 35%, 18%)"
          stroke="hsl(38, 72%, 50%)"
          strokeWidth="1.5"
          opacity="0.7"
          className="drop-shadow-lg"
        />

        {/* Countries with animation */}
        {countries.map((c, i) => {
          const isActive = i === activeIndex;
          return (
            <g key={c.id}>
              {isActive && (
                <>
                  <circle cx={c.cx} cy={c.cy} r="12" fill="hsl(38, 72%, 50%)" opacity="0.15" className="animate-ping" />
                  <circle cx={c.cx} cy={c.cy} r="6" fill="hsl(38, 72%, 50%)" opacity="0.3" style={{ filter: "url(#glow)" }} />
                </>
              )}
              <circle
                cx={c.cx}
                cy={c.cy}
                r={isActive ? 4 : 2.5}
                fill={isActive ? "hsl(38, 72%, 50%)" : "hsl(15, 55%, 45%)"}
                opacity={isActive ? 1 : 0.6}
                style={{ transition: "all 0.8s ease-in-out" }}
              />
            </g>
          );
        })}

        {/* Connection lines */}
        {countries.map((c, i) => {
          const next = countries[(i + 1) % countries.length];
          return (
            <line
              key={`line-${i}`}
              x1={c.cx} y1={c.cy}
              x2={next.cx} y2={next.cy}
              stroke="hsl(38, 72%, 50%)"
              strokeWidth="0.5"
              opacity="0.12"
              strokeDasharray="4 4"
            />
          );
        })}

        {/* Floating particles */}
        {[0, 1, 2, 3, 4].map((i) => (
          <circle
            key={`particle-${i}`}
            cx={110 + i * 60}
            cy={120 + i * 80}
            r="1.5"
            fill="hsl(38, 72%, 50%)"
            opacity="0.4"
          >
            <animate attributeName="cy" values={`${120 + i * 80};${112 + i * 80};${120 + i * 80}`} dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.2;0.6;0.2" dur={`${3 + i * 0.5}s`} repeatCount="indefinite" />
          </circle>
        ))}
      </svg>
    </div>
  );
};

export default HeroAfricaMap;
