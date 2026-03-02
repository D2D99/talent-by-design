import type TriangleData from "./types";

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

  // Midpoints of sides
  const Mpo = { x: (P.x + O.x) / 2, y: (P.y + O.y) / 2 };
  const Mod = { x: (O.x + D.x) / 2, y: (O.y + D.y) / 2 };
  const Mdp = { x: (D.x + P.x) / 2, y: (D.y + P.y) / 2 };

  // Normalize values (0 to 1)
  const p = clamp(data.peoplePotential);
  const o = clamp(data.operationalSteadiness);
  const d = clamp(data.digitalFluency);

  // Growth helper: lerps a point V toward the center based on score s
  const grow = (V: any, s: number) => ({
    x: V.x + (center.x - V.x) * s,
    y: V.y + (center.y - V.y) * s,
  });

  const edgeGrow = (V: any, M: any, s: number) => ({
    x: V.x + (M.x - V.x) * s,
    y: V.y + (M.y - V.y) * s,
  });

  // Colors based on user preference
  const colors = {
    P: "#EDF5FD", // Top (People) - Light
    O: "#93C5FD", // Left (Operational) - Medium
    D: "#2563EB", // Right (Digital) - Dark
  };

  return (
    <svg viewBox="0 0 300 300" width="100%">
      {/* ===== BIG ROUNDED TRIANGLE BACKGROUND ===== */}
      <path
        d={roundedTrianglePath(P, O, D, 0.12)}
        fill="#FFFFFF"
        stroke="#E2E8F0"
        strokeWidth={1}
      />

      <defs>
        <clipPath id="triangleClip">
          <path d={roundedTrianglePath(P, O, D, 0.12)} />
        </clipPath>
      </defs>

      <g clipPath="url(#triangleClip)">
        {/* PEOPPLE SECTOR: Vertex P -> Midpoints -> Center */}
        {p > 0 && (
          <polygon
            points={`${P.x},${P.y} ${edgeGrow(P, Mpo, p).x},${edgeGrow(P, Mpo, p).y} ${grow(P, p).x},${grow(P, p).y} ${edgeGrow(P, Mdp, p).x},${edgeGrow(P, Mdp, p).y}`}
            fill={colors.P}
          />
        )}

        {/* OPERATIONAL SECTOR: Vertex O -> Midpoints -> Center */}
        {o > 0 && (
          <polygon
            points={`${O.x},${O.y} ${edgeGrow(O, Mod, o).x},${edgeGrow(O, Mod, o).y} ${grow(O, o).x},${grow(O, o).y} ${edgeGrow(O, Mpo, o).x},${edgeGrow(O, Mpo, o).y}`}
            fill={colors.O}
          />
        )}

        {/* DIGITAL SECTOR: Vertex D -> Midpoints -> Center */}
        {d > 0 && (
          <polygon
            points={`${D.x},${D.y} ${edgeGrow(D, Mdp, d).x},${edgeGrow(D, Mdp, d).y} ${grow(D, d).x},${grow(D, d).y} ${edgeGrow(D, Mod, d).x},${edgeGrow(D, Mod, d).y}`}
            fill={colors.D}
          />
        )}
      </g>

      {/* ===== BOLD LABELS ===== */}
      <text
        x={P.x}
        y={P.y - 15}
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
        x={O.x}
        y={O.y + 30}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={12}
        className="uppercase tracking-tighter"
      >
        <tspan x={O.x} dy="0">Operational</tspan>
        <tspan x={O.x} dy="1.1em">Steadiness</tspan>
      </text>

      <text
        x={D.x}
        y={D.y + 30}
        textAnchor="middle"
        fontWeight="800"
        fill="#1E293B"
        fontSize={12}
        className="uppercase tracking-tighter"
      >
        <tspan x={D.x} dy="0">Digital</tspan>
        <tspan x={D.x} dy="1.1em">Fluency</tspan>
      </text>
    </svg>
  );
}
