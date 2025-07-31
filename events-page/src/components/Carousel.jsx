import React, { useState, useEffect, useRef } from 'react';

const Carousel = ({ slides }) => {
  const [dir, setDir] = useState('');
  const slideRef = useRef();
  const thumbRef = useRef();
  const timeoutRef = useRef();
  const animResetRef = useRef();
  const TIME_RUN = 3000;
  const TIME_AUTO = 7000;

  const show = (type) => {
    const slidesEl = slideRef.current.children;
    const thumbsEl = thumbRef.current.children;
    if (type === 'next') {
      slideRef.current.append(slidesEl[0]);
      thumbRef.current.append(thumbsEl[0]);
      setDir('next');
    } else {
      slideRef.current.prepend(slidesEl[slidesEl.length-1]);
      thumbRef.current.prepend(thumbsEl[thumbsEl.length-1]);
      setDir('prev');
    }
    clearTimeout(animResetRef.current);
    animResetRef.current = setTimeout(() => setDir(''), TIME_RUN);
    resetAuto();
  };

  const resetAuto = () => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => show('next'), TIME_AUTO);
  };

  useEffect(() => {
    resetAuto();
    return () => {
      clearTimeout(timeoutRef.current);
      clearTimeout(animResetRef.current);
    };
  }, []);

  return (
    <div className={`relative w-screen h-[300px] overflow-hidden bg-black ${dir}`}>
      {/* Slide Area */}
      <div ref={slideRef} className="absolute inset-0">
        {slides.map((s,i) => (
          <div key={i} className="absolute inset-0">
            <img src={s.src} className="w-full h-full object-cover" alt="" />
            <div className="absolute top-1/5 left-1/2 transform -translate-x-1/2 w-4/5 md:w-3/5 text-white">
              {/* content */}
              <div className="font-bold tracking-widest">{s.author}</div>
              <div className="text-[5em] font-bold leading-tight">{s.title}</div>
              <div className="text-[5em] font-bold text-orange-600">{s.topic}</div>
              <div className="mt-4 text-base">{s.description}</div>
              <div className="mt-5 grid grid-cols-2 gap-1">
                <button className="bg-white text-black font-medium tracking-wider px-4 py-2">SEE MORE</button>
                <button className="border border-white text-white px-4 py-2">SUBSCRIBE</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Thumbnail Row */}
      <div ref={thumbRef} className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex gap-5 z-10">
        {slides.map((s,i) => (
          <div key={i} className="w-[150px] h-[220px] relative flex-shrink-0">
            <img src={s.src} className="w-full h-full object-cover rounded-xl" alt="" />
            <div className="absolute bottom-2 left-2 right-2 text-white">
              <div className="font-medium">{s.title}</div>
              <div className="font-light text-sm">{s.description}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation Arrows */}
      <div className="absolute top-4/5 right-1/2 transform translate-x-1/2 flex gap-2 z-10">
        <button onClick={() => show('prev')} className="w-10 h-10 rounded-full bg-white/25 hover:bg-white text-white transition" disabled={dir !== ''}>‹</button>
        <button onClick={() => show('next')} className="w-10 h-10 rounded-full bg-white/25 hover:bg-white text-white transition" disabled={dir !== ''}>›</button>
      </div>

      {/* Progress Bar */}
      <div className={`absolute top-0 left-0 h-[3px] bg-orange-600 z-20 ${dir ? 'animate-runningTime' : ''}`} style={{ width: dir ? '100%' : '0%' }} />
    </div>
  );
};

export default Carousel;
