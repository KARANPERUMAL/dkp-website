export interface HeroCurveBoundaryProps {
  revealProgress?: number;
  isComplete?: boolean;
}

export function computeCurveState(t: number) {
  const clampedT = Math.max(0, Math.min(1, t));

  // If complete, return the exact static approved curve in settled position
  if (clampedT >= 1) {
    return {
      curveD: 'M 0,0 C 480,75 960,115 1440,120 L 1440,130 L 0,130 Z',
      streakD: '',
      headX: 0,
      headY: 0,
      angle: 8.87,
      opacity: 0,
      startX: 0,
      startY: 0,
    };
  }

  // Bottom-right to top-left traversal:
  // As scroll progress t goes from 0 to 1, u moves from 1 (bottom-right) toward 0 (top-left)
  const u = 1 - clampedT;

  const lerp = (a: number, b: number, factor: number) => a + (b - a) * factor;

  const p0x = 0, p0y = 0;
  const p1x = 480, p1y = 75;
  const p2x = 960, p2y = 115;
  const p3x = 1440, p3y = 120;

  // de Casteljau subdivision for [u, 1]
  const p01x = lerp(p0x, p1x, u);
  const p01y = lerp(p0y, p1y, u);
  const p12x = lerp(p1x, p2x, u);
  const p12y = lerp(p1y, p2y, u);
  const p23x = lerp(p2x, p3x, u);
  const p23y = lerp(p2y, p3y, u);

  const p012x = lerp(p01x, p12x, u);
  const p012y = lerp(p01y, p12y, u);
  const p123x = lerp(p12x, p23x, u);
  const p123y = lerp(p12y, p23y, u);

  // The curve segment covering [u, 1] starts at (q0x, q0y) = (x(u), y(u)) and ends at (1440, 120)
  const q0x = lerp(p012x, p123x, u);
  const q0y = lerp(p012y, p123y, u);
  const q1x = p123x;
  const q1y = p123y;
  const q2x = p23x;
  const q2y = p23y;
  const q3x = p3x;
  const q3y = p3y;

  // Head position (leading edge of the reveal moving bottom-right to top-left)
  const headX = q0x;
  const headY = q0y;

  // Tangent angle in degrees along the curve at parameter u
  const dx = 1440;
  const dy = 3 * (1 - u) * (1 - u) * 75 + 6 * (1 - u) * u * 40 + 3 * u * u * 5;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Closed path for revealed white section covering [u, 1]:
  // Starts at head (headX, headY), curves down-right to (1440, 120), drops to (1440, 130), goes left to (headX, 130), and closes
  const curveD = `M ${q0x.toFixed(1)},${q0y.toFixed(1)} C ${q1x.toFixed(1)},${q1y.toFixed(1)} ${q2x.toFixed(1)},${q2y.toFixed(1)} ${q3x.toFixed(1)},${q3y.toFixed(1)} L 1440,130 L ${q0x.toFixed(1)},130 Z`;

  // Trailing streak: trailing BEHIND the head (to the right of the head in the revealed region [u, min(1, u + 0.16)])
  let streakD = '';
  let startX = headX;
  let startY = headY;
  const streakLength = 0.16;

  if (u < 0.985) {
    const uTail = Math.min(1, u + streakLength);
    const denom = 1 - u;
    const s = denom > 1e-6 ? (uTail - u) / denom : 1;

    const r01x = lerp(q0x, q1x, s);
    const r01y = lerp(q0y, q1y, s);
    const r12x = lerp(q1x, q2x, s);
    const r12y = lerp(q1y, q2y, s);
    const r23x = lerp(q2x, q3x, s);
    const r23y = lerp(q2y, q3y, s);

    const r012x = lerp(r01x, r12x, s);
    const r012y = lerp(r01y, r12y, s);
    const r123x = lerp(r12x, r23x, s);
    const r123y = lerp(r12y, r23y, s);

    const tailX = lerp(r012x, r123x, s);
    const tailY = lerp(r012y, r123y, s);

    startX = tailX;
    startY = tailY;

    // Streak curves from tail (tailX, tailY) forward to head (headX, headY)
    streakD = `M ${tailX.toFixed(1)},${tailY.toFixed(1)} C ${r012x.toFixed(1)},${r012y.toFixed(1)} ${r01x.toFixed(1)},${r01y.toFixed(1)} ${headX.toFixed(1)},${headY.toFixed(1)}`;
  }

  // Light opacity lifecycle derived directly from scroll progress:
  // 1. Initial state (clampedT <= 0.015): completely invisible (opacity = 0)
  // 2. Scroll start (0.015 < clampedT < 0.09): smooth entrance fade-in from 0 to 1
  // 3. Mid-sweep (0.09 <= clampedT <= 0.85): full brilliance (opacity = 1)
  // 4. Reveal completion (clampedT > 0.85): smooth exit fade-out from 1 to 0
  let opacity = 0;
  if (clampedT <= 0.015) {
    opacity = 0;
  } else if (clampedT < 0.09) {
    opacity = (clampedT - 0.015) / (0.09 - 0.015);
  } else if (clampedT <= 0.85) {
    opacity = 1;
  } else {
    opacity = Math.max(0, 1 - (clampedT - 0.85) / 0.15);
  }

  return {
    curveD,
    streakD,
    headX,
    headY,
    angle,
    opacity,
    startX,
    startY,
  };
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
            <stop offset="0%" stopColor="#ff4d00" stopOpacity="0" />
            <stop offset="35%" stopColor="#ff6a00" stopOpacity="0.45" />
            <stop offset="70%" stopColor="#ffa020" stopOpacity="0.85" />
            <stop offset="92%" stopColor="#fff0d0" stopOpacity="0.95" />
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
            <stop offset="0%" stopColor="#ff3300" stopOpacity="0" />
            <stop offset="50%" stopColor="#ff5500" stopOpacity="0.35" />
            <stop offset="85%" stopColor="#ff7700" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#ff9900" stopOpacity="0.8" />
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
                {/* 1. Subtle, tightly controlled orange glow stroke immediately surrounding the streak */}
                <path
                  d={curveState.streakD}
                  fill="none"
                  stroke="url(#refinedStreakOuterGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  filter="url(#tightStreakGlow)"
                />

                {/* 2. Narrow luminous orange-to-white streak following the curve */}
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
