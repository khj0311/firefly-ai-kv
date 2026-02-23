import { contents } from '@/data/contents';
import { useDraggable } from '@/hooks/useDraggable';
import { pxToVw } from '@/utils';
import gsap from 'gsap';
import { Dispatch, MutableRefObject, SetStateAction, useEffect, useState } from 'react';

interface LandingProps {
  contentsRef: MutableRefObject<HTMLDivElement | null>;
  setCardEls: Dispatch<SetStateAction<NodeListOf<Element> | undefined>>;
  handleOpenPopup: ({ dataId, imageId }: { dataId: string; imageId: number }) => void;
  handleOpenVideoPopup: (src: string) => void;
}

export default function Landing({ contentsRef, setCardEls, handleOpenPopup, handleOpenVideoPopup }: LandingProps) {
  const [posX, setPosX] = useState<number>(0);
  const [posY, setPosY] = useState<number>(0);
  // const contentsRef = useRef<HTMLDivElement | null>(null);
  useDraggable(contentsRef, setPosX, setPosY);

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
          delay: 1.2,
          duration: 0.6,
          ease: 'linear',
        },
        '<',
      );

    setCardEls(cardsEls);
  }, [contentsRef, setCardEls]);

  return (
    <div
      id="contents"
      ref={contentsRef}
      className="absolute flex h-[200vh] w-[200vw] items-center justify-center"
      style={{ width: `${pxToVw(3172)}vw`, height: `${pxToVw(2210)}vw` }}
    >
      {/* Making Film - Video Card */}
      <div
        className="card-item absolute aspect-[748/420] overflow-hidden rounded-md opacity-0"
        style={{
          width: `${pxToVw(748)}vw`,
          height: `${pxToVw(420)}vw`,
          boxShadow: `0px 10px 40px 0px rgba(0, 0, 0, 0.2)`,
          transform: `translate(${posX * -0.02}px, ${posY * -0.02}px)`,
          borderRadius: `${pxToVw(7)}vw`,
        }}
      >
        <button className="relative overflow-hidden" onClick={() => handleOpenVideoPopup('./videos/Making_Film.mp4')}>
          <img
            className="w-full h-auto"
            src="./images/Video_landing.jpg"
            style={{
              width: `${pxToVw(748)}vw`,
              height: `${pxToVw(420)}vw`,
            }}
          />
        </button>
      </div>

      {/* Image Cards */}
      {contents.flatMap((data) =>
        data.images.map((image, index) => (
          <button
            key={`${data.id}-${image.id}-${index}`}
            id={`${data.id}-${image.id}`}
            type="button"
            className="card-item absolute aspect-[4/3] overflow-hidden rounded-md opacity-0 delay-0 duration-100 ease-linear"
            style={{
              width: `${pxToVw(image.width)}vw`,
              height: `${pxToVw(image.height)}vw`,
              top: `calc(50% + ${pxToVw(image.top - 1105)}vw)`,
              left: `calc(50% + ${pxToVw(image.left - 1586)}vw)`,
              boxShadow: `0px 10px 40px 0px rgba(0, 0, 0, 0.2)`,
              transform: `translate(${posX * image.offset}px, ${posY * image.offset}px)`,
              borderRadius: `${pxToVw(7)}vw`,
            }}
            onClick={() => handleOpenPopup({ dataId: data.id, imageId: image.id })}
          >
            <img src={`${image.src}_landing.jpg`} className="object-cover w-full h-full" />
          </button>
        )),
      )}
    </div>
  );
}
