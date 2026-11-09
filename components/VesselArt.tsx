import type { VesselArt as Art } from '@/lib/products';

const SPARK =
  '638,10 662,265 877,125 693,305 935,385 683,352 770,595 637,375 507,595 593,352 340,385 583,305 400,125 613,265';

/** Ilustração do pote de cerâmica com a vela acesa (a faísca é a chama). */
export function VesselArt({ art, label, lit = true }: { art: Art; label: string; lit?: boolean }) {
  return (
    <svg viewBox="0 0 200 240" role="img" aria-label={label}>
      <ellipse cx="100" cy="228" rx="76" ry="7" fill="#27031D" opacity="0.18" />
      <path d="M30 92 C 27 140, 31 196, 40 222 C 72 233, 128 233, 160 222 C 169 196, 173 140, 170 92 Z" fill={art.body} />
      <path
        d="M33 150 C 60 138, 80 162, 100 150 C 120 138, 140 162, 168 150"
        fill="none"
        stroke={art.paint}
        strokeWidth="6"
        strokeLinecap="round"
      />
      <circle cx="62" cy="192" r="5" fill={art.paint} />
      <circle cx="100" cy="196" r="5" fill={art.paint} />
      <circle cx="138" cy="192" r="5" fill={art.paint} />
      <ellipse cx="100" cy="92" rx="70" ry="14" fill={art.rim} />
      <ellipse cx="100" cy="93" rx="60" ry="10" fill="#F1EEDF" />
      <line x1="100" y1="92" x2="100" y2="74" stroke="#27031D" strokeWidth="3" strokeLinecap="round" />
      {lit && (
        <g transform="translate(100 54) scale(0.085) translate(-637.5 -302)">
          <polygon fill="#AD9317" points={SPARK} />
        </g>
      )}
    </svg>
  );
}
