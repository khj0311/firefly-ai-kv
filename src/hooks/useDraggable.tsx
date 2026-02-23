import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import React, { Dispatch, SetStateAction, useEffect, useRef } from 'react';

export function useDraggable(
  ref: React.RefObject<HTMLElement>,
  setPosX: Dispatch<SetStateAction<number>>,
  setPosY: Dispatch<SetStateAction<number>>,
) {
  const dragRef = useRef<Draggable | null>(null);

  const centerBounds = (el: HTMLElement) => {
    const gridWidth = el.offsetWidth;
    const gridHeight = el.offsetHeight;
    const windowWidth = window.innerWidth;
    const windowHeight = window.innerHeight;

    const centerX = (windowWidth - gridWidth) / 2;
    const centerY = (windowHeight - gridHeight) / 2;

    gsap.set(el, {
      x: centerX,
      y: centerY,
      onComplete: () => {
        setTimeout(() => {
          el.style.transition = 'transform 0.45s cubic-bezier(0.33, 1, 0.68, 1)';
        }, 300);
      },
    });
  };

  const calcBounds = (el: HTMLElement) => {
    return {
      minX: -(el.offsetWidth - window.innerWidth),
      maxX: 0,
      minY: -(el.offsetHeight - window.innerHeight),
      maxY: 0,
    };
  };

  useEffect(() => {
    const contentsEl = ref.current;
    if (!contentsEl) return;

    centerBounds(contentsEl);

    const [instance] = Draggable.create(contentsEl, {
      type: 'x,y',
      bounds: calcBounds(contentsEl),
      inertia: true,
      allowEventDefault: true,
      edgeResistance: 0.9,

      onDrag: () => {
        const rect = contentsEl.getBoundingClientRect();
        const offsetX = (contentsEl.offsetWidth - innerWidth) / 2;
        const offsetY = (contentsEl.offsetHeight - innerHeight) / 2;
        const contentsX = rect.x + offsetX;
        const contentsY = rect.y + offsetY;

        setPosX(contentsX);
        setPosY(contentsY);
      },
      onDragStart: () => {
        gsap.set(contentsEl, {
          scale: 0.95,
        });
      },
      onDragEnd: () => {
        gsap.set(contentsEl, {
          scale: 1,
        });
      },
    });

    dragRef.current = instance;

    const onResizeHandler = () => {
      const inst = dragRef.current;
      if (!inst) return;
      inst.applyBounds(calcBounds(contentsEl));
    };

    window.addEventListener('resize', onResizeHandler);

    const ro = new ResizeObserver(onResizeHandler);
    ro.observe(contentsEl);

    return () => {
      instance.kill();
      dragRef.current = null;
      window.removeEventListener('resize', onResizeHandler);
      ro.disconnect();
    };
  }, [ref, setPosX, setPosY]);
}
