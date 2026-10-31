/**
 * Mathematical curve state computation for the Hero section curve boundary.
 */
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

  // De Casteljau subdivision at u to split the curve at the moving head point
  const q0x = lerp(p0x, p1x, u), q0y = lerp(p0y, p1y, u);
  const q1x = lerp(p1x, p2x, u), q1y = lerp(p1y, p2y, u);
  const q2x = lerp(p2x, p3x, u), q2y = lerp(p2y, p3y, u);

  const r0x = lerp(q0x, q1x, u), r0y = lerp(q0y, q1y, u);
  const r1x = lerp(q1x, q2x, u), r1y = lerp(q1y, q2y, u);

  const headX = lerp(r0x, r1x, u);
  const headY = lerp(r0y, r1y, u);

  // Tangent vector at u to align the moving light streak
  const du = Math.max(0, u - 0.005);
  const dq0x = lerp(p0x, p1x, du), dq0y = lerp(p0y, p1y, du);
  const dq1x = lerp(p1x, p2x, du), dq1y = lerp(p1y, p2y, du);
  const dq2x = lerp(p2x, p3x, du), dq2y = lerp(p2y, p3y, du);
  const dr0x = lerp(dq0x, dq1x, du), dr0y = lerp(dq0y, dq1y, du);
  const dr1x = lerp(dq1x, dq2x, du), dr1y = lerp(dq1y, dq2y, du);
  const prevX = lerp(dr0x, dr1x, du);
  const prevY = lerp(dr0y, dr1y, du);

  const dx = headX - prevX;
  const dy = headY - prevY;
  const angle = Math.atan2(dy, dx) * (180 / Math.PI);

  // Subdivided curve paths
  const startSegment = `M ${headX.toFixed(2)},${headY.toFixed(2)} C ${r1x.toFixed(2)},${r1y.toFixed(2)} ${q2x.toFixed(2)},${q2y.toFixed(2)} ${p3x},${p3y}`;
  const curveD = `${startSegment} L 1440,130 L ${headX.toFixed(2)},130 Z`;

  // Tail streak length (parametric span trailing the head)
  const tailSpan = 0.14;
  const tailU = Math.min(1, u + tailSpan);
  const tq0x = lerp(p0x, p1x, tailU), tq0y = lerp(p0y, p1y, tailU);
  const tq1x = lerp(p1x, p2x, tailU), tq1y = lerp(p1y, p2y, tailU);
  const tq2x = lerp(p2x, p3x, tailU), tq2y = lerp(p2y, p3y, tailU);
  const tr0x = lerp(tq0x, tq1x, tailU), tr0y = lerp(tq0y, tq1y, tailU);
  const tr1x = lerp(tq1x, tq2x, tailU), tr1y = lerp(tq1y, tq2y, tailU);
  const tailX = lerp(tr0x, tr1x, tailU);
  const tailY = lerp(tr0y, tr1y, tailU);

  const streakD = `M ${tailX.toFixed(2)},${tailY.toFixed(2)} Q ${(headX + tailX) / 2},${(headY + tailY) / 2} ${headX.toFixed(2)},${headY.toFixed(2)}`;

  // Opacity: high in mid-reveal, fades smoothly as it settles at the top-left
  const opacity = Math.sin(clampedT * Math.PI) * 0.95 + (clampedT < 0.95 ? 0.05 : 0);

  return {
    curveD,
    streakD,
    headX,
    headY,
    angle,
    opacity,
    startX: headX,
    startY: headY,
  };
}
