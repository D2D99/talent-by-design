import type TriangleData from "./types";

type Props = {
  data: TriangleData;
};

/**
 * Creates a rounded triangle path
 */
function roundedTrianglePath(
  A: { x: number; y: number },
  B: { x: number; y: number },
  C: { x: number; y: number },
  r: number
) {
  const lerp = (p1: any, p2: any, t: number) => ({
    x: p1.x + (p2.x - p1.x) * t,
    y: p1.y + (p2.y - p1.y) * t,
  });

  const A1 = lerp(A, B, r);
  const A2 = lerp(A, C, r);
  const B1 = lerp(B, C, r);
  const B2 = lerp(B, A, r);
  const C1 = lerp(C, A, r);
  const C2 = lerp(C, B, r);

  return `
    M ${A1.x} ${A1.y}
    Q ${A.x} ${A.y} ${A2.x} ${A2.y}
    L ${C1.x} ${C1.y}
    Q ${C.x} ${C.y} ${C2.x} ${C2.y}
    L ${B1.x} ${B1.y}
    Q ${B.x} ${B.y} ${B2.x} ${B2.y}
    Z
  `;
}

export default function Triangle({ data }: Props) {
  // ===== EQUILATERAL BIG TRIANGLE =====
  const center = { x: 150, y: 150 };
  const radius = 120;

  const P = { x: center.x, y: center.y - radius };
  const O = {
    x: center.x - radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  };
  const D = {
    x: center.x + radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  };

  const pVal = data.peoplePotential || 0;
  const oVal = data.operationalSteadiness || 0;
  const dVal = data.digitalFluency || 0;

  // If all are zero, default to central point perfectly
  const isAllZero = pVal === 0 && oVal === 0 && dVal === 0;
  const p = isAllZero ? 33.3 : pVal;
  const o = isAllZero ? 33.3 : oVal;
  const d = isAllZero ? 33.3 : dVal;

  // Inverse weights trick: We want a high value to push the intersection AWAY from its vertex,
  // making the adjacent area larger. 
  const invP = o + d;
  const invO = p + d;
  const invD = p + o;
  const total = invP + invO + invD;

  const wp = invP / total;
  const wo = invO / total;
  const wd = invD / total;

  // DYNAMIC CENTER POINT
  const C = {
    x: wp * P.x + wo * O.x + wd * D.x,
    y: wp * P.y + wo * O.y + wd * D.y,
  };

  const colors = {
    left: "#E6F0FA",   // Very light blue for left section
    right: "#BFE0F6",  // Slightly darker light blue for right section
    bottom: "#357ABD"  // Dark blue for bottom section
  };

  return (
    <svg viewBox="0 0 300 300" width="100%">
      {/* BACKGROUND AND BORDER - Optional, to keep structural boundary */}
      <path
        d={roundedTrianglePath(P, O, D, 0.1)}
        fill="transparent"
      />

      <defs>
        <clipPath id="triangleClip">
          <path d={roundedTrianglePath(P, O, D, 0.1)} />
        </clipPath>
      </defs>

      <g clipPath="url(#triangleClip)">
        {/* LEFT SECTOR: Center -> Top(P) -> BottomLeft(O) */}
        <polygon
          points={`${C.x},${C.y} ${P.x},${P.y} ${O.x},${O.y}`}
          fill={colors.left}
        />

        {/* RIGHT SECTOR: Center -> Top(P) -> BottomRight(D) */}
        <polygon
          points={`${C.x},${C.y} ${P.x},${P.y} ${D.x},${D.y}`}
          fill={colors.right}
        />

        {/* BOTTOM SECTOR: Center -> BottomLeft(O) -> BottomRight(D) */}
        <polygon
          points={`${C.x},${C.y} ${O.x},${O.y} ${D.x},${D.y}`}
          fill={colors.bottom}
        />
      </g>

      {/* ===== BOLD LABELS ===== */}
      <text
        x={P.x}
        y={P.y - 12}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={12}
        className="uppercase tracking-tighter"
      >
        <tspan x={P.x} dy="0">People</tspan>
        <tspan x={P.x} dy="1.1em">Potential</tspan>
      </text>

      <text
        x={O.x - 30}
        y={O.y + 20}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={12}
        className="uppercase tracking-tighter"
      >
        <tspan x={O.x + 10} dy="0">Operational</tspan>
        <tspan x={O.x + 10} dy="1.1em">Steadiness</tspan>
      </text>

      <text
        x={D.x + 20}
        y={D.y + 20}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={12}
        className="uppercase tracking-tighter"
      >
        <tspan x={D.x - 10} dy="0">Digital</tspan>
        <tspan x={D.x - 10} dy="1.1em">Fluency</tspan>
      </text>
    </svg>
  );
}
