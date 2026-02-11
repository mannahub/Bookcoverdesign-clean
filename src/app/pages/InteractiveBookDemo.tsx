import { useState } from 'react';
import InteractiveBook3D from '@/components/InteractiveBook3D';
import { BOOK_COLORS, BOOK_PATTERNS, COLOR_KEYS, PATTERN_KEYS, type BookColor, type BookPattern } from '@/imports/Book';
import { motion } from 'motion/react';

interface InteractiveBookDemoProps {
  onBack?: () => void;
}

export default function InteractiveBookDemo({ onBack }: InteractiveBookDemoProps) {
  const [selectedColor, setSelectedColor] = useState<BookColor>('purple');
  const [selectedPattern, setSelectedPattern] = useState<BookPattern>('simplu');
  const [title, setTitle] = useState('HANDBOOK');

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2" style={{ fontFamily: 'Geist' }}>
              Caiet Interactiv 3D
            </h1>
            <p className="text-slate-600" style={{ fontFamily: 'Geist' }}>
              Interacționează cu caietul folosind mouse-ul
            </p>
          </div>
          {onBack && (
            <button
              onClick={onBack}
              style={{
                fontFamily: 'Geist',
                fontWeight: 500,
                fontSize: 14,
                padding: '8px 16px',
                borderRadius: 8,
                background: 'rgba(0,0,0,0.05)',
                border: 'none',
                color: '#1a1a1a',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(0,0,0,0.05)';
              }}
            >
              ← Înapoi la Bibliotecă
            </button>
          )}
        </div>

        {/* Main area with book */}
        <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
          <div className="h-[500px] w-full">
            <InteractiveBook3D 
              color={selectedColor} 
              pattern={selectedPattern}
              title={title}
            />
          </div>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Color selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: 'Geist' }}>
                Culoare
              </label>
              <div className="flex gap-3 flex-wrap">
                {COLOR_KEYS.map((key) => {
                  const c = BOOK_COLORS[key];
                  const isSelected = key === selectedColor;
                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedColor(key)}
                      className="relative"
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${c.hi}, ${c.lo})`,
                        border: isSelected ? `3px solid ${c.mid}` : '3px solid transparent',
                        transition: 'all 0.2s ease',
                      }}
                      aria-label={c.label}
                    />
                  );
                })}
              </div>
            </div>

            {/* Pattern selector */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: 'Geist' }}>
                Pattern
              </label>
              <div className="flex gap-3 flex-wrap">
                {PATTERN_KEYS.map((key) => {
                  const pat = BOOK_PATTERNS[key];
                  const isSelected = key === selectedPattern;
                  const activePalette = BOOK_COLORS[selectedColor];
                  
                  let patternImage = selectedColor === 'white' && pat.darkBackgroundImage 
                    ? pat.darkBackgroundImage 
                    : pat.backgroundImage;

                  // Boost visibility
                  if (key !== 'simplu') {
                    if (selectedColor === 'white') {
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

                  return (
                    <button
                      key={key}
                      onClick={() => setSelectedPattern(key)}
                      className="relative"
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 8,
                        background: `linear-gradient(135deg, ${activePalette.hi}, ${activePalette.lo})`,
                        border: isSelected ? `2px solid ${activePalette.mid}` : '1px solid rgba(0,0,0,0.1)',
                        transition: 'all 0.2s ease',
                        overflow: 'hidden',
                      }}
                      aria-label={pat.label}
                    >
                      {key !== 'simplu' && (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            backgroundImage: patternImage,
                            ...(pat.backgroundSize ? { backgroundSize: pat.backgroundSize } : {}),
                          }}
                        />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Title input */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-3" style={{ fontFamily: 'Geist' }}>
                Titlu
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value.toUpperCase())}
                maxLength={30}
                placeholder="HANDBOOK"
                style={{
                  fontFamily: 'Geist',
                  width: '100%',
                  height: 44,
                  padding: '0 14px',
                  border: '2px solid rgba(0,0,0,0.1)',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 500,
                }}
                onFocus={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.3)'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(0,0,0,0.1)'}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
