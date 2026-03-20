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
  // ===== GEOMETRY CONFIG =====
  const center = { x: 150, y: 153 };
  const radius = 120;

  // Base vertices
  const P = { x: center.x, y: center.y - radius };
  const O = {
    x: center.x - radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  };
  const D = {
    x: center.x + radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  };

  // Scores
  const pS = data.peoplePotential || 0;
  const oS = data.operationalSteadiness || 0;
  const dS = data.digitalFluency || 0;

  // BARYCENTRIC NORMALIZATION
  // We divide the triangle into 3 parts based on the relative "share" of the scores
  const scoreTotal = pS + oS + dS || 1; // Avoid divide by zero
  const wp = pS / scoreTotal;
  const wo = oS / scoreTotal;
  const wd = dS / scoreTotal;

  // Meeting point (C) based on weights
  // Note: Area(O-D-C) is proportional to wp
  const C = {
    x: wp * P.x + wo * O.x + wd * D.x,
    y: wp * P.y + wo * O.y + wd * D.y,
  };

  const colors = {
    people: "#E6F0FA",      // Top vertex context -> opposite sector
    operational: "#BFE0F6", // Bottom-left vertex context -> opposite sector
    digital: "#357ABD"      // Bottom-right vertex context -> opposite sector
  };

  const roundedPath = roundedTrianglePath(P, O, D, 0.1);

  return (
    <svg viewBox="0 0 300 300" width="100%">
      <defs>
        <clipPath id="triangleClip">
          <path d={roundedPath} />
        </clipPath>
      </defs>

      <g clipPath="url(#triangleClip)">
        {/* SECTOR 1: PEOPLE (Opposite to P vertex) */}
        <polygon
          points={`${C.x},${C.y} ${O.x},${O.y} ${D.x},${D.y}`}
          fill={colors.people}
          className="transition-all duration-700 ease-in-out"
        />

        {/* SECTOR 2: OPERATIONAL (Opposite to O vertex) */}
        <polygon
          points={`${C.x},${C.y} ${P.x},${P.y} ${D.x},${D.y}`}
          fill={colors.operational}
          className="transition-all duration-700 ease-in-out"
        />

        {/* SECTOR 3: DIGITAL (Opposite to D vertex) */}
        <polygon
          points={`${C.x},${C.y} ${P.x},${P.y} ${O.x},${O.y}`}
          fill={colors.digital}
          className="transition-all duration-700 ease-in-out"
        />
      </g>

      {/* RENDER BORDER */}
      <path
        d={roundedPath}
        fill="none"
        stroke="#E2E8F0"
        strokeWidth="1"
        strokeDasharray="4 2"
      />

      {/* LABELS */}
      <text
        x={P.x}
        y={P.y - 12}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={10}
        className="uppercase"
      >
        <tspan x={P.x} dy="0">People</tspan>
        <tspan x={P.x} dy="1.1em">Potential</tspan>
      </text>

      <text
        x={O.x - 30}
        y={O.y + 15}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={10}
        className="uppercase"
      >
        <tspan x={O.x - 10} dy="0">Operational</tspan>
        <tspan x={O.x - 10} dy="1.1em">Steadiness</tspan>
      </text>

      <text
        x={D.x + 30}
        y={D.y + 15}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={10}
        className="uppercase"
      >
        <tspan x={D.x + 10} dy="0">Digital</tspan>
        <tspan x={D.x + 10} dy="1.1em">Fluency</tspan>
      </text>
    </svg>
  );
}
