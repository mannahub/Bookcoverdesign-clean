import { useState, useRef, useEffect } from 'react';
import { Plus } from 'lucide-react';
import {
  BOOK_COLORS, BOOK_PATTERNS, PATTERN_KEYS,
  type BookColor, type BookPattern,
} from '../../imports/Book';

const SPRING = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
const GRAVITY = 'cubic-bezier(0.4, 0, 1, 1)';

const COLOR_KEYS: BookColor[] = ['violet', 'blue', 'emerald', 'rose', 'amber'];

/* ── Tiny inline label + hint row ── */
function SectionHeader({ label, hint }: { label: string; hint: string }) {
  return (
    <div
      className="flex items-center justify-between"
      style={{ marginBottom: 7 }}
    >
      <span
        style={{
          fontSize: 11,
          color: 'rgba(0,0,0,0.36)',
          fontFamily: 'Raleway, sans-serif',
          letterSpacing: '0.3px',
        }}
      >
        {label}
      </span>
      <span
        style={{
          fontSize: 11,
          color: 'rgba(0,0,0,0.28)',
          fontFamily: 'Raleway, sans-serif',
          transition: 'color 150ms ease',
        }}
      >
        {hint}
      </span>
    </div>
  );
}

interface AddBookCardProps {
  onAdd: (title: string, color: BookColor, pattern: BookPattern) => void;
}

export function AddBookCard({ onAdd }: AddBookCardProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const [selectedColor, setSelectedColor] = useState<BookColor>('violet');
  const [selectedPattern, setSelectedPattern] = useState<BookPattern>('simplu');
  const [title, setTitle] = useState('');

  const [hoveredColor, setHoveredColor] = useState<BookColor | null>(null);
  const [hoveredPattern, setHoveredPattern] = useState<BookPattern | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  // ── Open / close ──
  useEffect(() => {
    if (open) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setVisible(true));
      });
    } else {
      setVisible(false);
      const timer = setTimeout(() => setMounted(false), 180);
      return () => clearTimeout(timer);
    }
  }, [open]);

  // ── Click outside ──
  useEffect(() => {
    if (!open) return;
    function handleClick(e: MouseEvent) {
      if (
        popoverRef.current && !popoverRef.current.contains(e.target as Node) &&
        cardRef.current && !cardRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  function handleSubmit() {
    const trimmed = title.trim();
    if (!trimmed) return;
    onAdd(trimmed.toUpperCase(), selectedColor, selectedPattern);
    setTitle('');
    setSelectedColor('violet');
    setSelectedPattern('simplu');
    setOpen(false);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit();
    if (e.key === 'Escape') setOpen(false);
  }

  const activePalette = BOOK_COLORS[selectedColor];

  // Derive hint text
  const colorHint = BOOK_COLORS[hoveredColor ?? selectedColor].label;
  const patternHint = BOOK_PATTERNS[hoveredPattern ?? selectedPattern].label;

  return (
    <div className="relative flex flex-col w-[200px]">
      {/* ── Trigger card ── */}
      <div
        ref={cardRef}
        onClick={() => setOpen(!open)}
        onMouseEnter={() => setCardHovered(true)}
        onMouseLeave={() => setCardHovered(false)}
        className="mb-4 h-[268px] w-[200px] rounded-[20px] flex flex-col items-center justify-center gap-3 cursor-pointer select-none"
        style={{
          border: '2px dashed',
          borderColor: cardHovered ? '#8b5cf6' : '#d1d5db',
          background: cardHovered ? 'rgba(139,92,246,0.04)' : '#f9fafb',
          transition: `border-color 220ms ${cardHovered ? SPRING : GRAVITY}, background 220ms ${cardHovered ? SPRING : GRAVITY}`,
        }}
      >
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 48,
            height: 48,
            background: cardHovered ? 'rgba(139,92,246,0.12)' : 'rgba(0,0,0,0.05)',
            transition: `background 220ms ${cardHovered ? SPRING : GRAVITY}, transform 280ms ${cardHovered ? SPRING : GRAVITY}`,
            transform: cardHovered ? 'scale(1.1)' : 'scale(1)',
          }}
        >
          <Plus
            size={24}
            style={{
              color: cardHovered ? '#7c3aed' : '#9ca3af',
              transition: `color 220ms ${cardHovered ? SPRING : GRAVITY}, transform 280ms ${cardHovered ? SPRING : GRAVITY}`,
              transform: cardHovered ? 'rotate(90deg)' : 'rotate(0deg)',
            }}
          />
        </div>
        <span
          style={{
            color: cardHovered ? '#6d28d9' : '#9ca3af',
            transition: `color 220ms ${cardHovered ? SPRING : GRAVITY}`,
            fontSize: 13,
          }}
          className="font-['Raleway']"
        >
          Adaugă nou caiet
        </span>
      </div>

      {/* ── Popover ── */}
      {mounted && (
        <div
          ref={popoverRef}
          style={{
            position: 'absolute',
            top: 278,
            left: '50%',
            zIndex: 50,
            width: 224,
            padding: '16px 18px 18px',
            borderRadius: 14,
            background: 'rgba(255,255,255,0.96)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            border: '1px solid rgba(0,0,0,0.06)',
            boxShadow: '0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
            transformOrigin: 'top center',
            transform: visible
              ? 'translateX(-50%) scale(1) translateY(0)'
              : 'translateX(-50%) scale(0.92) translateY(-4px)',
            opacity: visible ? 1 : 0,
            transition: visible
              ? `transform 300ms ${SPRING}, opacity 180ms ease-out`
              : `transform 160ms ${GRAVITY}, opacity 100ms ease-in`,
          }}
        >
          {/* ── Color section ── */}
          <SectionHeader label="Culoare" hint={colorHint} />
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            {COLOR_KEYS.map((key) => {
              const c = BOOK_COLORS[key];
              const isSelected = key === selectedColor;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedColor(key)}
                  onMouseEnter={() => setHoveredColor(key)}
                  onMouseLeave={() => setHoveredColor(null)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: '50%',
                    background: `linear-gradient(135deg, ${c.hi}, ${c.lo})`,
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected
                      ? `0 0 0 2px white, 0 0 0 3.5px ${c.mid}`
                      : `0 1px 3px rgba(0,0,0,0.1)`,
                    transition: `transform 240ms ${SPRING}, box-shadow 240ms ${SPRING}`,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                />
              );
            })}
          </div>

          {/* ── Pattern section ── */}
          <SectionHeader label="Textură" hint={patternHint} />
          <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
            {PATTERN_KEYS.map((key) => {
              const pat = BOOK_PATTERNS[key];
              const isSelected = key === selectedPattern;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedPattern(key)}
                  onMouseEnter={() => setHoveredPattern(key)}
                  onMouseLeave={() => setHoveredPattern(null)}
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 7,
                    position: 'relative',
                    overflow: 'hidden',
                    transform: isSelected ? 'scale(1.12)' : 'scale(1)',
                    boxShadow: isSelected
                      ? `0 0 0 2px white, 0 0 0 3.5px ${activePalette.mid}`
                      : `0 1px 3px rgba(0,0,0,0.1)`,
                    transition: `transform 240ms ${SPRING}, box-shadow 240ms ${SPRING}`,
                    cursor: 'pointer',
                    flexShrink: 0,
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: `linear-gradient(135deg, ${activePalette.hi}, ${activePalette.lo})`,
                    }}
                  />
                  {key !== 'simplu' && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundImage: pat.backgroundImage,
                        ...(pat.backgroundSize ? { backgroundSize: pat.backgroundSize } : {}),
                      }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* ── Title section ── */}
          <SectionHeader label="Titlu" hint="" />
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="ex: NOTIȚE"
            maxLength={30}
            autoFocus
            style={{
              width: '100%',
              height: 36,
              padding: '0 12px',
              borderRadius: 10,
              border: '1px solid rgba(0,0,0,0.09)',
              background: 'rgba(0,0,0,0.025)',
              outline: 'none',
              fontSize: 13,
              color: '#1a1a1a',
              fontFamily: 'Raleway, sans-serif',
              transition: `border-color 200ms ease, box-shadow 200ms ease`,
            }}
            onFocus={(e) => {
              e.target.style.borderColor = activePalette.mid;
              e.target.style.boxShadow = `0 0 0 3px ${activePalette.mid}18`;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = 'rgba(0,0,0,0.09)';
              e.target.style.boxShadow = 'none';
            }}
          />

          {/* ── Submit ── */}
          <button
            onClick={handleSubmit}
            disabled={!title.trim()}
            style={{
              width: '100%',
              height: 36,
              marginTop: 10,
              borderRadius: 10,
              border: 'none',
              background: title.trim() ? activePalette.mid : 'rgba(0,0,0,0.06)',
              color: title.trim() ? '#fff' : 'rgba(0,0,0,0.26)',
              fontSize: 13,
              fontFamily: 'Raleway, sans-serif',
              cursor: title.trim() ? 'pointer' : 'default',
              transition: `background 200ms ease, color 200ms ease`,
            }}
          >
            Creează
          </button>
        </div>
      )}
    </div>
  );
}
