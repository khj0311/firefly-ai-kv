import { gsap } from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useCallback, useMemo, useRef, useState } from 'react';

import SlidePopup from '@/components/popup/slidePopup';
import Landing from './components/landing/landing';
import VideoPopup from './components/popup/videoPopup';
import { contents } from './data/contents';
import { pxToVw } from './utils';
import LandingB from './components/landing/landingB';
import ProcessPopup from './components/popup/processPopup';

gsap.registerPlugin(Draggable);

const draggable: boolean = true;

function App() {
  const contentsRef = useRef<HTMLDivElement | null>(null);

  // slidePopup
  const [cardEls, setCardEls] = useState<NodeListOf<Element>>();
  const [isSlidePopupOpen, setIsSlidePopupOpen] = useState(false);
  const [slidePopupData, setSlidePopupData] = useState<{ dataId: string | null; imageId: number | null }>({
    dataId: null,
    imageId: null,
  });

  const selectedContent = useMemo(() => contents.find((content) => content.id === slidePopupData.dataId), [slidePopupData.dataId]);

  const centerBounds = () => {
    const contentsEl = contentsRef.current;
    if (!contentsEl) return;

    gsap.to(contentsEl, {
      duration: 0.6,
      x: (innerWidth - contentsEl.offsetWidth) / 2,
      y: (innerHeight - contentsEl.offsetHeight) / 2,
    });
  };

  const onFadeInCards = useCallback(
    (callback: () => void) => {
      const timeline = gsap.timeline();
      const contentsEl = contentsRef.current;

      if (!cardEls || !cardEls.length || !contentsEl) return;

      timeline.to(cardEls, {
        scale: 1,
        opacity: 1,
        duration: 0.3,
        ease: 'power3.out',
        stagger: {
          amount: 0.3,
          from: 'random',
        },
        onStart: () => {
          callback();
        },
        onComplete: () => {
          !isSlidePopupOpen && centerBounds();
        },
      });
    },
    [isSlidePopupOpen, cardEls],
  );

  const onFadeOutCards = useCallback(
    (callback: () => void) => {
      const timeline = gsap.timeline();

      if (!cardEls || !cardEls.length) return;

      timeline.to(cardEls, {
        scale: 0.5,
        opacity: 0,
        duration: 0.3,
        ease: 'power3.out',
        stagger: {
          amount: 0.3,
          from: 'random',
        },
        onComplete: () => {
          callback();
        },
      });
    },
    [cardEls],
  );

  const handleOpenPopup = useCallback(
    ({ dataId, imageId }: { dataId: string; imageId: number }) => {
      onFadeOutCards(() => {
        setSlidePopupData({ dataId, imageId });
        setIsSlidePopupOpen(true);
      });
    },
    [onFadeOutCards],
  );

  const handleClosePopup = useCallback(() => {
    onFadeInCards(() => {
      setIsSlidePopupOpen(false);
      setSlidePopupData({ dataId: null, imageId: null });
    });
  }, [onFadeInCards]);

  // videoPopup
  const [isVideoPopupOpen, setIsVideoPopupOpen] = useState(false);
  const [videoSrc, setVideoSrc] = useState<string>('');

  const handleOpenVideoPopup = useCallback(
    (src: string) => {
      onFadeOutCards(() => {
        setVideoSrc(src);
        setIsVideoPopupOpen(true);
      });
    },
    [onFadeOutCards],
  );

  const handleCloseVideoPopup = useCallback(() => {
    onFadeInCards(() => {
      setIsVideoPopupOpen(false);
      setVideoSrc('');
    });
  }, [onFadeInCards]);

  // processPopup
  const [isProcessPopupOpen, setIsProcessPopupOpen] = useState(false);

  const handleOpenProcessPopup = useCallback(() => {
    onFadeOutCards(() => {
      setIsProcessPopupOpen(true);
    });
  }, [onFadeOutCards]);

  const handleCloseProcessPopup = useCallback(() => {
    onFadeInCards(() => {
      setIsProcessPopupOpen(false);
    });
  }, [onFadeInCards]);

  return (
    <>
      <div id="container" className="fixed left-0 top-0 h-screen w-screen origin-center overflow-hidden bg-[#eeeeee] will-change-transform">
        {/* Logo */}
        <div className="absolute z-[9999]" style={{ top: `${pxToVw(40)}vw`, left: `${pxToVw(40)}vw` }}>
          <button onClick={centerBounds}>
            <img className="relative" src="./images/Logo.png" style={{ width: `${pxToVw(192)}vw`, height: `${pxToVw(60)}vw` }} />
          </button>
        </div>
        {draggable ? (
          <Landing
            contentsRef={contentsRef}
            setCardEls={setCardEls}
            handleOpenPopup={handleOpenPopup}
            handleOpenVideoPopup={handleOpenVideoPopup}
          />
        ) : (
          <LandingB
            contentsRef={contentsRef}
            setCardEls={setCardEls}
            handleOpenPopup={handleOpenPopup}
            handleOpenVideoPopup={handleOpenVideoPopup}
          />
        )}
        {/* Compliance */}
        <div
          className="absolute z-[2000] text-[#989898]"
          style={{ fontSize: `${pxToVw(16)}vw`, bottom: `${pxToVw(22)}vw`, left: `${pxToVw(24)}vw` }}
        >
          본 영상 및 시연은 내부 쇼케이스용으로, 상업적 활용 목적이 아닙니다.
        </div>
        {/* Process */}
        <div className="absolute z-[9999]" style={{ bottom: `${pxToVw(40)}vw`, right: `${pxToVw(40)}vw` }}>
          <button
            className="relative overflow-hidden rounded-full bg-[#444444] font-bold text-white"
            style={{
              width: `${pxToVw(164)}vw`,
              height: `${pxToVw(48)}vw`,
              fontSize: `${pxToVw(20)}vw`,
              boxShadow: `0px 10px 40px 0px rgba(0, 0, 0, 0.2)`,
            }}
            onClick={handleOpenProcessPopup}
          >
            View Process
          </button>
        </div>
      </div>

      {isSlidePopupOpen && selectedContent && slidePopupData.imageId !== null && (
        <SlidePopup data={selectedContent} isOpen={isSlidePopupOpen} onClose={handleClosePopup} imageId={slidePopupData.imageId} />
      )}
      {isVideoPopupOpen && <VideoPopup videoSrc={videoSrc} isOpen={isVideoPopupOpen} onClose={handleCloseVideoPopup} />}

      {isProcessPopupOpen && <ProcessPopup isOpen={isProcessPopupOpen} onClose={handleCloseProcessPopup} />}
    </>
  );
}

export default App;
