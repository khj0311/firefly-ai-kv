import { contentsB } from '@/data/contents';
import { pxToVw } from '@/utils';
import gsap from 'gsap';
import { Dispatch, MutableRefObject, SetStateAction, useEffect } from 'react';

interface LandingProps {
  contentsRef: MutableRefObject<HTMLDivElement | null>;
  setCardEls: Dispatch<SetStateAction<NodeListOf<Element> | undefined>>;
  handleOpenPopup: ({ dataId, imageId }: { dataId: string; imageId: number }) => void;
  handleOpenVideoPopup: (src: string) => void;
}

export default function LandingB({ contentsRef, setCardEls, handleOpenPopup, handleOpenVideoPopup }: LandingProps) {
  useEffect(() => {
    const contentsEl = contentsRef.current;
    if (!contentsEl) return;

    const timeline = gsap.timeline();
    const cardsEls = contentsEl.querySelectorAll('.card-item');
    const videoEl = cardsEls[0];
    const odd = Array.from(cardsEls).filter((_, index) => index !== 0 && index % 2 === 0);
    const even = Array.from(cardsEls).filter((_, index) => index !== 0 && index % 2 === 1);

    timeline.set(contentsEl, { scale: 0.9 });
    timeline.set(videoEl, { opacity: 0 });
    timeline.set([...odd, ...even], { opacity: 0 });

    timeline
      .to(
        [...odd, ...even],
        {
          delay: 0.2,
          opacity: 1,
          y: 0,
          duration: 1,
          ease: 'linear',
          stagger: {
            amount: 0.6,
            from: 'random',
          },
        },
        '<',
      )
      .to(
        contentsEl,
        {
          delay: 0.2,
          scale: 1,
          duration: 1,
          ease: 'linear',
        },
        '<',
      )
      .to(
        videoEl,
        {
          opacity: 1,
          delay: 0.8,
          duration: 0.6,
          ease: 'linear',
        },
        '<',
      );

    setCardEls(cardsEls);
  }, [contentsRef, setCardEls]);

  return (
    <div id="contents" ref={contentsRef} className="relative flex items-center justify-center w-full h-full">
      {/* Making Film - Video Card */}
      <div
        className="card-item aspect-[720/400] overflow-hidden rounded-md opacity-0"
        style={{
          width: `${pxToVw(720)}vw`,
          height: `${pxToVw(400)}vw`,
          boxShadow: `0px 10px 40px 0px rgba(0, 0, 0, 0.2)`,
          borderRadius: `${pxToVw(7)}vw`,
        }}
      >
        <button className="relative overflow-hidden" onClick={() => handleOpenVideoPopup('./videos/Making_Film.mp4')}>
          <img
            className="w-full h-auto"
            src="./images/Video_landingB.jpg"
            style={{
              width: `${pxToVw(720)}vw`,
              height: `${pxToVw(400)}vw`,
            }}
          />
        </button>
      </div>

      {/* Image Cards */}
      {contentsB.flatMap((data) =>
        data.images.map((image) => (
          <button
            key={`${data.id}-${image.id}`}
            id={`${data.id}-${image.id}`}
            type="button"
            className="card-item absolute aspect-[4/3] overflow-hidden rounded-md opacity-0 delay-0 duration-100 ease-linear"
            style={{
              width: `${pxToVw(image.width)}vw`,
              height: `${pxToVw(image.height)}vw`,
              top: `calc(50% + ${pxToVw(image.top - 540)}vw)`,
              left: `calc(50% + ${pxToVw(image.left - 960)}vw)`,
              boxShadow: `0px 10px 40px 0px rgba(0, 0, 0, 0.2)`,
              borderRadius: `${pxToVw(7)}vw`,
            }}
            onClick={() => handleOpenPopup({ dataId: data.id, imageId: image.id })}
          >
            <img src={`${image.src}_landingB.jpg`} className="object-cover w-full h-full" />
          </button>
        )),
      )}
    </div>
  );
}
