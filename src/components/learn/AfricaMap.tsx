import { useState } from "react";

interface AfricaMapProps {
  onCountrySelect: (countryId: string) => void;
}

// Geographically accurate Africa country paths (viewBox 0 0 600 700)
const countryPaths: Record<string, { d: string; labelX: number; labelY: number; active: boolean; name: string }> = {
  morocco: {
    d: "M168,115 L175,108 L188,105 L200,108 L208,102 L218,104 L222,112 L218,122 L210,130 L198,134 L186,132 L174,126 Z",
    labelX: 195, labelY: 118, active: false, name: "Morocco"
  },
  algeria: {
    d: "M198,134 L210,130 L222,122 L234,118 L252,116 L268,120 L278,128 L282,142 L280,160 L274,176 L264,186 L250,190 L236,188 L222,182 L212,172 L204,160 L198,148 Z",
    labelX: 240, labelY: 155, active: false, name: "Algeria"
  },
  libya: {
    d: "M278,128 L294,124 L310,126 L324,132 L332,142 L334,156 L330,172 L322,184 L310,190 L296,188 L282,182 L274,176 L280,160 L282,142 Z",
    labelX: 305, labelY: 158, active: false, name: "Libya"
  },
  egypt: {
    d: "M332,142 L344,136 L358,138 L368,146 L372,158 L370,172 L364,184 L354,192 L342,194 L332,188 L326,178 L322,184 L330,172 L334,156 Z",
    labelX: 350, labelY: 165, active: false, name: "Egypt"
  },
  mauritania: {
    d: "M140,172 L158,166 L174,170 L186,176 L192,186 L190,200 L182,212 L170,218 L156,216 L144,208 L138,196 L136,184 Z",
    labelX: 164, labelY: 194, active: false, name: "Mauritania"
  },
  mali: {
    d: "M186,176 L204,172 L222,182 L234,190 L238,204 L232,218 L220,226 L206,228 L194,222 L186,212 L182,212 L190,200 L192,186 Z",
    labelX: 212, labelY: 202, active: false, name: "Mali"
  },
  niger: {
    d: "M234,190 L250,190 L264,186 L278,192 L288,204 L286,220 L278,232 L266,238 L252,236 L240,230 L232,218 L238,204 Z",
    labelX: 260, labelY: 214, active: false, name: "Niger"
  },
  chad: {
    d: "M288,204 L302,198 L316,202 L326,212 L328,228 L322,242 L310,250 L296,248 L284,240 L278,232 L286,220 Z",
    labelX: 304, labelY: 225, active: false, name: "Chad"
  },
  sudan: {
    d: "M326,212 L340,206 L356,210 L366,220 L370,236 L366,252 L356,264 L342,268 L330,264 L322,254 L318,242 L322,242 L328,228 Z",
    labelX: 346, labelY: 238, active: false, name: "Sudan"
  },
  senegal: {
    d: "M120,228 L134,224 L146,228 L152,238 L148,250 L138,256 L126,254 L118,244 Z",
    labelX: 136, labelY: 240, active: false, name: "Senegal"
  },
  guinea: {
    d: "M130,256 L144,252 L158,256 L164,268 L158,278 L146,282 L134,278 L128,268 Z",
    labelX: 147, labelY: 268, active: false, name: "Guinea"
  },
  "sierra-leone": {
    d: "M122,274 L134,278 L138,290 L130,298 L120,294 L116,284 Z",
    labelX: 128, labelY: 286, active: false, name: "Sierra Leone"
  },
  liberia: {
    d: "M130,298 L142,296 L152,302 L150,314 L140,318 L130,312 Z",
    labelX: 140, labelY: 306, active: false, name: "Liberia"
  },
  "ivory-coast": {
    d: "M152,282 L166,278 L178,284 L180,298 L172,310 L158,312 L150,302 L152,290 Z",
    labelX: 166, labelY: 296, active: false, name: "Côte d'Ivoire"
  },
  "burkina-faso": {
    d: "M178,252 L194,248 L206,254 L208,266 L198,274 L184,272 L176,264 Z",
    labelX: 192, labelY: 262, active: false, name: "Burkina Faso"
  },
  ghana: {
    d: "M184,272 L198,274 L204,286 L200,300 L190,308 L178,304 L174,292 L176,280 Z",
    labelX: 190, labelY: 290, active: false, name: "Ghana"
  },
  togo: {
    d: "M204,286 L212,284 L216,296 L212,308 L204,310 L200,300 Z",
    labelX: 208, labelY: 298, active: false, name: "Togo"
  },
  benin: {
    d: "M216,280 L226,278 L230,290 L228,304 L220,310 L212,308 L216,296 L212,284 Z",
    labelX: 222, labelY: 294, active: false, name: "Benin"
  },
  nigeria: {
    d: "M226,278 L242,272 L258,268 L274,272 L286,282 L290,298 L284,314 L272,324 L256,328 L240,324 L230,316 L224,304 L228,290 Z",
    labelX: 258, labelY: 298, active: true, name: "Nigeria"
  },
  cameroon: {
    d: "M272,324 L284,314 L296,318 L304,332 L300,348 L290,358 L278,356 L270,344 L268,332 Z",
    labelX: 286, labelY: 338, active: false, name: "Cameroon"
  },
  "central-african-republic": {
    d: "M296,298 L314,292 L330,296 L340,308 L336,322 L324,330 L310,328 L300,318 L296,308 Z",
    labelX: 318, labelY: 312, active: false, name: "C.A.R."
  },
  ethiopia: {
    d: "M366,252 L382,248 L398,254 L408,268 L406,286 L396,298 L382,302 L368,298 L358,288 L356,274 L356,264 Z",
    labelX: 383, labelY: 276, active: false, name: "Ethiopia"
  },
  somalia: {
    d: "M408,268 L420,260 L430,266 L436,280 L432,296 L424,308 L412,314 L400,308 L396,298 L406,286 Z",
    labelX: 418, labelY: 288, active: false, name: "Somalia"
  },
  drc: {
    d: "M300,348 L316,340 L336,344 L348,356 L354,374 L348,394 L336,406 L318,410 L302,404 L290,392 L286,376 L288,360 Z",
    labelX: 320, labelY: 376, active: false, name: "DR Congo"
  },
  uganda: {
    d: "M358,318 L372,314 L382,322 L380,336 L370,342 L358,338 L354,328 Z",
    labelX: 368, labelY: 328, active: false, name: "Uganda"
  },
  kenya: {
    d: "M382,302 L396,298 L408,306 L412,322 L406,338 L394,346 L382,342 L374,330 L372,314 L378,306 Z",
    labelX: 394, labelY: 322, active: false, name: "Kenya"
  },
  rwanda: {
    d: "M354,342 L364,340 L370,348 L366,356 L356,358 L350,350 Z",
    labelX: 360, labelY: 349, active: false, name: "Rwanda"
  },
  burundi: {
    d: "M352,358 L362,356 L366,364 L362,372 L354,374 L348,366 Z",
    labelX: 358, labelY: 365, active: false, name: "Burundi"
  },
  tanzania: {
    d: "M370,348 L386,342 L400,348 L408,362 L404,380 L394,392 L380,396 L368,390 L360,378 L358,364 L362,356 L366,348 Z",
    labelX: 384, labelY: 370, active: false, name: "Tanzania"
  },
  angola: {
    d: "M252,398 L272,392 L290,398 L300,414 L296,434 L284,448 L268,452 L254,446 L244,432 L242,416 Z",
    labelX: 272, labelY: 424, active: false, name: "Angola"
  },
  zambia: {
    d: "M300,414 L318,410 L336,414 L346,428 L342,444 L330,454 L314,456 L302,448 L296,436 Z",
    labelX: 322, labelY: 434, active: false, name: "Zambia"
  },
  mozambique: {
    d: "M372,414 L386,408 L396,418 L398,436 L392,452 L382,462 L370,464 L362,454 L358,440 L360,426 Z",
    labelX: 380, labelY: 438, active: false, name: "Mozambique"
  },
  zimbabwe: {
    d: "M342,444 L358,440 L366,452 L362,466 L350,474 L338,470 L332,458 Z",
    labelX: 350, labelY: 458, active: false, name: "Zimbabwe"
  },
  namibia: {
    d: "M242,460 L260,454 L276,458 L284,472 L280,490 L268,500 L254,498 L242,490 L238,476 Z",
    labelX: 262, labelY: 478, active: false, name: "Namibia"
  },
  botswana: {
    d: "M284,472 L300,468 L314,474 L318,490 L310,502 L296,504 L284,498 L280,490 Z",
    labelX: 300, labelY: 488, active: false, name: "Botswana"
  },
  "south-africa": {
    d: "M260,504 L280,496 L300,500 L320,498 L338,504 L350,518 L354,538 L344,556 L328,566 L308,570 L288,566 L270,558 L258,544 L252,526 L254,512 Z",
    labelX: 305, labelY: 536, active: false, name: "South Africa"
  },
  madagascar: {
    d: "M416,448 L426,442 L434,450 L436,468 L430,484 L422,492 L414,488 L410,472 L412,458 Z",
    labelX: 424, labelY: 468, active: false, name: "Madagascar"
  },
};

// Traced from reference: proper Africa silhouette
const africaOutline =
  "M148,105 C155,95 168,88 185,82 C200,78 220,76 240,74 C260,72 280,74 300,76 " +
  "C320,78 340,82 355,90 C365,96 370,105 372,115 " +
  "C375,118 380,112 385,115 C388,120 382,128 375,135 " +
  "C370,145 365,158 362,170 C360,180 362,188 368,195 " +
  "C375,202 385,210 398,218 C410,225 422,232 430,242 " +
  "C432,248 428,255 418,258 C408,260 395,262 385,265 " +
  "C378,272 372,282 370,295 C368,308 370,320 372,332 " +
  "C374,342 372,355 368,368 C364,380 360,392 358,405 " +
  "C356,415 358,425 362,435 " +
  "C360,445 355,458 348,468 C340,480 332,490 325,502 " +
  "C318,512 310,522 300,528 C292,532 282,532 275,528 " +
  "C268,524 262,516 258,508 " +
  "C255,498 258,488 260,478 C262,465 258,452 255,440 " +
  "C252,428 248,415 245,402 C242,390 238,378 235,365 " +
  "C232,352 228,340 222,330 C218,322 212,315 205,308 " +
  "C198,300 190,295 182,292 C172,288 162,286 155,282 " +
  "C148,278 138,272 128,265 C118,258 108,250 100,240 " +
  "C92,230 88,220 86,210 C84,200 86,190 92,180 " +
  "C98,170 105,160 112,150 C118,140 125,130 132,120 " +
  "C138,112 142,108 148,105 Z";

const AfricaMap = ({ onCountrySelect }: AfricaMapProps) => {
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <svg viewBox="100 70 370 530" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
        {/* Africa continent fill */}
        <path
          d={africaOutline}
          fill="hsl(35, 20%, 88%)"
          stroke="hsl(30, 18%, 72%)"
          strokeWidth="2"
        />

        {/* Country regions */}
        {Object.entries(countryPaths).map(([id, country]) => {
          const isHovered = hoveredCountry === id;
          const isActive = country.active;
          
          return (
            <g key={id}>
              <path
                d={country.d}
                fill={
                  isActive
                    ? isHovered
                      ? "hsl(15, 55%, 45%)"
                      : "hsl(15, 55%, 38%)"
                    : isHovered
                    ? "hsl(35, 20%, 70%)"
                    : "hsl(35, 15%, 78%)"
                }
                stroke={isActive ? "hsl(15, 55%, 30%)" : "hsl(30, 10%, 65%)"}
                strokeWidth="1"
                className="cursor-pointer transition-colors duration-200"
                onMouseEnter={() => setHoveredCountry(id)}
                onMouseLeave={() => setHoveredCountry(null)}
                onClick={() => isActive ? onCountrySelect(id) : undefined}
              />
              <text
                x={country.labelX}
                y={country.labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                className="pointer-events-none select-none"
                fontSize="6"
                fontWeight="600"
                fill={isActive ? "hsl(40, 30%, 95%)" : "hsl(20, 10%, 45%)"}
              >
                {country.name}
              </text>
              {!isActive && isHovered && (
                <text
                  x={country.labelX}
                  y={country.labelY + 9}
                  textAnchor="middle"
                  fontSize="5"
                  fill="hsl(20, 12%, 45%)"
                  className="pointer-events-none"
                >
                  Coming Soon
                </text>
              )}
              {isActive && (
                <circle
                  cx={country.labelX}
                  cy={country.labelY - 14}
                  r="3"
                  fill="hsl(38, 72%, 50%)"
                  className="pointer-events-none animate-pulse"
                />
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

export default AfricaMap;
