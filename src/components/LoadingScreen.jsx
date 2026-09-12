/**
 * LoadingScreen - Minimal neutral grey preloader that decodes all card assets and settles layout geometry before revealing the application.
 * Communicates with: src/App.jsx (receives asset image sources and notifies via onLoaded callback).
 */
import React, { useState, useEffect, useRef } from 'react';

export default function LoadingScreen({
  images = [],
  onLoaded = () => {}
}) {
  const [progress, setProgress] = useState(0);
  const [isComplete, setIsComplete] = useState(false);
  const [isRendered, setIsRendered] = useState(true);

  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;

    const totalAssets = images.length + 1;
    let completedAssets = 0;

    const updateProgress = () => {
      completedAssets += 1;
      const pct = Math.min(100, Math.round((completedAssets / totalAssets) * 100));
      if (mountedRef.current) {
        setProgress(pct);
      }
    };

    const imagePromises = images.map((src) => {
      return new Promise((resolve) => {
        const img = new Image();
        img.src = src;
        if (img.complete) {
          if ('decode' in img) {
            img.decode().then(resolve).catch(resolve);
          } else {
            resolve();
          }
        } else {
          img.onload = () => {
            if ('decode' in img) {
              img.decode().then(resolve).catch(resolve);
            } else {
              resolve();
            }
          };
          img.onerror = resolve;
        }
      }).then(updateProgress);
    });

    const fontPromise = (document.fonts ? document.fonts.ready : Promise.resolve())
      .then(updateProgress)
      .catch(updateProgress);

    Promise.all([...imagePromises, fontPromise]).then(() => {
      setTimeout(() => {
        if (!mountedRef.current) return;
        setIsComplete(true);
        onLoaded();
        setTimeout(() => {
          if (mountedRef.current) {
            setIsRendered(false);
          }
        }, 700);
      }, 350);
    });

    return () => {
      mountedRef.current = false;
    };
  }, [images, onLoaded]);

  if (!isRendered) return null;

  return (
    <div
      className={`fixed inset-0 z-50 bg-[#7f7f7f] flex flex-col items-center justify-center select-none transition-opacity duration-700 ease-in-out ${
        isComplete ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="relative w-44 aspect-[3/4] rounded-2xl bg-[#737373] border border-white/15 shadow-[0_20px_45px_rgba(0,0,0,0.3)] flex flex-col items-center justify-between p-5 overflow-hidden">
        <div className="w-full flex items-center justify-between opacity-40">
          <div className="w-2.5 h-2.5 border-t border-l border-white" />
          <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          <div className="w-2.5 h-2.5 border-t border-r border-white" />
        </div>

        <div className="flex flex-col items-center gap-3 w-full my-auto">
          <div className="w-full h-1 bg-black/25 rounded-full overflow-hidden">
            <div
              className="h-full bg-white/90 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="font-mono text-xs tracking-widest text-white/70">
            {progress}%
          </span>
        </div>

        <div className="w-full flex items-center justify-between opacity-40">
          <div className="w-2.5 h-2.5 border-b border-l border-white" />
          <div className="w-2.5 h-2.5 border-b border-r border-white" />
        </div>
      </div>
    </div>
  );
}
