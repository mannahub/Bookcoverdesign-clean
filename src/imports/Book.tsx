import { useState } from 'react';

// ── Color palettes ───────────────────────────────────────────
export type BookColor = 'violet' | 'blue' | 'emerald' | 'rose' | 'amber';

export const BOOK_COLORS: Record<BookColor, {
  hi: string; mid: string; lo: string;
  spine: string; edge: string; textClass: string;
  label: string;
}> = {
  violet:  { hi: '#9069f5', mid: '#8250f0', lo: '#7338e0', spine: '#8250f0', edge: 'rgba(100,50,200,0.55)',  textClass: 'text-violet-900',  label: 'Violet'  },
  blue:    { hi: '#60a5fa', mid: '#3b82f6', lo: '#2563eb', spine: '#3b82f6', edge: 'rgba(30,64,175,0.55)',   textClass: 'text-blue-900',    label: 'Albastru'},
  emerald: { hi: '#34d399', mid: '#10b981', lo: '#059669', spine: '#10b981', edge: 'rgba(6,95,70,0.55)',     textClass: 'text-emerald-900', label: 'Verde'   },
  rose:    { hi: '#fb7185', mid: '#e11d48', lo: '#be123c', spine: '#e11d48', edge: 'rgba(159,18,57,0.55)',   textClass: 'text-rose-900',    label: 'Roșu'    },
  amber:   { hi: '#fbbf24', mid: '#d97706', lo: '#b45309', spine: '#d97706', edge: 'rgba(146,64,14,0.55)',   textClass: 'text-amber-900',   label: 'Auriu'   },
};

// ── Patterns ─────────────────────────────────────────────────
export type BookPattern = 'simplu' | 'dictando' | 'matematica' | 'romana' | 'punctat';

export interface PatternDef {
  label: string;
  backgroundImage: string;
  backgroundSize?: string;
}

export const BOOK_PATTERNS: Record<BookPattern, PatternDef> = {
  simplu: {
    label: 'Simplu',
    backgroundImage: 'none',
  },
  dictando: {
    label: 'Dictando',
    backgroundImage: [
      'repeating-linear-gradient(180deg, transparent, transparent 19px, rgba(255,255,255,0.16) 19px, rgba(255,255,255,0.16) 20px)',
    ].join(', '),
  },
  matematica: {
    label: 'Matematică',
    backgroundImage: [
      'repeating-linear-gradient(180deg, transparent, transparent 15px, rgba(255,255,255,0.14) 15px, rgba(255,255,255,0.14) 16px)',
      'repeating-linear-gradient(90deg, transparent, transparent 15px, rgba(255,255,255,0.14) 15px, rgba(255,255,255,0.14) 16px)',
    ].join(', '),
  },
  romana: {
    label: 'Română',
    backgroundImage: [
      'repeating-linear-gradient(104.8deg, transparent, transparent 31.5px, rgba(255,255,255,0.14) 31.5px, rgba(255,255,255,0.14) 32.5px)',
      'repeating-linear-gradient(180deg, transparent, transparent 52px, rgba(255,255,255,0.11) 52px, rgba(255,255,255,0.11) 53px)',
    ].join(', '),
  },
  punctat: {
    label: 'Punctat',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1px, transparent 1px)',
    backgroundSize: '14px 14px',
  },
};

export const PATTERN_KEYS: BookPattern[] = ['simplu', 'dictando', 'matematica', 'romana', 'punctat'];

// ── Component ────────────────────────────────────────────────
interface BookProps {
  className?: string;
  title?: string;
  color?: BookColor;
  pattern?: BookPattern;
}

export default function Book({
  className,
  title = "HANDBOOK",
  color = 'violet',
  pattern = 'simplu',
}: BookProps) {
  const [hovered, setHovered] = useState(false);
  const palette = BOOK_COLORS[color];
  const pat = BOOK_PATTERNS[pattern];

  // ── Physics ────────────────────────────────────────────────
  const SPRING  = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const GRAVITY = 'cubic-bezier(0.4, 0, 1, 1)';

  const T_IN  = 280;
  const T_OUT = 140;
  const dur   = hovered ? T_IN  : T_OUT;
  const ease  = hovered ? SPRING : GRAVITY;

  const ANGLE = -4;
  const PERSP = 600;

  return (
    <div
      className={`${className || ''}`}
      style={{ perspective: `${PERSP}px`, width: 200, height: 268 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          transform: hovered ? `rotateY(${ANGLE}deg)` : 'rotateY(0deg)',
          transition: `transform ${dur}ms ${ease}`,
          cursor: 'pointer',
        }}
      >
        {/* ── Agrafa 1 (sus) ── */}
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            height: 32, width: 2,
            left: -2, top: 50,
            background: 'linear-gradient(180deg, #bbb 0%, #999 50%, #777 100%)',
            borderRadius: 1, opacity: 0.55,
          }}
        />

        {/* ── Agrafa 2 (jos) ── */}
        <div
          style={{
            position: 'absolute',
            zIndex: 10,
            height: 32, width: 2,
            left: -2, top: 186,
            background: 'linear-gradient(180deg, #bbb 0%, #999 50%, #777 100%)',
            borderRadius: 1, opacity: 0.55,
          }}
        />

        {/* ── Back cover ── */}
        <div className="w-[200px] h-[268px] left-0 top-0 absolute bg-white rounded-[20px] shadow-[0px_1px_1px_0px_rgba(0,0,0,0.15)]" />

        {/* ── Pages ── */}
        <div
          className="w-[200px] h-[266px] left-0 top-0 absolute bg-neutral-200 rounded-[20px]"
          style={{
            opacity: hovered ? 1 : 0,
            transition: hovered
              ? `opacity 160ms ${SPRING}`
              : `opacity 80ms ${GRAVITY}`,
          }}
        />

        {/* ── Front cover ── */}
        <div
          className="w-[200px] left-0 top-0 absolute rounded-[20px] overflow-hidden"
          style={{
            height: hovered ? 263 : 268,
            transition: hovered
              ? `height ${T_IN}ms ${SPRING}`
              : `height ${T_OUT}ms ${GRAVITY}`,
          }}
        >
          {/* Base gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: [
                `linear-gradient(to right, ${palette.mid} 0%, ${palette.mid} 1%, rgba(255,255,255,0) 3%)`,
                `linear-gradient(135deg, ${palette.hi} 0%, ${palette.mid} 46%, ${palette.lo} 90%, ${palette.hi} 100%)`,
              ].join(', '),
            }}
          />

          {/* ── Pattern overlay ── */}
          {pattern !== 'simplu' && (
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: pat.backgroundImage,
                ...(pat.backgroundSize ? { backgroundSize: pat.backgroundSize } : {}),
              }}
            />
          )}

          {/* Linen texture */}
          <div
            className="absolute inset-0 opacity-[0.07]"
            style={{
              backgroundImage: [
                'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px)',
                'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)',
              ].join(', '),
            }}
          />

          {/* Grain noise */}
          <div
            className="absolute inset-0 opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundSize: '128px 128px',
            }}
          />

          {/* Light overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(to left, rgba(0,0,0,0.08), rgba(0,0,0,0) 50%, rgba(255,255,255,0.12))',
              opacity: hovered ? 0.6 : 1,
              transition: hovered
                ? `opacity 200ms ${SPRING}`
                : `opacity 100ms ${GRAVITY}`,
            }}
          />

          {/* Right edge shadow */}
          <div
            className="absolute right-0 top-0 w-[3px] h-full opacity-40 blur-[0.25px]"
            style={{ background: `linear-gradient(to left, ${palette.edge}, transparent)` }}
          />

          {/* Title — letterpress / debossed */}
          <div
            className={`absolute inset-0 flex items-center justify-center ${palette.textClass} font-bold font-['Raleway']`}
            style={{
              fontSize: '19px',
              textShadow: '-1px -1px 0px rgba(0,0,0,0.18), 1px 1px 0px rgba(255,255,255,0.09)',
              padding: '0 20px',
              textAlign: 'center',
              lineHeight: 1.3,
              wordBreak: 'break-word',
            }}
          >
            {title}
          </div>
        </div>
      </div>
    </div>
  );
}
