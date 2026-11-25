import React, { useState, useEffect, useRef } from 'react';
import { AppLanguage, InstrumentType } from '../types/studio';
import { FretPositionVariation, getMultiInstrumentChordInfo } from '../utils/musicTheory';
import { TRANSLATIONS } from '../i18n/translations';

interface InstrumentChordDiagramProps {
  chordSymbol: string;
  instrument: InstrumentType;
  language?: AppLanguage;
  capo?: number;
  size?: 'sm' | 'md' | 'lg';
  labelBadge?: string;
  highlighted?: boolean;
}

const PIANO_WHITE_PCS = [0, 2, 4, 5, 7, 9, 11, 12, 14, 16, 17, 19, 21, 23];
const PIANO_WHITE_NAMES = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'A', 'B'];
const PIANO_BLACK_KEYS: { midi: number; leftIndex: number; name: string }[] = [
  { midi: 1, leftIndex: 0, name: 'C#' },
  { midi: 3, leftIndex: 1, name: 'D#' },
  { midi: 6, leftIndex: 3, name: 'F#' },
  { midi: 8, leftIndex: 4, name: 'G#' },
  { midi: 10, leftIndex: 5, name: 'A#' },
  { midi: 13, leftIndex: 7, name: 'C#' },
  { midi: 15, leftIndex: 8, name: 'D#' },
  { midi: 18, leftIndex: 10, name: 'F#' },
  { midi: 20, leftIndex: 11, name: 'G#' },
  { midi: 22, leftIndex: 12, name: 'A#' }
];

export const InstrumentChordDiagram: React.FC<InstrumentChordDiagramProps> = ({
  chordSymbol,
  instrument,
  language = 'en',
  capo = 0,
  labelBadge,
  highlighted = false
}) => {
  const t = TRANSLATIONS[language].workspace;
  const info = getMultiInstrumentChordInfo(chordSymbol, capo);
  const positions: FretPositionVariation[] =
    instrument === 'ukulele' ? info.ukulelePositions : info.guitarPositions;

  const [posIndex, setPosIndex] = useState(0);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => {
    setPosIndex(0);
  }, [chordSymbol, instrument, capo]);

  const currentPos = positions[posIndex] || positions[0];

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    if (positions.length <= 1) return;
    if ((e.target as HTMLElement | null)?.closest('.m3-diagram-pos-dot')) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    if (pointerStartRef.current === null || positions.length <= 1) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    pointerStartRef.current = null;
    if (Math.abs(dx) >= 24 && Math.abs(dx) > Math.abs(dy)) {
      if (dx < 0) {
        // Sola sürükleme -> Sonraki pozisyon
        setPosIndex((prev) => (prev + 1) % positions.length);
      } else {
        // Sağa sürükleme -> Önceki pozisyon
        setPosIndex((prev) => (prev - 1 + positions.length) % positions.length);
      }
      return;
    }

    if (
      Math.abs(dx) < 10 &&
      Math.abs(dy) < 10 &&
      !(e.target as HTMLElement | null)?.closest('.m3-diagram-pos-dot')
    ) {
      // Tıklama / dokunma -> Sonraki basılış varyasyonuna geç
      setPosIndex((prev) => (prev + 1) % positions.length);
    }
  };

  const handlePointerCancel = () => {
    pointerStartRef.current = null;
  };

  const renderLeftInfoColumn = (showPositionDots: boolean) => (
    <div className="m3-diagram-info-col">
      {capo > 0 && instrument !== 'piano' && (
        <span className="m3-diagram-capo-pill" title={`${t.capoBadge}: ${capo}`}>
          {t.capoBadge}: {capo}
        </span>
      )}
      <span className="m3-diagram-role-label">
        {labelBadge || (highlighted ? t.activeDiagramRole : t.nextDiagramRole)}
      </span>
      <span className="m3-diagram-chord-title">{info.symbol}</span>

      {showPositionDots && positions.length > 1 && (
        <div className="m3-diagram-pos-dots">
          {positions.map((_, idx) => (
            <div
              key={idx}
              role="button"
              tabIndex={0}
              onPointerDown={(e) => e.stopPropagation()}
              onClick={(e) => {
                e.stopPropagation();
                setPosIndex(idx);
              }}
              title={t.positionTooltip(idx + 1, positions[idx].baseFret)}
              className={`m3-diagram-pos-dot ${idx === posIndex ? 'is-active' : ''}`}
            />
          ))}
        </div>
      )}
    </div>
  );

  if (instrument === 'piano') {
    const activeMidis = new Set(info.pianoMidiKeys);
    const keyWidth = 14;
    const keyHeight = 96;
    const blackWidth = 9.5;
    const blackHeight = 58;
    const totalW = PIANO_WHITE_PCS.length * keyWidth;

    return (
      <div className={`m3-diagram-card is-piano ${highlighted ? 'highlighted' : ''}`}>
        {renderLeftInfoColumn(false)}

        <div className="m3-diagram-visual-col">
          <svg
            width={totalW}
            height={keyHeight + 18}
            viewBox={`0 0 ${totalW} ${keyHeight + 18}`}
            className="m3-diagram-svg m3-diagram-svg-piano"
            style={{ userSelect: 'none', overflow: 'visible' }}
          >
            {PIANO_WHITE_PCS.map((midi, i) => {
              const isActive = activeMidis.has(midi) || activeMidis.has(midi % 12);
              const x = i * keyWidth;
              return (
                <g key={`w-${midi}`}>
                  <rect
                    x={x + 0.5}
                    y={0}
                    width={keyWidth - 1}
                    height={keyHeight}
                    rx={3}
                    fill={isActive ? 'var(--md-sys-color-primary-container)' : '#FFFFFF'}
                    stroke="var(--md-sys-color-outline-variant)"
                    strokeWidth={1}
                  />
                  {isActive && (
                    <>
                      <circle
                        cx={x + keyWidth / 2}
                        cy={keyHeight - 14}
                        r={4.5}
                        fill="var(--md-sys-color-primary)"
                      />
                      <text
                        x={x + keyWidth / 2}
                        y={keyHeight + 13}
                        textAnchor="middle"
                        fontSize={9}
                        fontWeight="600"
                        fill="var(--md-sys-color-primary)"
                      >
                        {PIANO_WHITE_NAMES[i]}
                      </text>
                    </>
                  )}
                </g>
              );
            })}

            {PIANO_BLACK_KEYS.map((bk) => {
              const isActive = activeMidis.has(bk.midi) || activeMidis.has(bk.midi % 12);
              const x = (bk.leftIndex + 1) * keyWidth - blackWidth / 2;
              return (
                <g key={`b-${bk.midi}`}>
                  <rect
                    x={x}
                    y={0}
                    width={blackWidth}
                    height={blackHeight}
                    rx={2.5}
                    fill={isActive ? 'var(--md-sys-color-primary)' : '#1F1F1F'}
                  />
                  {isActive && (
                    <circle
                      cx={x + blackWidth / 2}
                      cy={blackHeight - 10}
                      r={3.2}
                      fill="var(--md-sys-color-on-primary)"
                    />
                  )}
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    );
  }

  const numStrings = instrument === 'ukulele' ? 4 : 6;
  const numFrets = 5;
  const stringGap = 18;
  const fretGap = 19;
  const padLeft = 22;
  const padRight = 12;
  const padTop = 20;
  const padBottom = 18;
  const boardW = (numStrings - 1) * stringGap;
  const boardH = numFrets * fretGap;
  const svgW = padLeft + boardW + padRight;
  const svgH = padTop + boardH + padBottom;

  return (
    <div
      className={`m3-diagram-card ${highlighted ? 'highlighted' : ''} ${positions.length > 1 ? 'is-swipeable' : ''}`}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onPointerLeave={handlePointerCancel}
    >
      {renderLeftInfoColumn(true)}

      <div className="m3-diagram-visual-col">
        <svg
          width={svgW}
          height={svgH}
          viewBox={`0 0 ${svgW} ${svgH}`}
          className="m3-diagram-svg m3-diagram-svg-fret"
          style={{ userSelect: 'none', overflow: 'visible' }}
        >
          {currentPos.baseFret > 1 && (
            <text
              x={padLeft - 7}
              y={padTop + fretGap * 0.65}
              textAnchor="end"
              fontSize={11}
              fontWeight="600"
              fill="var(--md-sys-color-primary)"
            >
              {currentPos.baseFret}fr
            </text>
          )}

          {Array.from({ length: numFrets + 1 }).map((_, fIdx) => {
            const y = padTop + fIdx * fretGap;
            const isNut = fIdx === 0 && currentPos.baseFret === 1;
            return (
              <line
                key={`f-${fIdx}`}
                x1={padLeft}
                y1={y}
                x2={padLeft + boardW}
                y2={y}
                stroke={isNut ? 'var(--md-sys-color-on-surface)' : 'var(--md-sys-color-outline-variant)'}
                strokeWidth={isNut ? 3 : 1.1}
                strokeLinecap="round"
              />
            );
          })}

          {Array.from({ length: numStrings }).map((_, sIdx) => {
            const x = padLeft + sIdx * stringGap;
            return (
              <line
                key={`s-${sIdx}`}
                x1={x}
                y1={padTop}
                x2={x}
                y2={padTop + boardH}
                stroke="var(--md-sys-color-outline)"
                strokeWidth={1.2}
              />
            );
          })}

          {currentPos.frets.slice(0, numStrings).map((fret, sIdx) => {
            const x = padLeft + sIdx * stringGap;
            const noteLbl = currentPos.stringNotes[sIdx] || '';
            return (
              <g key={`m-${sIdx}`}>
                {fret === 'x' && (
                  <text
                    x={x}
                    y={padTop - 6}
                    textAnchor="middle"
                    fontSize={11}
                    fontWeight="600"
                    fill="var(--md-sys-color-on-surface-variant)"
                  >
                    ×
                  </text>
                )}
                {fret === 0 && (
                  <circle
                    cx={x}
                    cy={padTop - 9}
                    r={3.8}
                    fill="none"
                    stroke="var(--md-sys-color-primary)"
                    strokeWidth={1.6}
                  />
                )}
                <text
                  x={x}
                  y={padTop + boardH + 13}
                  textAnchor="middle"
                  fontSize={9.5}
                  fontWeight="600"
                  fill={
                    fret === 'x'
                      ? 'var(--md-sys-color-outline)'
                      : 'var(--md-sys-color-on-surface)'
                  }
                >
                  {noteLbl}
                </text>
              </g>
            );
          })}

          {currentPos.barre && (
            <rect
              x={padLeft + currentPos.barre.fromString * stringGap - 6}
              y={padTop + (currentPos.barre.fret - 0.5) * fretGap - 6}
              width={(currentPos.barre.toString - currentPos.barre.fromString) * stringGap + 12}
              height={12}
              rx={6}
              fill="var(--md-sys-color-primary)"
              opacity={0.9}
            />
          )}

          {currentPos.frets.slice(0, numStrings).map((fret, sIdx) => {
            if (typeof fret !== 'number' || fret <= 0) return null;
            const x = padLeft + sIdx * stringGap;
            const y = padTop + (fret - 0.5) * fretGap;
            const fingerNum = currentPos.fingers[sIdx] || '';

            return (
              <g key={`dot-${sIdx}`}>
                <circle cx={x} cy={y} r={6.5} fill="var(--md-sys-color-primary)" />
                {fingerNum ? (
                  <text
                    x={x}
                    y={y + 3}
                    textAnchor="middle"
                    fontSize={8.5}
                    fontWeight="600"
                    fill="var(--md-sys-color-on-primary)"
                  >
                    {fingerNum}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
