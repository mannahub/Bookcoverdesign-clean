import { useId, useMemo, useState } from 'react';
import { getSvgPath } from 'figma-squircle';
import { motion } from 'motion/react';

// ── Color palettes ───────────────────────────────────────────
export type BookColor = 'violet' | 'blue' | 'emerald' | 'rose' | 'amber' | 'slate' | 'white';

export const BOOK_COLORS: Record<BookColor, {
  hi: string; mid: string; lo: string;
  spine: string; edge: string; textClass: string;
  label: string;
  textColor: string;
  textShadow: string;
}> = {
  violet:  { 
    hi: '#a78bfa', mid: '#8b5cf6', lo: '#7c3aed', 
    spine: '#8b5cf6', edge: 'rgba(109,40,217,0.6)',  
    textClass: 'text-white',  
    label: 'Violet',
    textColor: 'rgba(255,255,255,0.98)',
    textShadow: '0 1px 0 rgba(0,0,0,0.25), 0 -1px 0 rgba(255,255,255,0.12)'
  },
  blue:    { 
    hi: '#60a5fa', mid: '#3b82f6', lo: '#2563eb', 
    spine: '#3b82f6', edge: 'rgba(29,78,216,0.6)',   
    textClass: 'text-white',    
    label: 'Albastru',
    textColor: 'rgba(255,255,255,0.98)',
    textShadow: '0 1px 0 rgba(0,0,0,0.25), 0 -1px 0 rgba(255,255,255,0.12)'
  },
  emerald: { 
    hi: '#34d399', mid: '#10b981', lo: '#059669', 
    spine: '#10b981', edge: 'rgba(4,120,87,0.6)',     
    textClass: 'text-white', 
    label: 'Verde',
    textColor: 'rgba(255,255,255,0.98)',
    textShadow: '0 1px 0 rgba(0,0,0,0.25), 0 -1px 0 rgba(255,255,255,0.12)'
  },
  rose:    { 
    hi: '#fb7185', mid: '#f43f5e', lo: '#e11d48', 
    spine: '#f43f5e', edge: 'rgba(190,18,60,0.6)',   
    textClass: 'text-white',    
    label: 'Roșu',
    textColor: 'rgba(255,255,255,0.98)',
    textShadow: '0 1px 0 rgba(0,0,0,0.25), 0 -1px 0 rgba(255,255,255,0.12)'
  },
  amber:   { 
    hi: '#fcd34d', mid: '#f59e0b', lo: '#d97706', 
    spine: '#f59e0b', edge: 'rgba(180,83,9,0.6)',   
    textClass: 'text-amber-950',   
    label: 'Auriu',
    textColor: 'rgba(20,16,5,0.88)',
    textShadow: '0 1px 0 rgba(255,255,255,0.4), 0 -1px 0 rgba(0,0,0,0.15)'
  },
  slate:   { 
    hi: '#64748b', mid: '#475569', lo: '#334155', 
    spine: '#475569', edge: 'rgba(30,41,59,0.6)',   
    textClass: 'text-white',   
    label: 'Gri închis',
    textColor: 'rgba(255,255,255,0.98)',
    textShadow: '0 1px 0 rgba(0,0,0,0.25), 0 -1px 0 rgba(255,255,255,0.12)'
  },
  white:   { 
    hi: '#ffffff', mid: '#f8fafc', lo: '#e2e8f0', 
    spine: '#f1f5f9', edge: 'rgba(148,163,184,0.6)',   
    textClass: 'text-slate-800',   
    label: 'Alb',
    textColor: 'rgba(30,41,59,0.92)',
    textShadow: '0 1px 0 rgba(255,255,255,0.6), 0 -1px 0 rgba(0,0,0,0.08)'
  },
};

export const COLOR_KEYS: BookColor[] = ['violet', 'blue', 'emerald', 'rose', 'amber', 'slate', 'white'];

// ── Patterns ─────────────────────────────────────────────────
export type BookPattern = 'simplu' | 'dictando' | 'matematica' | 'romana' | 'punctat';

export interface PatternDef {
  label: string;
  backgroundImage: string;
  backgroundSize?: string;
  darkBackgroundImage?: string; // For light backgrounds like white
}

export const BOOK_PATTERNS: Record<BookPattern, PatternDef> = {
  simplu: {
    label: 'Simplu',
    backgroundImage: 'none',
  },
  dictando: {
    label: 'Dictando',
    backgroundImage: [
      'repeating-linear-gradient(180deg, transparent, transparent 18px, rgba(255,255,255,0.15) 18px, rgba(255,255,255,0.15) 20px)',
    ].join(', '),
    darkBackgroundImage: [
      'repeating-linear-gradient(180deg, transparent, transparent 18px, rgba(0,0,0,0.08) 18px, rgba(0,0,0,0.08) 20px)',
    ].join(', '),
  },
  matematica: {
    label: 'Matematică',
    backgroundImage: [
      'repeating-linear-gradient(180deg, transparent, transparent 14px, rgba(255,255,255,0.12) 14px, rgba(255,255,255,0.12) 16px)',
      'repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(255,255,255,0.12) 14px, rgba(255,255,255,0.12) 16px)',
    ].join(', '),
    darkBackgroundImage: [
      'repeating-linear-gradient(180deg, transparent, transparent 14px, rgba(0,0,0,0.07) 14px, rgba(0,0,0,0.07) 16px)',
      'repeating-linear-gradient(90deg, transparent, transparent 14px, rgba(0,0,0,0.07) 14px, rgba(0,0,0,0.07) 16px)',
    ].join(', '),
  },
  romana: {
    label: 'Română',
    backgroundImage: [
      'repeating-linear-gradient(104.8deg, transparent, transparent 30px, rgba(255,255,255,0.13) 30px, rgba(255,255,255,0.13) 32px)',
      'repeating-linear-gradient(180deg, transparent, transparent 50px, rgba(255,255,255,0.1) 50px, rgba(255,255,255,0.1) 52px)',
    ].join(', '),
    darkBackgroundImage: [
      'repeating-linear-gradient(104.8deg, transparent, transparent 30px, rgba(0,0,0,0.08) 30px, rgba(0,0,0,0.08) 32px)',
      'repeating-linear-gradient(180deg, transparent, transparent 50px, rgba(0,0,0,0.06) 50px, rgba(0,0,0,0.06) 52px)',
    ].join(', '),
  },
  punctat: {
    label: 'Punctat',
    backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.18) 1.2px, transparent 1.2px)',
    backgroundSize: '12px 12px',
    darkBackgroundImage: 'radial-gradient(circle, rgba(0,0,0,0.1) 1.2px, transparent 1.2px)',
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
  const clipId = useId();
  const [hovered, setHovered] = useState(false);
  const palette = BOOK_COLORS[color];
  const pat = BOOK_PATTERNS[pattern];

  // Smart text sizing: 20 chars normal, then dynamic reduction, truncate at 30
  const { displayTitle, fontSize } = useMemo(() => {
    const len = title.length;
    
    // Truncate if over 30 characters
    if (len > 30) {
      return {
        displayTitle: title.slice(0, 29) + '…',
        fontSize: 13
      };
    }
    
    // Dynamic font size reduction for 20-30 chars
    if (len > 20) {
      const reduction = (len - 20) * 0.6; // 0.6px per char over 20
      return {
        displayTitle: title,
        fontSize: Math.max(13, 19 - reduction)
      };
    }
    
    // Normal size for <= 20 chars
    return {
      displayTitle: title,
      fontSize: 19
    };
  }, [title]);

  // Use dark patterns for white background
  const patternImage = color === 'white' && pat.darkBackgroundImage 
    ? pat.darkBackgroundImage 
    : pat.backgroundImage;

  // ── Physics ────────────────────────────────────────────────
  const SPRING  = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const GRAVITY = 'cubic-bezier(0.4, 0, 1, 1)';

  const T_IN  = 280;
  const T_OUT = 140;
  const dur   = hovered ? T_IN  : T_OUT;
  const ease  = hovered ? SPRING : GRAVITY;

  const ANGLE = -6;
  const PERSP = 600;

  // ── Squircle paths ──
  const {
    squirclePath,
    squircleSheet1Path,
    squircleSheet2Path,
    squircleShadowPath,
    squircleFrontCollapsed,
    squircleFrontExpanded,
  } = useMemo(
    () => ({
      squirclePath: getSvgPath({ width: 200, height: 268, cornerRadius: 20, cornerSmoothing: 1 }),
      squircleSheet1Path: getSvgPath({ width: 190, height: 260, cornerRadius: 19, cornerSmoothing: 1 }),
      squircleSheet2Path: getSvgPath({ width: 195, height: 264, cornerRadius: 19.5, cornerSmoothing: 1 }),
      squircleShadowPath: getSvgPath({ width: 200, height: 268, cornerRadius: 20, cornerSmoothing: 1 }),
      squircleFrontCollapsed: getSvgPath({ width: 200, height: 268, cornerRadius: 20, cornerSmoothing: 1 }),
      squircleFrontExpanded: getSvgPath({ width: 200, height: 263, cornerRadius: 20, cornerSmoothing: 1 }),
    }),
    []
  );

  return (
    <div
      className={`${className || ''}`}
      style={{ perspective: `${PERSP}px`, width: 200, height: 268 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Caiet ${title}`}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setHovered(true);
        }
      }}
      onKeyUp={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          setHovered(false);
        }
      }}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
    >
      <div
        style={{
          width: '100%',
          height: '100%',
          position: 'relative',
          transformStyle: 'preserve-3d',
          transformOrigin: 'center center',
          transform: hovered ? `translateY(-6px) rotateY(${ANGLE}deg)` : 'translateY(0px) rotateY(0deg)',
          transition: `transform ${dur}ms ${ease}`,
          willChange: 'transform',
          cursor: 'pointer',
        }}
      >
        {/* ── Back cover ── */}
        <svg className="absolute w-[200px] h-[268px] left-0 top-0" style={{ pointerEvents: 'none', zIndex: 1 }}>
          <defs>
            <clipPath id={`squircle-back-${clipId}`}>
              <path d={squirclePath} />
            </clipPath>
          </defs>
        </svg>
        <div 
          className="w-[200px] h-[268px] left-0 top-0 absolute" 
          style={{ clipPath: `url(#squircle-back-${clipId})`, zIndex: 1, background: '#e0e0e0' }}
        />

        {/* ── Pages - Doua foi suprapuse + umbră ── */}
        {/* Prima pagină - alb */}
        <svg className="absolute" width="190" height="260" style={{ left: 3, top: 3, pointerEvents: 'none', zIndex: 3 }}>
          <defs>
            <clipPath id={`squircle-sheet-1-${clipId}`}>
              <path d={squircleSheet1Path} />
            </clipPath>
          </defs>
        </svg>
        <motion.div
          className="absolute"
          initial={false}
          style={{
            left: 3,
            top: 3,
            width: 190,
            height: 260,
            clipPath: `url(#squircle-sheet-1-${clipId})`,
            zIndex: 3,
            background: '#ffffff',
            border: '1px solid rgba(0,0,0,0.15)',
          }}
          animate={{
            opacity: hovered ? 1 : 0,
          }}
          transition={{
            duration: hovered ? 0.18 : 0.1,
            ease: hovered ? [0.25, 0.46, 0.45, 0.94] : [0.55, 0.085, 0.68, 0.53],
          }}
        />
        {/* A doua pagină - gri foarte léger */}
        <svg className="absolute" width="195" height="264" style={{ left: 5, top: 4, pointerEvents: 'none', zIndex: 3.5 }}>
          <defs>
            <clipPath id={`squircle-sheet-2-${clipId}`}>
              <path d={squircleSheet2Path} />
            </clipPath>
          </defs>
        </svg>
        <motion.div
          className="absolute"
          initial={false}
          style={{
            left: 5,
            top: 4,
            width: 195,
            height: 264,
            clipPath: `url(#squircle-sheet-2-${clipId})`,
            zIndex: 3.5,
            background: '#f8f8f8',
            border: '1px solid rgba(0,0,0,0.18)',
          }}
          animate={{
            opacity: hovered ? 1 : 0,
          }}
          transition={{
            duration: hovered ? 0.18 : 0.1,
            ease: hovered ? [0.25, 0.46, 0.45, 0.94] : [0.55, 0.085, 0.68, 0.53],
          }}
        />
        {/* Umbră finală cu squircle - exact ca foaia 2 */}
        <svg className="absolute" width="195" height="264" style={{ left: 5, top: 4, pointerEvents: 'none', zIndex: 4 }}>
          <defs>
            <clipPath id={`squircle-shadow-${clipId}`}>
              <path d={squircleSheet2Path} />
            </clipPath>
          </defs>
        </svg>
        <motion.div
          className="absolute"
          initial={false}
          style={{
            left: 5,
            top: 4,
            width: 195,
            height: 264,
            clipPath: `url(#squircle-shadow-${clipId})`,
            zIndex: 4,
            boxShadow: 'inset -3px 0 6px rgba(0,0,0,0.08)',
            pointerEvents: 'none',
          }}
          animate={{
            opacity: hovered ? 1 : 0,
          }}
          transition={{
            duration: hovered ? 0.18 : 0.1,
            ease: hovered ? [0.25, 0.46, 0.45, 0.94] : [0.55, 0.085, 0.68, 0.53],
          }}
        />

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

        {/* ── Front cover ── */}
        <svg className="absolute w-[200px] h-[268px] left-0 top-0" style={{ pointerEvents: 'none', zIndex: 5 }}>
          <defs>
            <clipPath id={`squircle-front-${clipId}`}>
              <motion.path
                d={squirclePath}
                initial={false}
                animate={{
                  d: hovered ? squircleFrontExpanded : squircleFrontCollapsed
                }}
                transition={{
                  duration: hovered ? T_IN / 1000 : T_OUT / 1000,
                  ease: hovered ? [0.34, 1.56, 0.64, 1] : [0.4, 0, 1, 1],
                }}
              />
            </clipPath>
          </defs>
        </svg>
        <motion.div
          className="w-[200px] h-[268px] left-0 top-0 absolute overflow-hidden"
          initial={false}
          style={{
            clipPath: `url(#squircle-front-${clipId})`,
            zIndex: 5,
          }}
          animate={{
            filter: hovered ? 'brightness(1.04) saturate(1.02)' : 'brightness(1)',
          }}
          transition={{
            duration: hovered ? T_IN / 1000 : T_OUT / 1000,
            ease: hovered ? [0.34, 1.56, 0.64, 1] : [0.4, 0, 1, 1],
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
                backgroundImage: patternImage,
                ...(pat.backgroundSize ? { backgroundSize: pat.backgroundSize } : {}),
                opacity: 0.35,
              }}
            />
          )}

          {/* Linen texture - only for 'simplu' pattern */}
          {pattern === 'simplu' && (
            <div
              className="absolute inset-0 opacity-[0.07]"
              style={{
                backgroundImage: [
                  'repeating-linear-gradient(0deg, transparent, transparent 3px, rgba(255,255,255,0.4) 3px, rgba(255,255,255,0.4) 4px)',
                  'repeating-linear-gradient(90deg, transparent, transparent 3px, rgba(255,255,255,0.3) 3px, rgba(255,255,255,0.3) 4px)',
                ].join(', '),
              }}
            />
          )}

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
            className={`absolute inset-0 flex items-center justify-center ${palette.textClass}`}
            style={{
              padding: '0 20px',
            }}
          >
            <div
              className="font-bold"
              style={{
                fontSize: `${fontSize}px`,
                fontFamily: 'Geist',
                fontWeight: 700,
                color: palette.textColor,
                textShadow: palette.textShadow,
                textAlign: 'center',
                lineHeight: 1.3,
                wordBreak: 'break-word',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden',
              }}
            >
              {displayTitle}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}