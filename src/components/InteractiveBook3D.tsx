import { useRef, useState, useMemo, useId } from 'react';
import { motion } from 'motion/react';
import { getSvgPath } from 'figma-squircle';
import { BOOK_COLORS, BOOK_PATTERNS, type BookColor, type BookPattern } from '../imports/Book';

interface InteractiveBook3DProps {
  color?: BookColor;
  pattern?: BookPattern;
  title?: string;
}

export default function InteractiveBook3D({
  color = 'purple',
  pattern = 'simplu',
  title = 'HANDBOOK',
}: InteractiveBook3DProps) {
  const bookRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const uniqueId = useId();

  const palette = BOOK_COLORS[color];
  const patternDef = BOOK_PATTERNS[pattern];

  // Generate unique clip path IDs for this instance
  const clipIds = useMemo(() => ({
    cover: `squircle-cover-${uniqueId}`,
    back: `squircle-back-${uniqueId}`,
    page: `squircle-page-${uniqueId}`,
    sheet1: `squircle-sheet1-${uniqueId}`,
    sheet2: `squircle-sheet2-${uniqueId}`,
  }), [uniqueId]);

  // Generate squircle paths
  const paths = useMemo(() => ({
    cover: getSvgPath({
      width: 200,
      height: 268,
      cornerRadius: 16,
      cornerSmoothing: 1,
    }),
    back: getSvgPath({
      width: 200,
      height: 268,
      cornerRadius: 16,
      cornerSmoothing: 1,
    }),
    page: getSvgPath({
      width: 200,
      height: 268,
      cornerRadius: 16,
      cornerSmoothing: 1,
    }),
    sheet1: getSvgPath({
      width: 190,
      height: 260,
      cornerRadius: 14,
      cornerSmoothing: 1,
    }),
    sheet2: getSvgPath({
      width: 195,
      height: 264,
      cornerRadius: 15,
      cornerSmoothing: 1,
    }),
  }), []);

  // Pattern background with boosted visibility
  let patternImage = (color === 'white' || color === 'yellow') && patternDef.darkBackgroundImage
    ? patternDef.darkBackgroundImage
    : patternDef.backgroundImage;

  if (pattern !== 'simplu') {
    if (color === 'white' || color === 'yellow') {
      patternImage = patternImage
        .replace(/rgba\(0,0,0,0\.06\)/g, 'rgba(0,0,0,0.18)')
        .replace(/rgba\(0,0,0,0\.07\)/g, 'rgba(0,0,0,0.2)')
        .replace(/rgba\(0,0,0,0\.08\)/g, 'rgba(0,0,0,0.22)')
        .replace(/rgba\(0,0,0,0\.1\)/g, 'rgba(0,0,0,0.25)');
    } else {
      patternImage = patternImage
        .replace(/rgba\(255,255,255,0\.1\)/g, 'rgba(255,255,255,0.35)')
        .replace(/rgba\(255,255,255,0\.12\)/g, 'rgba(255,255,255,0.4)')
        .replace(/rgba\(255,255,255,0\.13\)/g, 'rgba(255,255,255,0.42)')
        .replace(/rgba\(255,255,255,0\.15\)/g, 'rgba(255,255,255,0.45)')
        .replace(/rgba\(255,255,255,0\.18\)/g, 'rgba(255,255,255,0.5)');
    }
  }

  // Linear interpolation
  const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!bookRef.current) return;

    const rect = bookRef.current.getBoundingClientRect();
    const cursorX = e.clientX;
    const bookCenterX = rect.left + rect.width / 2;

    const distanceFromCenter = (cursorX - bookCenterX) / (rect.width / 2);
    const targetProgress = lerp(1, 0, (distanceFromCenter + 1) / 2);

    // Limitare la maxim 25%
    setProgress(Math.max(0, Math.min(0.2, targetProgress)));
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    setIsDragging(true);
    handlePointerMove(e);
  };

  const handlePointerUp = () => {
    setIsDragging(false);
    setProgress(0);
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      setProgress(0);
    }
  };

  // Generate 8 pages
  const totalPages = 12;
  const pages = [];

  for (let i = 1; i <= totalPages; i++) {
    const rotationAngle = (i + 1) * 10;

    pages.push(
      <motion.div
        key={i}
        className="absolute"
        style={{
          width: 196,
          height: 264,
          top: 2,
          left: 2,
          borderRadius: 16,
          transformStyle: 'preserve-3d',
          transformOrigin: 'left',
          zIndex: 50 + i,
          background: '#ffffff',
          border: '0.75px solid rgba(0,0,0,0.12)',
          willChange: 'transform',
        }}
        animate={{
          rotateY: progress * -rotationAngle,
        }}
        transition={{
          type: 'spring',
          stiffness: 400,
          damping: 40,
          mass: 0.5,
          restDelta: 0.001,
        }}
      />
    );
  }

  // Truncate title smartly
  const displayTitle = useMemo(() => {
    if (!title) return '';
    if (title.length <= 30) return title;
    return title.slice(0, 30);
  }, [title]);

  return (
    <>
      {/* SVG definitions */}
      <svg width="0" height="0" style={{ position: 'absolute' }}>
        <defs>
          <clipPath id={clipIds.cover} clipPathUnits="objectBoundingBox">
            <path d={paths.cover} transform="scale(0.005, 0.003731343283582)" />
          </clipPath>
          <clipPath id={clipIds.back} clipPathUnits="objectBoundingBox">
            <path d={paths.back} transform="scale(0.005, 0.003731343283582)" />
          </clipPath>
          <clipPath id={clipIds.page} clipPathUnits="objectBoundingBox">
            <path d={paths.page} transform="scale(0.005, 0.003731343283582)" />
          </clipPath>
          <clipPath id={clipIds.sheet1} clipPathUnits="objectBoundingBox">
            <path d={paths.sheet1} transform="scale(0.005263157894, 0.003846153846)" />
          </clipPath>
          <clipPath id={clipIds.sheet2} clipPathUnits="objectBoundingBox">
            <path d={paths.sheet2} transform="scale(0.005128205128, 0.003787878787)" />
          </clipPath>
        </defs>
      </svg>

      <div className="flex w-full h-full items-center justify-center">
        <div
          ref={bookRef}
          className="will-change-transform translate-x-24 md:translate-x-32 touch-none"
          onPointerMove={handlePointerMove}
          onPointerDown={handlePointerDown}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerLeave}
          style={{
            width: 200,
            height: 268,
            perspective: '1500px',
            transformStyle: 'preserve-3d',
            '--book-progress': progress,
          } as React.CSSProperties}
        >
          {/* Back Cover */}
          <div
            className="absolute"
            style={{
              width: 200,
              height: 268,
              clipPath: `url(#${clipIds.back})`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'left',
              background: '#e0e0e0',
              boxShadow: 'inset 0 0 0 0.5px rgba(0,0,0,0.08)',
              zIndex: 1,
            }}
          />

          {/* ── Agrafa 1 (sus) ── */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              height: 32,
              width: 2,
              left: -2,
              top: 50,
              background: 'linear-gradient(180deg, #bbb 0%, #999 50%, #777 100%)',
              borderRadius: 1,
              opacity: 0.55,
            }}
          />

          {/* ── Agrafa 2 (jos) ── */}
          <div
            style={{
              position: 'absolute',
              zIndex: 10,
              height: 32,
              width: 2,
              left: -2,
              top: 186,
              background: 'linear-gradient(180deg, #bbb 0%, #999 50%, #777 100%)',
              borderRadius: 1,
              opacity: 0.55,
            }}
          />

          {/* Pages - all same size, different rotations */}
          {pages}

          {/* Front Cover */}
          <motion.div
            className="absolute"
            style={{
              width: 200,
              height: 268,
              clipPath: `url(#${clipIds.cover})`,
              transformStyle: 'preserve-3d',
              transformOrigin: 'left center',
              zIndex: 200,
              overflow: 'hidden',
              willChange: 'transform',
            }}
            animate={{
              rotateY: progress * -165,
            }}
            transition={{
              type: 'spring',
              stiffness: 400,
              damping: 40,
              mass: 0.5,
              restDelta: 0.001,
            }}
          >
            {/* Gradient base */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${palette.hi}, ${palette.lo})`,
              }}
            />

            {/* Linen texture for "simplu" pattern */}
            {pattern === 'simplu' && (
              <div
                className="absolute inset-0 opacity-40"
                style={{
                  backgroundImage: `
                    linear-gradient(0deg, rgba(255,255,255,0.05) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)
                  `,
                  backgroundSize: '4px 4px',
                }}
              />
            )}

            {/* Pattern overlay */}
            {pattern !== 'simplu' && (
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: patternImage,
                  ...(patternDef.backgroundSize ? { backgroundSize: patternDef.backgroundSize } : {}),
                  opacity: 0.35,
                }}
              />
            )}

            {/* Grain */}
            <div
              className="absolute inset-0 opacity-10"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='2' numOctaves='3' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                backgroundSize: '80px',
              }}
            />

            {/* Title */}
            <div
              className="absolute inset-0 flex items-center justify-center"
              style={{
                padding: '0 20px',
                fontFamily: 'Geist',
                fontWeight: 600,
                fontSize: title.length > 20 ? (title.length > 25 ? 17 : 18) : 19,
                color: color === 'white' ? '#1a1a1a' : '#ffffff',
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                lineHeight: 1.3,
                textAlign: 'center',
                wordBreak: 'break-word',
                zIndex: 10,
              }}
            >
              <div
                style={{
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
              >
                {displayTitle}
              </div>
            </div>

            {/* Cover shadow overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                boxShadow:
                  '0 0 0 0.85px rgba(0, 0, 0, 0.1) inset, 2px 0 1px 0 rgba(0, 0, 0, 0.1) inset, -1.5px 0 1px 0 rgba(0, 0, 0, 0.1) inset, 0 2px 2px 0 rgba(255, 255, 255, 0.1) inset',
                zIndex: 20,
              }}
            />
          </motion.div>
        </div>
      </div>
    </>
  );
}
