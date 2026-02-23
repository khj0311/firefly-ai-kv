import gsap from 'gsap';

export function useSlideAnimation(ref: React.RefObject<HTMLDivElement>, onClose: () => void) {
  const open = () => {
    if (!ref.current) return;
    gsap.fromTo(ref.current, { y: '100%', opacity: 0 }, { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out' });
  };

  const close = () => {
    if (!ref.current) return;
    gsap.to(ref.current, {
      y: '100%',
      opacity: 0,
      duration: 0.4,
      ease: 'power3.in',
      onComplete: onClose,
    });
  };

  return { open, close };
}
