import { computeCurveState } from '../lib/curveMath';

export interface HeroCurveBoundaryProps {
  revealProgress?: number;
  isComplete?: boolean;
}



export const HeroCurveBoundary = ({
  revealProgress = 1,
  isComplete = true,
}: HeroCurveBoundaryProps) => {
  const curveState = computeCurveState(revealProgress);

  return (
    <div className="relative w-full overflow-hidden leading-none z-20 -mb-[1px]">
      <svg
        viewBox="0 0 1440 130"
        preserveAspectRatio="none"
        className="w-full h-20 sm:h-24 md:h-28 lg:h-32 block overflow-visible select-none pointer-events-none"
        aria-hidden="true"
      >
        <defs>
          {/* Subtle, tightly controlled streak glow filter - small blur, no giant circular halo */}
          <filter id="tightStreakGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Crisp micro-glow for the leading white-hot highlight */}
          <filter id="tightPointGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="1" />
          </filter>

          {/* Refined Linear Gradient along the curve streak */}
          <linearGradient
            id="refinedStreakGradient"
            x1={curveState.startX}
            y1={curveState.startY}
            x2={curveState.headX}
            y2={curveState.headY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#E6BF00" stopOpacity="0" />
            <stop offset="35%" stopColor="#FFD60A" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#FFE047" stopOpacity="0.85" />
            <stop offset="92%" stopColor="#FFF9D6" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="1" />
          </linearGradient>

          {/* Outer subtle glow gradient for the streak stroke */}
          <linearGradient
            id="refinedStreakOuterGradient"
            x1={curveState.startX}
            y1={curveState.startY}
            x2={curveState.headX}
            y2={curveState.headY}
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="#CA8A04" stopOpacity="0" />
            <stop offset="50%" stopColor="#EAB308" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#FFD60A" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#FFE047" stopOpacity="0.8" />
          </linearGradient>
        </defs>

        {isComplete ? (
          /* Final approved static curve */
          <path
            d="M 0,0 C 480,75 960,115 1440,120 L 1440,130 L 0,130 Z"
            fill="#ffffff"
          />
        ) : (
          <>
            {/* Progressively Revealed White Curve Polygon */}
            <path d={curveState.curveD} fill="#ffffff" />

            {/* Refined Luminous Light Streak hugging the curved boundary */}
            {curveState.streakD && curveState.opacity > 0 && (
              <g opacity={curveState.opacity}>
                {/* 1. Subtle, tightly controlled yellow glow stroke immediately surrounding the streak */}
                <path
                  d={curveState.streakD}
                  fill="none"
                  stroke="url(#refinedStreakOuterGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#tightStreakGlow)"
                />

                {/* 2. Narrow luminous yellow-to-white streak following the curve */}
                <path
                  d={curveState.streakD}
                  fill="none"
                  stroke="url(#refinedStreakGradient)"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </g>
            )}

            {/* Crisp White-Hot Highlight at the leading edge (headX, headY) */}
            {curveState.opacity > 0 && (
              <g opacity={curveState.opacity}>
                {/* Thin tangential elongated highlight along the curve edge */}
                <ellipse
                  cx={curveState.headX}
                  cy={curveState.headY}
                  rx="7"
                  ry="1.4"
                  fill="#ffffff"
                  opacity="0.9"
                  filter="url(#tightPointGlow)"
                  transform={`rotate(${curveState.angle} ${curveState.headX} ${curveState.headY})`}
                />

                {/* Crisp pinpoint white-hot center */}
                <circle
                  cx={curveState.headX}
                  cy={curveState.headY}
                  r="1.8"
                  fill="#ffffff"
                />
              </g>
            )}
          </>
        )}
      </svg>
    </div>
  );
};
