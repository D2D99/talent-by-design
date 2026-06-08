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
  const P = { x: center.x, y: center.y - radius }; // Top
  const O = {
    x: center.x - radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  }; // Bottom Left
  const D = {
    x: center.x + radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  }; // Bottom Right

  // Scores
  const pS = data.peoplePotential || 0;
  const oS = data.operationalSteadiness || 0;
  const dS = data.digitalFluency || 0;

  // BARYCENTRIC NORMALIZATION
  // We want the area of each sector to be proportional to its score.
  // Area(COD) = wP * TotalArea (Bottom Sector -> Operational Steadiness)
  // Area(CPD) = wO * TotalArea (Right Sector  -> Digital Fluency)
  // Area(CPO) = wD * TotalArea (Left Sector   -> People Potential)
  const scoreTotal = pS + oS + dS || 1;
  const wP = oS / scoreTotal; 
  const wO = dS / scoreTotal; 
  const wD = pS / scoreTotal; 

  // Meeting point (C) based on weights
  const C = {
    x: wP * P.x + wO * O.x + wD * D.x,
    y: wP * P.y + wO * O.y + wD * D.y,
  };

  const colors = {
    people: "#EDF5FD",   // Lightest — bottom (Operational Steadiness)
    operational: "#C7E0F8", // Medium — right (Digital Fluency)
    digital: "#3C7CBA",  // Dark    — left (People Potential)
  };

  const roundedPath = roundedTrianglePath(P, O, D, 0.1);

  // Percentage values
  const peoplePct = Math.round(pS);
  const operationalPct = Math.round(oS);
  const digitalPct = Math.round(dS);

  return (
    <svg viewBox="0 0 300 300" width="100%" style={{ overflow: "visible" }}>
      <defs>
        <clipPath id="triangleClip">
          <path d={roundedPath} />
        </clipPath>
      </defs>

      <g clipPath="url(#triangleClip)">
        {/* SECTOR 1: bottom face (C-O-D) → Operational Steadiness */}
        <polygon
          points={`${C.x},${C.y} ${O.x},${O.y} ${D.x},${D.y}`}
          fill={colors.people}
        />

        {/* SECTOR 2: right face (C-P-D) → Digital Fluency */}
        <polygon
          points={`${C.x},${C.y} ${P.x},${P.y} ${D.x},${D.y}`}
          fill={colors.operational}
        />

        {/* SECTOR 3: left face (C-P-O) → People Potential (dark) */}
        <polygon
          points={`${C.x},${C.y} ${P.x},${P.y} ${O.x},${O.y}`}
          fill={colors.digital}
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
        y={P.y - 28}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={10}
        className="uppercase"
      >
        <tspan x={P.x} dy="0">People</tspan>
        <tspan x={P.x} dy="1.1em">Potential</tspan>
        <tspan x={P.x} dy="1.2em" fontSize={14}>({peoplePct}%)</tspan>
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
        <tspan x={O.x - 10} dy="1.2em" fontSize={14}>({operationalPct}%)</tspan>
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
        <tspan x={D.x + 10} dy="1.2em" fontSize={14}>({digitalPct}%)</tspan>
      </text>
    </svg>
  );
}
