import { useSlideAnimation } from '@/hooks/useSlideAnimation';
import { ChevronDown } from 'lucide-react';
import { useEffect, useRef } from 'react';

interface ProcessPopupProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ProcessPopup({ isOpen, onClose }: ProcessPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const { open, close } = useSlideAnimation(popupRef, onClose);

  useEffect(() => {
    if (isOpen) open();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="absolute top-0 left-0 w-screen h-screen overflow-hidden">
      <div
        ref={popupRef}
        className={`absolute left-1/2 top-1/2 z-[9998] h-full w-full -translate-x-1/2 -translate-y-1/2 space-y-[7.71vw] bg-[#eeeeee] px-[8.33vw] pt-[9.38vw]`}
      >
        <img className="w-full h-auto" src="./images/Process_make.png" />
        <img className="w-full h-auto" src="./images/Process_keypoint.png" />
      </div>

      <button
        className="shadow-m absolute bottom-[2.08vw] left-1/2 z-[9999] flex h-[4.06vw] w-[4.06vw] -translate-x-1/2 items-center justify-center rounded-full bg-[#808080] backdrop-blur-[1.04vw]"
        onClick={close}
      >
        <ChevronDown className="h-[1.77vw] w-[1.77vw] text-white" />
      </button>
    </div>
  );
}
