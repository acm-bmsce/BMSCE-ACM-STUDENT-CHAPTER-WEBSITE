import { useEffect, useRef, useState } from 'react';

const TextPressure = ({
    text = 'Compressa',
    fontFamily = 'Compressa VF',
    fontUrl = 'https://res.cloudinary.com/dr6lvwubh/raw/upload/v1529908256/CompressaPRO-GX.woff2',

    width = true,
    weight = true,
    italic = false,
    alpha = false,

    flex = true,
    stroke = false,
    scale = false,

    textColor = '#000000ff',
    strokeColor = '#FF0000',
    strokeWidth = 2,
    className = '',

    minFontSize = 24,
}) => {
    const containerRef = useRef(null);
    const titleRef = useRef(null);
    const spansRef = useRef([]);

    const mouseRef = useRef({ x: 0, y: 0 });
    const cursorRef = useRef({ x: 0, y: 0 });

    const [fontSize, setFontSize] = useState(minFontSize);
    const [scaleY, setScaleY] = useState(1);
    const [lineHeight, setLineHeight] = useState(1);
    const [isHovering, setIsHovering] = useState(false);

    const chars = text.split('');

    const dist = (a, b) => {
        const dx = b.x - a.x;
        const dy = b.y - a.y;
        return Math.sqrt(dx * dx + dy * dy);
    };

    useEffect(() => {
        const handleMouseMove = (e) => {
            cursorRef.current.x = e.clientX;
            cursorRef.current.y = e.clientY;
        };
        const handleTouchMove = (e) => {
            const t = e.touches[0];
            cursorRef.current.x = t.clientX;
            cursorRef.current.y = t.clientY;
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('touchmove', handleTouchMove, { passive: false });

        if (containerRef.current) {
            const { left, top, width, height } = containerRef.current.getBoundingClientRect();
            mouseRef.current.x = left + width / 2;
            mouseRef.current.y = top + height / 2;
            cursorRef.current.x = mouseRef.current.x;
            cursorRef.current.y = mouseRef.current.y;
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('touchmove', handleTouchMove);
        };
    }, []);

    const setSize = () => {
        if (!containerRef.current || !titleRef.current) return;

        const { width: containerW, height: containerH } = containerRef.current.getBoundingClientRect();

        let newFontSize = containerW / (chars.length / 2);
        newFontSize = Math.max(newFontSize, minFontSize);

        setFontSize(newFontSize);
        setScaleY(1);
        setLineHeight(1);

        requestAnimationFrame(() => {
            if (!titleRef.current) return;
            const textRect = titleRef.current.getBoundingClientRect();

            if (scale && textRect.height > 0) {
                const yRatio = containerH / textRect.height;
                setScaleY(yRatio);
                setLineHeight(yRatio);
            }
        });
    };

    useEffect(() => {
        setSize();
        window.addEventListener('resize', setSize);
        return () => window.removeEventListener('resize', setSize);
    }, [scale, text]);

    const hoverScaleRef = useRef(0);

    useEffect(() => {
        let rafId;
        const animate = () => {
            const targetScale = isHovering ? 1 : 0;
            hoverScaleRef.current += (targetScale - hoverScaleRef.current) * 0.1;

            if (hoverScaleRef.current > 0.01 || isHovering) {
                mouseRef.current.x += (cursorRef.current.x - mouseRef.current.x) / 15;
                mouseRef.current.y += (cursorRef.current.y - mouseRef.current.y) / 15;

                if (titleRef.current) {
                    const titleRect = titleRef.current.getBoundingClientRect();
                    const maxDist = titleRect.width / 2;

                    spansRef.current.forEach((span) => {
                        if (!span) return;

                        const rect = span.getBoundingClientRect();
                        const charCenter = {
                            x: rect.x + rect.width / 2,
                            y: rect.y + rect.height / 2,
                        };

                        const d = dist(mouseRef.current, charCenter);

                        const getAttr = (distance, minVal, maxVal) => {
                            const val = maxVal - Math.abs((maxVal * distance) / maxDist);
                            return Math.max(minVal, val + minVal);
                        };

                        const proximity = Math.max(0, 1 - (d / maxDist));

                        const targetWdth = width ? 50 + (proximity * 150) : 100;
                        const targetWght = weight ? 100 + (proximity * 900) : 400;
                        const targetItal = italic ? getAttr(d, 0, 1) : 0;

                        // Alpha Logic Update:
                        // Start at 0.5 (dimmed) and add up to 0.5 based on proximity.
                        // Hovered = 1.0, Far away = 0.5
                        const targetAlpha = alpha ? 0.3 + (proximity * 0.7) : 1;

                        const lerp = (start, end, factor) => start + (end - start) * factor;

                        const finalWdth = lerp(70, targetWdth, hoverScaleRef.current);
                        const finalWght = lerp(800, targetWght, hoverScaleRef.current);
                        const finalItal = lerp(0, targetItal, hoverScaleRef.current);
                        const finalAlpha = lerp(1, targetAlpha, hoverScaleRef.current);

                        span.style.opacity = finalAlpha;
                        span.style.fontVariationSettings = `'wght' ${finalWght}, 'wdth' ${finalWdth}, 'ital' ${finalItal}`;
                    });
                }
            }

            rafId = requestAnimationFrame(animate);
        };

        animate();
        return () => cancelAnimationFrame(rafId);
    }, [isHovering, width, weight, italic, alpha, chars.length]);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full overflow-hidden bg-transparent"
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
        >
            <style>{`
        @font-face {
          font-family: '${fontFamily}';
          src: url('${fontUrl}');
          font-style: normal;
        }
        .stroke span {
          position: relative;
          color: ${textColor};
        }
        .stroke span::after {
          content: attr(data-char);
          position: absolute;
          left: 0;
          top: 0;
          color: transparent;
          z-index: -1;
          -webkit-text-stroke-width: ${strokeWidth}px;
          -webkit-text-stroke-color: ${strokeColor};
        }
      `}</style>

            <h3
                ref={titleRef}
                className={`text-pressure-title ${className} ${flex ? 'flex justify-between' : ''} ${stroke ? 'stroke' : ''} uppercase text-center`}
                style={{
                    fontFamily,
                    fontSize: fontSize,
                    lineHeight,
                    transform: `scale(1, ${scaleY})`,
                    transformOrigin: 'center top',
                    margin: 0,
                    fontWeight: 100,
                    color: stroke ? undefined : textColor,
                }}
            >
                {chars.map((char, i) => (
                    <span
                        key={i}
                        ref={(el) => (spansRef.current[i] = el)}
                        data-char={char}
                        className="inline-block"
                        style={{
                            opacity: 1,
                            fontVariationSettings: "'wght' 800, 'wdth' 70, 'ital' 0",
                        }}
                    >
                        {char}
                    </span>
                ))}
            </h3>
        </div>
    );
};

export default TextPressure;
