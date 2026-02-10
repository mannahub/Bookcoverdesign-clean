import { useState, useRef, useEffect } from 'react';
import { Plus, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getSvgPath } from 'figma-squircle';
import Book, {
  BOOK_COLORS,
  BOOK_PATTERNS,
  COLOR_KEYS,
  PATTERN_KEYS,
  type BookColor,
  type BookPattern,
} from '../../imports/Book';
import { Button } from './ui/button';

const SPRING = { type: 'spring', stiffness: 400, damping: 30 };
const SMOOTH = { type: 'spring', stiffness: 300, damping: 25 };
const GENTLE = { type: 'spring', stiffness: 200, damping: 20 };

/* ── Tiny inline label + hint row ── */
function SectionHeader({ label, hint, tooltip }: { label: string; hint: string; tooltip?: string }) {
  const [showTooltip, setShowTooltip] = useState(false);
  
  return (
    <motion.div
      className="flex items-center justify-between"
      style={{ marginBottom: 10 }}
      aria-live="polite"
      aria-atomic="true"
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={GENTLE}
    >
      <div className="flex items-center gap-1.5">
        <span
          style={{
            fontSize: 12,
            fontWeight: 600,
            color: 'rgba(0,0,0,0.6)',
            fontFamily: 'Geist, sans-serif',
            letterSpacing: '-0.01em',
          }}
        >
          {label}
        </span>
        {tooltip && (
          <div className="relative">
            <motion.button
              type="button"
              onHoverStart={() => setShowTooltip(true)}
              onHoverEnd={() => setShowTooltip(false)}
              onFocus={() => setShowTooltip(true)}
              onBlur={() => setShowTooltip(false)}
              aria-label={tooltip}
              className="flex items-center justify-center outline-none"
              style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'rgba(0,0,0,0.08)',
                cursor: 'help',
              }}
              whileHover={{ scale: 1.1, background: 'rgba(0,0,0,0.12)' }}
              whileTap={{ scale: 0.95 }}
              transition={SPRING}
            >
              <Info size={12} strokeWidth={2.5} style={{ color: 'rgba(0,0,0,0.5)' }} />
            </motion.button>
            <AnimatePresence>
              {showTooltip && (
                <motion.div
                  initial={{ opacity: 0, y: -4, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -4, scale: 0.95 }}
                  transition={SPRING}
                  className="absolute left-1/2 bottom-full mb-1.5 z-50 pointer-events-none"
                  style={{
                    transform: 'translateX(-50%)',
                    whiteSpace: 'nowrap',
                    fontSize: 11,
                    fontWeight: 500,
                    color: 'white',
                    background: 'rgba(0,0,0,0.88)',
                    padding: '4px 8px',
                    borderRadius: 6,
                    fontFamily: 'Geist, sans-serif',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.16)',
                  }}
                >
                  {tooltip}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <motion.span
        style={{
          fontSize: 12,
          fontWeight: 600,
          color: 'rgba(0,0,0,0.85)',
          fontFamily: 'Geist, sans-serif',
        }}
        key={hint}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={SPRING}
      >
        {hint}
      </motion.span>
    </motion.div>
  );
}

/* ── Apple-style separator ── */
function Separator() {
  return (
    <motion.div
      initial={{ opacity: 0, scaleX: 0.8 }}
      animate={{ opacity: 1, scaleX: 1 }}
      transition={GENTLE}
      style={{
        height: 1,
        background: 'rgba(0,0,0,0.08)',
        margin: '16px 0',
      }}
    />
  );
}

interface AddBookCardProps {
  onAdd: (title: string, color: BookColor, pattern: BookPattern) => void;
}

export function AddBookCard({ onAdd }: AddBookCardProps) {
  const [open, setOpen] = useState(false);
  const [cardHovered, setCardHovered] = useState(false);

  const [selectedColor, setSelectedColor] = useState<BookColor>('violet');
  const [selectedPattern, setSelectedPattern] = useState<BookPattern>('simplu');
  const [title, setTitle] = useState('');

  const [hoveredColor, setHoveredColor] = useState<BookColor | null>(null);
  const [hoveredPattern, setHoveredPattern] = useState<BookPattern | null>(null);

  const popoverRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLButtonElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ── Focus trap ──
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => inputRef.current?.focus(), 100);
    return () => clearTimeout(timer);
  }, [open]);

  // ── Body scroll lock (mobile) ──
  useEffect(() => {
    if (open) {
      const originalOverflow = document.body.style.overflow;
      const originalPosition = document.body.style.position;
      document.body.style.overflow = 'hidden';
      document.body.style.position = 'relative';
      
      return () => {
        document.body.style.overflow = originalOverflow;
        document.body.style.position = originalPosition;
      };
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
  const colorHint = BOOK_COLORS[hoveredColor ?? selectedColor].label;
  const patternHint = BOOK_PATTERNS[hoveredPattern ?? selectedPattern].label;

  // ── Squircle paths ──
  const squircleCard = getSvgPath({ width: 200, height: 268, cornerRadius: 20, cornerSmoothing: 1 });
  const squirclePattern = getSvgPath({ width: 36, height: 36, cornerRadius: 8, cornerSmoothing: 1 });
  const squircleInput = getSvgPath({ width: 240, height: 40, cornerRadius: 10, cornerSmoothing: 1 });
  const squircleButton = getSvgPath({ width: 240, height: 40, cornerRadius: 10, cornerSmoothing: 1 });
  const squirclePopover = getSvgPath({ width: 240, height: 400, cornerRadius: 16, cornerSmoothing: 1 });

  return (
    <motion.div 
      className="relative flex flex-col w-[200px]"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={GENTLE}
    >
      {/* ── Trigger card with Motion and SQUIRCLE ── */}
      <motion.svg 
        width="200" 
        height="268" 
        className="absolute top-0 left-0 pointer-events-none" 
        style={{ zIndex: -1 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={SMOOTH}
      >
        <defs>
          <clipPath id="squircle-trigger-card">
            {squircleCard}
          </clipPath>
        </defs>
        <motion.path
          d={squircleCard}
          fill="#ffffff"
          stroke={cardHovered ? '#7c3aed' : '#a78bfa'}
          strokeWidth="3"
          strokeDasharray="8 6"
          vectorEffect="non-scaling-stroke"
          animate={{
            stroke: cardHovered ? '#7c3aed' : '#a78bfa',
          }}
          transition={SMOOTH}
        />
      </motion.svg>
      <motion.button
        ref={cardRef}
        onClick={() => setOpen(!open)}
        onHoverStart={() => setCardHovered(true)}
        onHoverEnd={() => setCardHovered(false)}
        aria-label="Adaugă un caiet nou"
        aria-expanded={open}
        aria-haspopup="dialog"
        className="mb-4 h-[268px] w-[200px] flex flex-col items-center justify-center gap-3 cursor-pointer select-none relative outline-none"
        style={{
          background: 'transparent',
        }}
        transition={SMOOTH}
      >
        {/* Background hover subtle */}
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{
            borderRadius: 20,
            background: 'linear-gradient(135deg, rgba(139,92,246,0.04), rgba(124,58,237,0.06))',
          }}
          animate={{
            opacity: cardHovered ? 1 : 0,
          }}
          transition={SMOOTH}
        />
        
        {/* NO MORE OUTLINE BORDER */}
        
        <motion.div
          className="flex items-center justify-center rounded-full relative z-10"
          style={{
            width: 48,
            height: 48,
          }}
          animate={{
            background: cardHovered ? 'rgba(139,92,246,0.12)' : 'rgba(0,0,0,0.05)',
            scale: cardHovered ? 1.1 : 1,
          }}
          transition={SMOOTH}
        >
          <motion.div
            animate={{
              rotate: cardHovered ? 90 : 0,
            }}
            transition={SMOOTH}
          >
            <Plus
              size={24}
              style={{
                color: cardHovered ? '#7c3aed' : '#9ca3af',
              }}
            />
          </motion.div>
        </motion.div>
        <motion.span
          style={{
            fontSize: 13,
            fontFamily: 'Geist, sans-serif',
            fontWeight: 500,
            letterSpacing: '-0.01em',
          }}
          className="relative z-10"
          animate={{
            color: cardHovered ? '#6d28d9' : '#9ca3af',
          }}
          transition={SMOOTH}
        >
          Adaugă nou caiet
        </motion.span>
      </motion.button>

      {/* ── Popover with AnimatePresence ── */}
      <AnimatePresence>
        {open && (
          <>
            {/* Mobile backdrop */}
            <motion.div
              className="sm:hidden fixed inset-0 bg-black/20 z-40"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              onClick={() => setOpen(false)}
            />

            {/* Popover */}
            <motion.div
              ref={popoverRef}
              role="dialog"
              aria-label="Creează caiet nou"
              aria-modal="true"
              className="popover-container sm:absolute fixed"
              style={{
                bottom: 0,
                left: 0,
                right: 0,
                zIndex: 50,
                width: '100%',
                maxWidth: '100vw',
                padding: '20px 20px calc(20px + env(safe-area-inset-bottom))',
                borderRadius: '16px 16px 0 0',
                background: 'rgba(255,255,255,0.98)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: '1px solid rgba(0,0,0,0.06)',
                boxShadow: '0 -4px 24px rgba(0,0,0,0.12), 0 -2px 8px rgba(0,0,0,0.06)',
              }}
              initial={{ y: '100%', opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: '100%', opacity: 0 }}
              transition={SMOOTH}
            >
              {/* ── Color section ── */}
              <SectionHeader 
                label="Culoare copertă" 
                hint={colorHint}
                tooltip="Alege culoarea copertei caietului"
              />
              <motion.div
                className="flex items-center justify-center gap-[10px]"
                style={{ marginBottom: 0 }}
                role="radiogroup"
                aria-label="Selectează culoarea caietului"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GENTLE, delay: 0.05 }}
              >
                {COLOR_KEYS.map((key) => {
                  const c = BOOK_COLORS[key];
                  const isSelected = key === selectedColor;
                  return (
                    <motion.button
                      key={key}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Culoare ${c.label}`}
                      onClick={() => setSelectedColor(key)}
                      onHoverStart={() => setHoveredColor(key)}
                      onHoverEnd={() => setHoveredColor(null)}
                      style={{
                        width: 24,
                        height: 24,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${c.hi}, ${c.lo})`,
                        cursor: 'pointer',
                        flexShrink: 0,
                        outline: 'none',
                      }}
                      animate={{
                        scale: isSelected ? 1.15 : 1,
                        boxShadow: isSelected
                          ? `0 0 0 2px white, 0 0 0 3.5px ${c.mid}`
                          : 'none',
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={SPRING}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = `0 0 0 2px white, 0 0 0 4px ${c.mid}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = isSelected
                          ? `0 0 0 2px white, 0 0 0 3.5px ${c.mid}`
                          : 'none';
                      }}
                    />
                  );
                })}
              </motion.div>

              {/* Separator */}
              <Separator />

              {/* ── Pattern section ── */}
              <SectionHeader 
                label="Tip foaie" 
                hint={patternHint}
                tooltip="Alege tipul foii caietului"
              />
              <motion.div
                className="flex items-center justify-center gap-[10px]"
                style={{ marginBottom: 0 }}
                role="radiogroup"
                aria-label="Selectează textura caietului"
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GENTLE, delay: 0.08 }}
              >
                {PATTERN_KEYS.map((key) => {
                  const pat = BOOK_PATTERNS[key];
                  const isSelected = key === selectedPattern;
                  const isHovered = key === hoveredPattern;
                  const patternImage = selectedColor === 'white' && pat.darkBackgroundImage 
                    ? pat.darkBackgroundImage 
                    : pat.backgroundImage;
                    
                  return (
                    <motion.button
                      key={key}
                      role="radio"
                      aria-checked={isSelected}
                      aria-label={`Textură ${pat.label}`}
                      onClick={() => setSelectedPattern(key)}
                      onHoverStart={() => setHoveredPattern(key)}
                      onHoverEnd={() => setHoveredPattern(null)}
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        position: 'relative',
                        overflow: 'hidden',
                        cursor: 'pointer',
                        flexShrink: 0,
                        outline: 'none',
                        border: '1px solid rgba(0,0,0,0.08)',
                      }}
                      animate={{
                        scale: isSelected ? 1.08 : 1,
                        boxShadow: isSelected
                          ? selectedColor === 'white'
                            ? `0 0 0 2px white, 0 0 0 3.5px ${activePalette.lo}`
                            : `0 0 0 2px white, 0 0 0 3.5px ${activePalette.mid}`
                          : 'none',
                      }}
                      whileTap={{ scale: 0.95 }}
                      transition={SPRING}
                      onFocus={(e) => {
                        e.currentTarget.style.boxShadow = selectedColor === 'white'
                          ? `0 0 0 2px white, 0 0 0 4px ${activePalette.lo}`
                          : `0 0 0 2px white, 0 0 0 4px ${activePalette.mid}`;
                      }}
                      onBlur={(e) => {
                        e.currentTarget.style.boxShadow = isSelected
                          ? selectedColor === 'white'
                            ? `0 0 0 2px white, 0 0 0 3.5px ${activePalette.lo}`
                            : `0 0 0 2px white, 0 0 0 3.5px ${activePalette.mid}`
                          : 'none';
                      }}
                    >
                      {/* Gradient base */}
                      <motion.div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background: `linear-gradient(135deg, ${activePalette.hi}, ${activePalette.lo})`,
                        }}
                        initial={{ scale: 0.9, opacity: 0.8 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={SMOOTH}
                      />
                      {/* Pattern overlay */}
                      {key !== 'simplu' && (
                        <motion.div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: patternImage,
                            ...(pat.backgroundSize ? { backgroundSize: pat.backgroundSize } : {}),
                            opacity: 1,
                          }}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ ...SMOOTH, delay: 0.05 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* Separator */}
              <Separator />

              {/* ── Title section ── */}
              <SectionHeader 
                label="Titlu caiet" 
                hint=""
                tooltip="Se va afișa cu majuscule"
              />
              <motion.input
                ref={inputRef}
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="ex: NOTIȚE"
                maxLength={30}
                autoFocus
                aria-label="Titlul caietului"
                aria-required="true"
                style={{
                  width: '100%',
                  height: 44,
                  padding: '0 14px',
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderRadius: '10px',
                  background: 'white',
                  outline: 'none',
                  fontSize: 14,
                  fontWeight: 500,
                  color: '#1a1a1a',
                  fontFamily: 'Geist, sans-serif',
                  letterSpacing: '-0.01em',
                }}
                whileFocus={{
                  borderColor: 'rgba(0,0,0,0.22)',
                  boxShadow: '0 0 0 3.5px rgba(0,0,0,0.04)',
                }}
                transition={SMOOTH}
              />

              {/* ── Submit ── */}
              <motion.div
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ ...GENTLE, delay: 0.1 }}
                className="relative mt-2.5"
              >
                <Button
                  onClick={handleSubmit}
                  disabled={!title.trim()}
                  aria-label="Creează caietul"
                  className="w-full h-11"
                  style={{
                    borderRadius: '10px',
                  }}
                  size="default"
                  variant="default"
                >
                  Creează caiet
                </Button>
              </motion.div>
            </motion.div>

            {/* Desktop popover styles */}
            <motion.style
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={GENTLE}
            >{`
              @media (min-width: 640px) {
                .popover-container {
                  position: absolute !important;
                  top: 278px !important;
                  bottom: auto !important;
                  left: 50% !important;
                  right: auto !important;
                  transform: translateX(-50%) !important;
                  width: 280px !important;
                  max-width: none !important;
                  padding: 20px !important;
                  border-radius: 16px !important;
                  box-shadow: 0 8px 40px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04) !important;
                }
              }
            `}</motion.style>
          </>
        )}
      </AnimatePresence>
    </motion.div>
  );
}