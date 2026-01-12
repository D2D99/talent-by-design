import type TriangleData from "./types.ts";


type Props = {
  data: TriangleData;
};

const clamp = (v: number) => Math.max(0, Math.min(1, v / 100));

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
  const center = { x: 150, y: 160 };
  const radius = 100;

  const P = { x: center.x, y: center.y - radius };
  const O = {
    x: center.x - radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  };
  const D = {
    x: center.x + radius * Math.sin(Math.PI / 3),
    y: center.y + radius * Math.cos(Math.PI / 3),
  };

  // Normalize values
  const p = clamp(data.peoplePotential);
  const o = clamp(data.operationalSteadiness);
  const d = clamp(data.digitalFluency);

  // Dynamic inner joint (only moving point)
  const joint = {
    x: (P.x * p + O.x * o + D.x * d) / (p + o + d),
    y: (P.y * p + O.y * o + D.y * d) / (p + o + d),
  };

  // Colors
  const colors = {
    P: "#BBDEFB",
    O: "#64B5F6",
    D: "#1E88E5",
  };

  return (
    <svg viewBox="0 0 300 300" width="100%">

      {/* ===== BIG ROUNDED TRIANGLE ===== */}
      <path
        d={roundedTrianglePath(P, O, D, 0.12)}
        fill="none"
        stroke="#1A237E"
        strokeWidth={2}
      />

      {/* ===== CLIP FOR SMALL ROUNDED TRIANGLE ===== */}
      <defs>
        <clipPath id="smallTriangleClip">
          <path d={roundedTrianglePath(P, O, D, 0.12)} />
        </clipPath>
      </defs>

      {/* ===== SMALL TRIANGLE (DYNAMIC SHAPE) ===== */}
      <g clipPath="url(#smallTriangleClip)">
        <polygon
          points={`${P.x},${P.y} ${joint.x},${joint.y} ${O.x},${O.y}`}
          fill={colors.P}
        />
        <polygon
          points={`${O.x},${O.y} ${joint.x},${joint.y} ${D.x},${D.y}`}
          fill={colors.O}
        />
        <polygon
          points={`${D.x},${D.y} ${joint.x},${joint.y} ${P.x},${P.y}`}
          fill={colors.D}
        />
      </g>

      {/* ===== SINGLE-LINE LABELS ===== */}
      <text
        x={P.x}
        y={P.y - 26}
        textAnchor="middle"
        fontWeight="bold"
        fill={colors.P}
      >
        {`P (${data.peoplePotential}%)`}
      </text>

      <text
        x={O.x - 18}
        y={O.y + 28}
        textAnchor="end"
        fontWeight="bold"
        fill={colors.O}
      >
        {`O (${data.operationalSteadiness}%)`}
      </text>

      <text
        x={D.x + 18}
        y={D.y + 28}
        textAnchor="start"
        fontWeight="bold"
        fill={colors.D}
      >
        {`D (${data.digitalFluency}%)`}
      </text>

    </svg>
  );
}
